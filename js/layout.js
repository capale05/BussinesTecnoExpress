// Inserta cabecera y pie de página en todas las páginas.
function moneda(n){ return "S/ " + Number(n).toLocaleString("es-PE"); }
function toast(msg){
  let t = document.querySelector(".toast");
  if(!t){ t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove("show"), 1800);
}

const ICONS = {
  perifericos:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4'><rect x='2' y='6' width='20' height='12' rx='2'/><path d='M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10'/></svg>",
  almacenamiento:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M8 9h5M8 13h3'/></svg>",
  ergonomia:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4'><path d='M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z'/></svg>",
  cargadores:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4'><path d='M13 2L5 13h6l-1 9 8-12h-6l1-8z'/></svg>"
};
function prodIcon(cat){ return ICONS[cat] || ICONS.perifericos; }

function renderHeader(active){
  const cats = [
    ["perifericos","Periféricos"],["almacenamiento","Almacenamiento"],
    ["ergonomia","Protección y ergonomía"],["cargadores","Cargadores y cables"]
  ];
  const navLinks = cats.map(([s,n]) =>
    `<a href="catalogo.html?cat=${s}" class="${active===s?'active':''}">${n}</a>`).join("");
  return `
  <div class="promo"><div class="container">
    <span>🚚 Envío a <b>Cajamarca, Trujillo y Lima</b></span>
    <span>💳 Paga con <b>Yape, Plin</b> y tarjetas</span>
    <span>↩️ Devoluciones <b>15 días gratis</b></span>
  </div></div>
  <header class="site"><div class="container">
    <a class="logo" href="index.html">
      <span class="bolt"><svg viewBox="0 0 24 24" fill="#fff"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg></span>
      <span class="name">Tecno<i>Express</i></span>
    </a>
    <form class="searchbox" onsubmit="event.preventDefault(); location.href='catalogo.html?q='+encodeURIComponent(this.q.value);">
      <input name="q" placeholder="Busca teclados, SSD, audífonos...">
      <button aria-label="Buscar"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg></button>
    </form>
    <div class="hactions">
      <a href="admin.html" title="Administración"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg><span class="label">Admin</span></a>
      <a href="carrito.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.4 12.5a2 2 0 0 0 2 1.5h8.5a2 2 0 0 0 2-1.6L23 7H6"/></svg><span class="cart-badge" id="cart-count">0</span><span class="label">Carrito</span></a>
    </div>
  </div></header>
  <nav class="cats"><div class="container">${navLinks}</div></nav>`;
}

function renderFooter(){
  return `<div class="container">
    <div class="fcols">
      <div>
        <div class="flogo">Tecno<i>Express</i></div>
        <p class="fabout">Tienda en línea especializada en accesorios y periféricos tecnológicos para estudiantes y trabajo remoto en el Perú.</p>
        <div class="pay-icons" style="justify-content:flex-start;margin-top:14px;">
          <span class="pay yape">Yape</span><span class="pay plin">Plin</span>
          <span class="pay">VISA</span><span class="pay">Mastercard</span>
        </div>
      </div>
      <div><h4>Categorías</h4><ul>
        <li><a href="catalogo.html?cat=perifericos">Periféricos</a></li>
        <li><a href="catalogo.html?cat=almacenamiento">Almacenamiento</a></li>
        <li><a href="catalogo.html?cat=ergonomia">Protección y ergonomía</a></li>
        <li><a href="catalogo.html?cat=cargadores">Cargadores y cables</a></li>
      </ul></div>
      <div><h4>Ayuda</h4><ul>
        <li>Cómo comprar</li><li>Envíos y entregas</li>
        <li>Cambios y devoluciones</li><li>Asesoría por chat</li>
      </ul></div>
      <div><h4>Contacto</h4><ul>
        <li>WhatsApp: +51 999 000 000</li><li>hola@tecnoexpress.pe</li>
        <li>Instagram @tecnoexpress.pe</li><li>TikTok @tecnoexpress</li>
      </ul></div>
    </div>
    <div class="fbottom">
      <span>© 2026 TecnoExpress · Todos los derechos reservados</span>
      <span>Términos · Privacidad · Libro de reclamaciones</span>
    </div>
  </div>`;
}

function updateCartCount(){
  const el = document.getElementById("cart-count");
  if (el) el.textContent = Cart.count();
}

function mountLayout(active){
  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.innerHTML = renderHeader(active);
  if (f) f.innerHTML = renderFooter();
  const wa = document.createElement("a");
  wa.className = "wa-float"; wa.href = "https://wa.me/51999000000"; wa.target = "_blank";
  wa.setAttribute("aria-label","WhatsApp");
  wa.innerHTML = "<svg viewBox='0 0 24 24' fill='#073B1E'><path d='M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.8l-.3-.2-2.5.7.7-2.4-.2-.3A8 8 0 0 1 12 4zm4.4 10.3c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8.9-.3.1-.5 0a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3 5.4 5.4 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c2.3.9 2.3.6 2.7.6a2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.5-.3z'/></svg>";
  document.body.appendChild(wa);
  updateCartCount();
  document.addEventListener("cart:change", updateCartCount);
}

function productCardHTML(p){
  const badge = p.badge
    ? `<span class="p-badge ${p.badge.toLowerCase()==='nuevo'?'new':''}">${p.badge}</span>` : "";
  const old = p.old_price ? `<s>${moneda(p.old_price)}</s>` : "";
  const imgUrl = productImageUrl(p);
  const thumb = imgUrl
    ? prodIcon(p.category) + `<img src="${imgUrl}" alt="${p.name}" loading="lazy" onerror="this.remove()">`
    : prodIcon(p.category);
  return `<div class="p-card">
    <a href="producto.html?id=${p.id}" class="p-thumb">${badge}${thumb}</a>
    <div class="p-body">
      <div class="p-cat">${p.category}</div>
      <a href="producto.html?id=${p.id}" class="p-name">${p.name}</a>
      <div class="stars">★★★★★ <span>(${p.reviews_count})</span></div>
      <div class="p-row">
        <div class="price">${old}${moneda(p.price)}</div>
        <button class="btn btn-teal" onclick="Cart.add(${p.id}); toast('Agregado al carrito');">+ Agregar</button>
      </div>
    </div>
  </div>`;
}
