// Carrito guardado en localStorage. Estructura: [{ id, qty }]
const Cart = {
  KEY: "tx_cart",
  _read(){ try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  _write(items){ localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new Event("cart:change")); },

  items(){ return this._read(); },
  count(){ return this._read().reduce((n, it) => n + it.qty, 0); },

  add(id, qty = 1){
    const items = this._read();
    const found = items.find(it => it.id === id);
    if (found) found.qty += qty; else items.push({ id, qty });
    this._write(items);
  },
  setQty(id, qty){
    let items = this._read();
    if (qty <= 0) items = items.filter(it => it.id !== id);
    else { const f = items.find(it => it.id === id); if (f) f.qty = qty; }
    this._write(items);
  },
  remove(id){ this._write(this._read().filter(it => it.id !== id)); },
  clear(){ this._write([]); },

  // Une el carrito con la info de cada producto y calcula totales.
  async detailed(city = "Trujillo"){
    const items = this._read();
    const detailed = [];
    for (const it of items){
      const p = await Data.getProductById(it.id);
      if (p) detailed.push({ ...p, qty: it.qty, lineTotal: p.price * it.qty });
    }
    const subtotal = detailed.reduce((s, it) => s + it.lineTotal, 0);
    const shipping = detailed.length ? this.shippingFor(city) : 0;
    const discount = subtotal >= 200 ? 30 : 0;
    const total = Math.max(0, subtotal + shipping - discount);
    return { items: detailed, subtotal, shipping, discount, total };
  },
  shippingFor(city){
    const c = (city || "").toLowerCase();
    if (c.includes("lima")) return 15;
    if (c.includes("cajamarca") || c.includes("trujillo")) return 12;
    return 18;
  }
};
