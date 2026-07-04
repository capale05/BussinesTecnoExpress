document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const cat = params.get("cat");
  const q = (params.get("q") || "").toLowerCase();
  mountLayout(cat || "");

  let products = await Data.getProducts({ category: cat });
  if (q) products = products.filter(p => p.name.toLowerCase().includes(q));

  const cats = await Data.getCategories();
  const catName = cat ? (cats.find(c => c.slug === cat)?.name || cat) : null;
  document.getElementById("title").textContent =
    q ? `Resultados para "${q}"` : (catName || "Todo el catálogo");
  document.getElementById("subtitle").textContent = `${products.length} producto(s)`;

  const grid = document.getElementById("grid");
  grid.innerHTML = products.length
    ? products.map(productCardHTML).join("")
    : `<div class="empty">No encontramos productos. <a href="catalogo.html" style="color:var(--teal)">Ver todo el catálogo</a></div>`;
});
