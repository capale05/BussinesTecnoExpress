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

  document.getElementById("pay-btn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = cityEl.value;
    if (!name || !phone || !address){ toast("Completa tus datos de envío"); return; }

    const totals = await Cart.detailed(city);
    const order = {
      customer_name: name, customer_phone: phone, city, address,
      payment_method: method, subtotal: totals.subtotal, shipping: totals.shipping,
      discount: totals.discount, total: totals.total, status: "pendiente"
    };
    const btn = document.getElementById("pay-btn");
    btn.disabled = true; btn.textContent = "Procesando...";
    try {
      const code = await Data.createOrder(order, totals.items);
      Cart.clear();
      location.href = "confirmacion.html?code=" + encodeURIComponent(code);
    } catch (e) {
      btn.disabled = false; toast("Error al registrar el pedido");
    }
  });
});
