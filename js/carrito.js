document.addEventListener("DOMContentLoaded", async () => {
  mountLayout("");
  await render();

  async function render(){
    const { items, subtotal, shipping, discount, total } = await Cart.detailed();
    const list = document.getElementById("cart-list");
    const summary = document.getElementById("cart-summary");

    if (!items.length){
      document.getElementById("cart-wrap").innerHTML =
        `<div class="empty"><p>Tu carrito está vacío.</p>
         <a class="btn btn-teal" style="margin-top:14px" href="catalogo.html">Ver catálogo</a></div>`;
      return;
    }

    list.innerHTML = items.map(it => `
      <div class="cart-item">
        <div class="thumb">${prodIcon(it.category)}</div>
        <div style="flex:1">
          <div class="p-cat">${it.category}</div>
          <div style="font-weight:600;margin:3px 0;">${it.name}</div>
          <a href="#" class="muted" style="font-size:12.5px" onclick="event.preventDefault();Cart.remove(${it.id});location.reload();">Eliminar</a>
        </div>
        <div class="qty">
          <button onclick="Cart.setQty(${it.id}, ${it.qty-1});location.reload();">−</button>
          <span>${it.qty}</span>
          <button onclick="Cart.setQty(${it.id}, ${it.qty+1});location.reload();">+</button>
        </div>
        <div style="width:90px;text-align:right;font-weight:800;">${moneda(it.lineTotal)}</div>
      </div>`).join("") +
      `<div style="margin-top:14px;"><a class="btn btn-ghost" href="catalogo.html">← Seguir comprando</a></div>`;

    summary.innerHTML = `
      <h3>Resumen del pedido</h3>
      <div class="line"><span class="muted">Subtotal</span><b>${moneda(subtotal)}</b></div>
      <div class="line"><span class="muted">Envío</span><b>${moneda(shipping)}</b></div>
      <div class="line"><span class="muted">Descuento</span><b style="color:var(--green)">− ${moneda(discount)}</b></div>
      <div class="total"><b>Total</b><b>${moneda(total)}</b></div>
      <a class="btn btn-cta btn-block" href="checkout.html">Ir a pagar →</a>
      <div class="pay-icons"><span class="pay yape">Yape</span><span class="pay plin">Plin</span><span class="pay">VISA</span><span class="pay">Mastercard</span></div>`;
  }
});
