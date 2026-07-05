// ============================================================
//  TecnoExpress — Admin Panel Logic
// ============================================================

// ─── Auth ────────────────────────────────────────────────────
function showLoginError(msg) {
  const err = document.getElementById("login-error");
  err.textContent = msg;
  err.classList.add("show");
  clearTimeout(err._t);
  err._t = setTimeout(() => err.classList.remove("show"), 3500);
}

async function adminLogin() {
  if (!TX.enabled) {
    showLoginError("Supabase no está configurado en js/config.js.");
    return;
  }
  const email = document.getElementById("admin-email").value.trim();
  const pass = document.getElementById("admin-pass").value;
  const btn = document.getElementById("login-btn");
  btn.disabled = true; btn.textContent = "Ingresando...";

  const { error } = await TX.client.auth.signInWithPassword({ email, password: pass });

  btn.disabled = false; btn.textContent = "Acceder al panel →";
  if (error) {
    showLoginError("Correo o contraseña incorrectos.");
    return;
  }
  showApp();
}

async function adminLogout() {
  if (TX.enabled) await TX.client.auth.signOut();
  location.reload();
}

function showApp() {
  document.getElementById("login-screen").hidden = true;
  document.getElementById("admin-app").hidden = false;
  initAdmin();
}

// ─── Init ────────────────────────────────────────────────────
async function initAdmin() {
  await Promise.all([
    loadDashboard(),
    loadProductsTable(),
    loadCategoriesTable(),
    loadOrdersTable(),
    loadSettings()
  ]);
}

// ─── Views ────────────────────────────────────────────────────
const VIEWS = ["dashboard","products","categories","orders","settings"];
const VIEW_TITLES = {
  dashboard:"Dashboard", products:"Productos",
  categories:"Categorías", orders:"Pedidos", settings:"Configuración"
};

function switchView(view) {
  VIEWS.forEach(v => {
    document.getElementById(`view-${v}`).hidden = v !== view;
    const link = document.querySelector(`[data-view="${v}"]`);
    if (link) link.classList.toggle("active", v === view);
  });
  document.getElementById("view-title").textContent = VIEW_TITLES[view] || view;
  if (window.innerWidth < 900) document.getElementById("admin-sidebar").classList.remove("open");
}

function toggleSidebar() {
  document.getElementById("admin-sidebar").classList.toggle("open");
}

// ─── Alert ───────────────────────────────────────────────────
function adminAlert(msg, type = "success") {
  const el = document.getElementById("admin-alert");
  document.getElementById("alert-text").textContent = msg;
  el.className = `alert show ${type}`;
  if (type === "success") {
    document.getElementById("alert-icon").innerHTML = `<path d="M20 6L9 17l-5-5"/>`;
  } else {
    document.getElementById("alert-icon").innerHTML = `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`;
  }
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 3000);
}

// ─── Modals ───────────────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id).hidden = true;
}

let _deleteCallback = null;
function confirmDelete(text, callback) {
  document.getElementById("delete-confirm-text").textContent = text;
  document.getElementById("delete-modal").hidden = false;
  _deleteCallback = callback;
}

// ─── Dashboard ───────────────────────────────────────────────
async function loadDashboard() {
  const [products, orders, orderItems] = await Promise.all([
    Data.getAllProductsAdmin(),
    Data.getAllOrders(),
    Data.getAllOrderItems()
  ]);

  document.getElementById("stat-products").textContent = products.length;
  document.getElementById("stat-orders").textContent = orders.length;

  const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  document.getElementById("stat-revenue").textContent = "S/ " + revenue.toLocaleString("es-PE", { minimumFractionDigits: 0 });

  const pending = orders.filter(o => o.status === "pendiente").length;
  document.getElementById("stat-pending").textContent = pending;

  // Recent products
  const recent = products.slice(-5).reverse();
  document.getElementById("dash-products").innerHTML = recent.length
    ? recent.map(p => `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;border-bottom:1px solid var(--border);">
        <div class="prod-thumb-sm">${thumbHTML(p)}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div>
          <div style="font-size:11.5px;color:var(--muted);">${p.category}</div>
        </div>
        <div style="font-weight:800;font-size:13px;white-space:nowrap;">S/ ${p.price}</div>
      </div>`).join("")
    : emptyRow("Sin productos aún");

  // Recent orders
  const recentOrders = orders.slice(0, 5);
  document.getElementById("dash-orders").innerHTML = recentOrders.length
    ? recentOrders.map(o => `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;border-bottom:1px solid var(--border);">
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:13px;font-family:monospace;">${o.code}</div>
          <div style="font-size:11.5px;color:var(--muted);">${o.customer_name}</div>
        </div>
        <span class="td-badge ${statusClass(o.status)}">${o.status}</span>
        <div style="font-weight:800;font-size:13px;">S/ ${o.total}</div>
      </div>`).join("")
    : emptyRow("Sin pedidos aún");

  renderCharts(orders, orderItems);
}

// ─── Charts ───────────────────────────────────────────────────
let _charts = {};
function destroyChart(id){ if (_charts[id]){ _charts[id].destroy(); delete _charts[id]; } }

function renderCharts(orders, items) {
  if (typeof Chart === "undefined") return;
  Chart.defaults.color = "#64748B";
  Chart.defaults.font.family = "'Plus Jakarta Sans',sans-serif";
  const gridColor = "rgba(255,255,255,.06)";

  // 1) Ingresos por día (últimos 30 días, sin pedidos cancelados)
  const days = [], totalsByDay = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push(key);
    totalsByDay[key] = 0;
  }
  orders.forEach(o => {
    if (o.status === "cancelado" || !o.created_at) return;
    const key = new Date(o.created_at).toISOString().slice(0, 10);
    if (key in totalsByDay) totalsByDay[key] += Number(o.total) || 0;
  });
  destroyChart("revenue");
  _charts.revenue = new Chart(document.getElementById("chart-revenue"), {
    type: "line",
    data: {
      labels: days.map(k => k.slice(8, 10) + "/" + k.slice(5, 7)),
      datasets: [{
        data: days.map(k => totalsByDay[k]),
        borderColor: "#4A8EF5", backgroundColor: "rgba(74,142,245,.15)",
        fill: true, tension: .35, pointRadius: 2, borderWidth: 2
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => "S/ " + c.parsed.y.toLocaleString("es-PE") } }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { maxTicksLimit: 10 } },
        y: { grid: { color: gridColor }, beginAtZero: true, ticks: { callback: v => "S/ " + v } }
      }
    }
  });

  // 2) Pedidos por estado
  const STATUS = ["pendiente", "en proceso", "enviado", "entregado", "cancelado"];
  const STATUS_COLORS = ["#FB923C", "#4A8EF5", "#22D3EE", "#34D399", "#F87171"];
  destroyChart("status");
  _charts.status = new Chart(document.getElementById("chart-status"), {
    type: "doughnut",
    data: {
      labels: STATUS,
      datasets: [{
        data: STATUS.map(s => orders.filter(o => o.status === s).length),
        backgroundColor: STATUS_COLORS, borderColor: "#0D1528", borderWidth: 3
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "62%",
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, boxHeight: 10, padding: 12 } } }
    }
  });

  // 3) Top 5 productos más vendidos (sin pedidos cancelados)
  const cancelled = new Set(orders.filter(o => o.status === "cancelado").map(o => o.id));
  const qtyByName = {};
  items.forEach(it => {
    if (cancelled.has(it.order_id)) return;
    qtyByName[it.product_name] = (qtyByName[it.product_name] || 0) + (Number(it.quantity) || 0);
  });
  const top = Object.entries(qtyByName).sort((a, b) => b[1] - a[1]).slice(0, 5);
  destroyChart("top");
  _charts.top = new Chart(document.getElementById("chart-top"), {
    type: "bar",
    data: {
      labels: top.map(t => t[0]),
      datasets: [{
        data: top.map(t => t[1]),
        backgroundColor: ["#4A8EF5", "#A78BFA", "#22D3EE", "#34D399", "#FB923C"],
        borderRadius: 6, barThickness: 20
      }]
    },
    options: {
      indexAxis: "y", responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => c.parsed.x + " unidades" } }
      },
      scales: {
        x: { grid: { color: gridColor }, beginAtZero: true, ticks: { precision: 0 } },
        y: { grid: { display: false } }
      }
    }
  });
}

// ─── Products ─────────────────────────────────────────────────
let allProducts = [];

async function loadProductsTable() {
  allProducts = await Data.getAllProductsAdmin();
  renderProductsTable(allProducts);
}

function renderProductsTable(products) {
  document.getElementById("products-tbody").innerHTML = products.length
    ? products.map(p => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="prod-thumb-sm">${thumbHTML(p)}</div>
            <div>
              <div class="td-name">${p.name}</div>
              <div style="font-size:11.5px;color:var(--muted);">#${p.id}</div>
            </div>
          </div>
        </td>
        <td style="color:var(--muted);font-size:13px;">${p.category}</td>
        <td class="td-price">S/ ${p.price}</td>
        <td><span class="td-badge ${p.stock > 0 ? 'active' : 'out'}">${p.stock > 0 ? p.stock + ' uds.' : 'Agotado'}</span></td>
        <td>${p.is_bestseller ? `<span class="td-badge done">★ Top</span>` : `<span style="color:var(--muted)">—</span>`}</td>
        <td>
          <div class="admin-actions">
            <button class="btn-icon" title="Editar" onclick="openProductModal(${p.id})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon danger" title="Eliminar" onclick="deleteProduct(${p.id}, ${JSON.stringify(p.name)})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`).join("")
    : `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--muted);">No hay productos. Agrega el primero.</td></tr>`;
}

function filterProducts(q) {
  const lq = q.toLowerCase();
  renderProductsTable(allProducts.filter(p =>
    p.name.toLowerCase().includes(lq) || p.category.toLowerCase().includes(lq)
  ));
}

async function openProductModal(id = null) {
  document.getElementById("product-form").reset();
  document.getElementById("prod-id").value = "";
  document.getElementById("product-modal-title").textContent = id ? "Editar producto" : "Agregar producto";
  document.getElementById("product-submit-btn").textContent = id ? "Guardar cambios" : "Guardar producto";

  const cats = await Data.getCategories();
  document.getElementById("prod-category").innerHTML =
    `<option value="">Selecciona categoría...</option>` +
    cats.map(c => `<option value="${c.slug}">${c.name}</option>`).join("");

  if (id) {
    const p = await Data.getProductById(id);
    if (!p) return;
    document.getElementById("prod-id").value = p.id;
    document.getElementById("prod-name").value = p.name;
    document.getElementById("prod-category").value = p.category;
    document.getElementById("prod-price").value = p.price;
    document.getElementById("prod-old-price").value = p.old_price || "";
    document.getElementById("prod-stock").value = p.stock;
    document.getElementById("prod-badge").value = p.badge || "";
    document.getElementById("prod-bestseller").checked = !!p.is_bestseller;
    document.getElementById("prod-image").value = p.image_url || "";
    document.getElementById("prod-description").value = p.description || "";
    document.getElementById("prod-specs").value =
      Object.entries(p.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n");
  }

  document.getElementById("product-modal").hidden = false;
}

async function submitProduct(e) {
  e.preventDefault();
  const id = document.getElementById("prod-id").value;
  const specsText = document.getElementById("prod-specs").value.trim();
  const specs = {};
  specsText.split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx > 0) specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });

  const oldVal = document.getElementById("prod-old-price").value;
  const product = {
    name: document.getElementById("prod-name").value.trim(),
    slug: toSlug(document.getElementById("prod-name").value),
    category: document.getElementById("prod-category").value,
    price: parseFloat(document.getElementById("prod-price").value),
    old_price: oldVal ? parseFloat(oldVal) : null,
    stock: parseInt(document.getElementById("prod-stock").value),
    badge: document.getElementById("prod-badge").value.trim() || null,
    is_bestseller: document.getElementById("prod-bestseller").checked,
    image_url: document.getElementById("prod-image").value.trim() || null,
    description: document.getElementById("prod-description").value.trim(),
    specs,
  };

  const btn = document.getElementById("product-submit-btn");
  btn.disabled = true; btn.textContent = "Guardando...";

  try {
    if (id) {
      await Data.updateProduct(parseInt(id), product);
      adminAlert("Producto actualizado");
    } else {
      await Data.createProduct(product);
      adminAlert("Producto creado");
    }
    closeModal("product-modal");
    await loadProductsTable();
    await loadDashboard();
  } catch (err) {
    console.error(err);
    adminAlert("Error al guardar el producto", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = id ? "Guardar cambios" : "Guardar producto";
  }
}

async function deleteProduct(id, name) {
  confirmDelete(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`, async () => {
    try {
      await Data.deleteProduct(id);
      adminAlert("Producto eliminado");
      await loadProductsTable();
      await loadDashboard();
    } catch { adminAlert("Error al eliminar", "error"); }
  });
}

// ─── Categories ───────────────────────────────────────────────
let allCategories = [];

async function loadCategoriesTable() {
  allCategories = await Data.getCategories();
  renderCategoriesTable(allCategories);
}

function renderCategoriesTable(cats) {
  document.getElementById("categories-tbody").innerHTML = cats.length
    ? cats.map(c => {
        const count = allProducts.filter(p => p.category === c.slug).length;
        return `<tr>
          <td class="td-name">${c.name}</td>
          <td><code style="background:rgba(74,142,245,.1);color:var(--blue);padding:2px 8px;border-radius:5px;font-size:12px;">${c.slug}</code></td>
          <td style="color:var(--muted);font-size:13px;">${c.description || '—'}</td>
          <td><span class="td-badge active">${count}</span></td>
          <td>
            <div class="admin-actions">
              <button class="btn-icon" onclick="openCategoryModal('${c.slug}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn-icon danger" onclick="deleteCategory('${c.slug}', ${JSON.stringify(c.name)})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </div>
          </td>
        </tr>`;
      }).join("")
    : `<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--muted);">No hay categorías.</td></tr>`;
}

function openCategoryModal(slug = null) {
  document.getElementById("category-form").reset();
  document.getElementById("cat-orig-slug").value = "";
  document.getElementById("category-modal-title").textContent = slug ? "Editar categoría" : "Agregar categoría";

  if (slug) {
    const c = allCategories.find(c => c.slug === slug);
    if (!c) return;
    document.getElementById("cat-orig-slug").value = c.slug;
    document.getElementById("cat-name").value = c.name;
    document.getElementById("cat-slug").value = c.slug;
    document.getElementById("cat-description").value = c.description || "";
  }

  document.getElementById("category-modal").hidden = false;
}

function autoCatSlug(name) {
  if (!document.getElementById("cat-orig-slug").value) {
    document.getElementById("cat-slug").value = toSlug(name);
  }
}

async function submitCategory(e) {
  e.preventDefault();
  const origSlug = document.getElementById("cat-orig-slug").value;
  const cat = {
    slug: document.getElementById("cat-slug").value.trim(),
    name: document.getElementById("cat-name").value.trim(),
    description: document.getElementById("cat-description").value.trim(),
  };
  try {
    if (origSlug) { await Data.updateCategory(origSlug, cat); adminAlert("Categoría actualizada"); }
    else { await Data.createCategory(cat); adminAlert("Categoría creada"); }
    closeModal("category-modal");
    await loadCategoriesTable();
  } catch { adminAlert("Error al guardar la categoría", "error"); }
}

async function deleteCategory(slug, name) {
  confirmDelete(`¿Eliminar la categoría "${name}"?`, async () => {
    try {
      await Data.deleteCategory(slug);
      adminAlert("Categoría eliminada");
      await loadCategoriesTable();
    } catch { adminAlert("Error al eliminar", "error"); }
  });
}

// ─── Orders ───────────────────────────────────────────────────
async function loadOrdersTable() {
  const orders = await Data.getAllOrders();
  const tbody = document.getElementById("orders-tbody");
  const emptyEl = document.getElementById("orders-empty");
  document.getElementById("orders-count").textContent = `${orders.length} pedido(s)`;

  if (!orders.length) {
    tbody.innerHTML = "";
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  tbody.innerHTML = orders.map(o => {
    const date = o.created_at ? new Date(o.created_at).toLocaleDateString("es-PE") : "—";
    return `<tr>
      <td class="td-name" style="font-family:monospace;font-size:12.5px;">${o.code}</td>
      <td>${o.customer_name}</td>
      <td style="color:var(--muted);">${o.city || '—'}</td>
      <td style="color:var(--muted);text-transform:capitalize;">${o.payment_method || '—'}</td>
      <td class="td-price">S/ ${o.total}</td>
      <td>
        <select style="background:var(--card2);border:1px solid var(--border2);color:var(--text2);border-radius:8px;padding:5px 8px;font-size:12px;cursor:pointer;font-family:inherit;" onchange="updateOrderStatus(${o.id}, this.value)">
          ${["pendiente","en proceso","enviado","entregado","cancelado"].map(s =>
            `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`
          ).join("")}
        </select>
      </td>
      <td style="color:var(--muted);font-size:12.5px;">${date}</td>
    </tr>`;
  }).join("");
}

async function updateOrderStatus(id, status) {
  try {
    await Data.updateOrderStatus(id, status);
    adminAlert("Estado actualizado");
    await loadDashboard();
  } catch { adminAlert("Error al actualizar", "error"); }
}

// ─── Settings ─────────────────────────────────────────────────
async function loadSettings() {
  const s = await Data.getSettings();
  const set = (id, key) => { const el = document.getElementById(id); if (el) el.value = s[key] || ""; };
  set("set-storename","store_name"); set("set-tagline","tagline");
  set("set-email","store_email"); set("set-phone","store_phone");
  set("set-instagram","store_instagram"); set("set-whatsapp","whatsapp");
  set("set-promo","promo_text"); set("set-herotitle","hero_title");
  set("set-herosubtitle","hero_subtitle"); set("set-herodiscount","hero_discount");
  set("set-herodiscdesc","hero_discount_desc");
}

async function saveSettings() {
  const pairs = [
    ["set-storename","store_name"],["set-tagline","tagline"],
    ["set-email","store_email"],["set-phone","store_phone"],
    ["set-instagram","store_instagram"],["set-whatsapp","whatsapp"],
    ["set-promo","promo_text"],["set-herotitle","hero_title"],
    ["set-herosubtitle","hero_subtitle"],["set-herodiscount","hero_discount"],
    ["set-herodiscdesc","hero_discount_desc"],
  ];
  try {
    for (const [id, key] of pairs) {
      const el = document.getElementById(id);
      if (el) await Data.updateSetting(key, el.value.trim());
    }
    adminAlert("Configuración guardada");
  } catch { adminAlert("Error al guardar", "error"); }
}

// ─── Helpers ──────────────────────────────────────────────────
function toSlug(text) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function thumbHTML(p) {
  const icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" width="18" height="18"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`;
  const imgUrl = productImageUrl(p);
  if (!imgUrl) return icon;
  return icon + `<img src="${imgUrl}" alt="" onerror="this.remove()">`;
}

function emptyRow(msg) {
  return `<div style="padding:20px 16px;text-align:center;color:var(--muted);font-size:13.5px;">${msg}</div>`;
}

function statusClass(status) {
  return { pendiente:"pending", "en proceso":"active", enviado:"active", entregado:"done", cancelado:"out" }[status] || "pending";
}

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  if (TX.enabled) {
    const { data: { session } } = await TX.client.auth.getSession();
    if (session) showApp();

    TX.client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") location.reload();
    });
  } else {
    showLoginError("Supabase no está configurado en js/config.js.");
  }

  document.getElementById("login-btn").onclick = adminLogin;
  document.getElementById("admin-pass").onkeydown = e => { if (e.key === "Enter") adminLogin(); };
  document.getElementById("admin-email").onkeydown = e => { if (e.key === "Enter") adminLogin(); };

  document.querySelectorAll("[data-view]").forEach(link => {
    link.addEventListener("click", e => { e.preventDefault(); switchView(link.dataset.view); });
  });

  document.getElementById("delete-confirm-btn").onclick = async () => {
    if (_deleteCallback) { await _deleteCallback(); _deleteCallback = null; }
    closeModal("delete-modal");
  };

  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.hidden = true; });
  });
});
