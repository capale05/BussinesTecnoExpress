document.addEventListener("DOMContentLoaded", async () => {
  mountLayout("");
  const code = new URLSearchParams(location.search).get("code");
  const data = await Data.getOrderByCode(code);
  const root = document.getElementById("confirm");
  if (!data){ root.innerHTML = '<div class="empty">No encontramos este pedido.</div>'; return; }

  const { order, items } = data;
  const lines = items.map(it => {
    const thumb = it.image_url
      ? `<img src="${it.image_url}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`
      : prodIcon(it.category || "perifericos");
    return `
    <div class="cart-item" style="padding:8px 0">
      <div class="thumb" style="width:56px;height:56px;">${thumb}</div>
      <div style="flex:1"><b style="font-size:14px">${it.product_name || it.name}</b>
        <div class="muted" style="font-size:12.5px">Cantidad: ${it.quantity || it.qty}</div></div>
      <b>${moneda(it.unit_price || it.price)}</b>
    </div>`;
  }).join("");

  root.innerHTML = `
    <div class="check">
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>
    </div>
    <h1 class="page-title" style="font-size:28px;">¡Pedido confirmado!</h1>
    <p class="muted">Gracias por tu compra. Tu orden <b style="color:var(--text)">#${order.code}</b> fue registrada.</p>
    <div class="card" style="text-align:left;margin-top:22px;">
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:14px;margin-bottom:10px;">
        <div>
          <div class="muted" style="font-size:12px;">Entrega estimada</div>
          <b>24 - 48 horas · ${order.city}</b>
        </div>
        <div style="text-align:right;">
          <div class="muted" style="font-size:12px;">Total pagado</div>
          <b style="font-size:18px;">${moneda(order.total)}</b>
        </div>
      </div>
      ${lines}
    </div>
    <div class="wa-note">
      <svg viewBox="0 0 24 24" fill="#25D366"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z"/></svg>
      <div style="font-size:13.5px;"><b>Te enviaremos el seguimiento por WhatsApp y correo.</b> Recibirás novedades del envío y el comprobante en minutos.</div>
    </div>
    <div style="display:flex;gap:14px;justify-content:center;margin-top:24px;">
      <a class="btn btn-ghost" href="index.html">Volver al inicio</a>
      <a class="btn btn-teal" href="catalogo.html">Seguir comprando</a>
    </div>`;
});
