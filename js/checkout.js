document.addEventListener("DOMContentLoaded", async () => {
  mountLayout("");
  let method = "yape";

  const cityEl = document.getElementById("city");
  cityEl.addEventListener("change", renderSummary);

  document.querySelectorAll(".pay-opt").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".pay-opt").forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      method = opt.dataset.method;
    });
  });

  async function renderSummary(){
    const { items, subtotal, shipping, discount, total } = await Cart.detailed(cityEl.value);
    if (!items.length){ location.href = "carrito.html"; return; }
    document.getElementById("order-lines").innerHTML = items.map(it =>
      `<div class="line"><span class="muted">${it.name} ×${it.qty}</span><b>${moneda(it.lineTotal)}</b></div>`).join("") +
      `<div class="line"><span class="muted">Envío</span><b>${moneda(shipping)}</b></div>` +
      `<div class="line"><span class="muted">Descuento</span><b style="color:var(--green)">− ${moneda(discount)}</b></div>`;
    document.getElementById("order-total").textContent = moneda(total);
    document.getElementById("pay-btn").textContent = "Pagar " + moneda(total);
    return { items, subtotal, shipping, discount, total };
  }
  await renderSummary();

  function validarDatos(){
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    if (!name || !phone || !address){ toast("Completa tus datos de envío"); return null; }
    return { name, phone, address, city: cityEl.value };
  }

  // Registra el pedido, limpia el carrito y redirige a la confirmación.
  async function processOrder(btn){
    const original = btn.textContent;
    btn.disabled = true; btn.textContent = "Procesando...";
    try {
      const datos = validarDatos();
      if (!datos) { btn.disabled = false; btn.textContent = original; return; }
      const totals = await Cart.detailed(datos.city);
      const order = {
        customer_name: datos.name, customer_phone: datos.phone,
        city: datos.city, address: datos.address,
        payment_method: method, subtotal: totals.subtotal, shipping: totals.shipping,
        discount: totals.discount, total: totals.total, status: "pendiente"
      };
      const code = await Data.createOrder(order, totals.items);
      Cart.clear();
      location.href = "confirmacion.html?code=" + encodeURIComponent(code);
    } catch (e) {
      console.error(e);
      btn.disabled = false; btn.textContent = original;
      toast("Error al registrar el pedido");
    }
  }

  // QR ficticio (solo demo): dibuja un patrón pseudoaleatorio con
  // los tres cuadrados de posición típicos de un QR real.
  function fakeQRSVG(seed){
    const N = 25, S = 8;
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seed.length; i++){ h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    const rand = () => {
      h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0;
      return h / 4294967296;
    };
    const inFinder = (r,c) => (r<7 && c<7) || (r<7 && c>=N-7) || (r>=N-7 && c<7);
    let cells = "";
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++)
        if (!inFinder(r,c) && rand() < 0.45)
          cells += `<rect x="${c*S}" y="${r*S}" width="${S}" height="${S}"/>`;
    const finder = (x,y) =>
      `<rect x="${x}" y="${y}" width="${7*S}" height="${7*S}"/>` +
      `<rect x="${x+S}" y="${y+S}" width="${5*S}" height="${5*S}" fill="#fff"/>` +
      `<rect x="${x+2*S}" y="${y+2*S}" width="${3*S}" height="${3*S}"/>`;
    return `<svg viewBox="0 0 ${N*S} ${N*S}" xmlns="http://www.w3.org/2000/svg" fill="#0B1224">` +
      cells + finder(0,0) + finder((N-7)*S,0) + finder(0,(N-7)*S) + `</svg>`;
  }

  function openQRModal(total){
    const brand = method === "yape"
      ? { name:"Yape", bg:"#742384", fg:"#fff" }
      : { name:"Plin", bg:"#0AC2C2", fg:"#072B2B" };
    const tag = document.getElementById("qr-brand");
    tag.textContent = brand.name;
    tag.style.background = brand.bg;
    tag.style.color = brand.fg;
    document.getElementById("qr-amount").textContent = moneda(total);
    document.getElementById("qr-box").innerHTML = fakeQRSVG(method + "|" + total + "|" + Date.now());
    document.getElementById("qr-modal").hidden = false;
  }

  document.getElementById("pay-btn").addEventListener("click", async () => {
    if (!validarDatos()) return;
    const totals = await Cart.detailed(cityEl.value);
    if (!totals.items.length){ location.href = "carrito.html"; return; }

    if (method === "yape" || method === "plin"){
      openQRModal(totals.total);
    } else {
      await processOrder(document.getElementById("pay-btn"));
    }
  });

  document.getElementById("qr-finish").addEventListener("click", e => processOrder(e.currentTarget));
  document.getElementById("qr-cancel").addEventListener("click", () => {
    document.getElementById("qr-modal").hidden = true;
  });
});
