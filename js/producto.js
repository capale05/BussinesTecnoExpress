document.addEventListener("DOMContentLoaded", async () => {
  mountLayout("");
  const id = new URLSearchParams(location.search).get("id");
  const p = await Data.getProductById(id);
  const root = document.getElementById("product");
  if (!p){ root.innerHTML = '<div class="empty">Producto no encontrado.</div>'; return; }

  const old = p.old_price ? `<s style="color:var(--muted);font-size:16px;">${moneda(p.old_price)}</s>` : "";
  const badge = p.badge ? `<span class="p-badge" style="position:static;display:inline-block">${p.badge}</span>` : "";
  const specs = p.specs && Object.keys(p.specs).length
    ? `<h3 style="margin:24px 0 8px;font-size:16px;">Especificaciones</h3>
       <table class="specs-table">${Object.entries(p.specs).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table>`
    : "";

  const galleryContent = p.image_url
    ? `<img src="${p.image_url}" alt="${p.name}">`
    : prodIcon(p.category);

  document.querySelector(".crumb").innerHTML =
    `<a href="index.html">Inicio</a> / <a href="catalogo.html?cat=${p.category}">${p.category}</a> / <b>${p.name}</b>`;

  root.innerHTML = `
    <div class="gallery">${galleryContent}</div>
    <div>
      <div class="p-cat" style="font-size:12px;letter-spacing:.8px;">${p.category}</div>
      <h1 class="page-title">${p.name}</h1>
      <div class="stars">★★★★★ <span>${p.rating} · ${p.reviews_count} reseñas</span></div>
      <div style="display:flex;align-items:baseline;gap:12px;margin:16px 0;">
        <span class="price-lg">${moneda(p.price)}</span>${old}${badge}
      </div>
      <div style="font-weight:700;font-size:13.5px;margin-bottom:18px;${p.stock > 0 ? 'color:var(--green)' : 'color:var(--red)'}">
        ${p.stock > 0 ? '● En stock · Entrega en 24-48 h' : '✕ Agotado'}</div>
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:18px;flex-wrap:wrap;">
        <div class="qty"><button id="minus">−</button><span id="qty">1</span><button id="plus">+</button></div>
        <button class="btn btn-teal" id="add">Agregar al carrito</button>
        <button class="btn btn-cta" id="buy">Comprar ahora</button>
      </div>
      <div class="card" style="background:rgba(74,142,245,.06);border-color:rgba(74,142,245,.2);padding:14px;display:flex;gap:10px;align-items:center;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--blue)" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <div style="font-size:13.5px;"><b>¿Dudas sobre compatibilidad?</b> Consulta gratis por <b style="color:var(--blue)">chat de asesoría</b>.</div>
      </div>
      <p class="muted" style="font-size:13.5px;margin-top:16px;line-height:1.6;">${p.description}</p>
      ${specs}
    </div>`;

  let qty = 1;
  const qtyEl = document.getElementById("qty");
  document.getElementById("plus").onclick  = () => { qty++; qtyEl.textContent = qty; };
  document.getElementById("minus").onclick = () => { if (qty>1){ qty--; qtyEl.textContent = qty; } };
  document.getElementById("add").onclick   = () => { Cart.add(p.id, qty); toast("Agregado al carrito"); };
  document.getElementById("buy").onclick   = () => { Cart.add(p.id, qty); location.href = "carrito.html"; };
});
