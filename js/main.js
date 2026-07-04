document.addEventListener("DOMContentLoaded", async () => {
  mountLayout("");

  const cats = await Data.getCategories();
  document.getElementById("cats").innerHTML = cats.map(c =>
    `<a href="catalogo.html?cat=${c.slug}" class="cat-card">
       <span class="ic">${prodIcon(c.slug)}</span>
       <h3>${c.name}</h3><p>${c.description}</p>
     </a>`).join("");

  const best = await Data.getProducts({ bestsellers: true });
  document.getElementById("bestsellers").innerHTML = best.slice(0,4).map(productCardHTML).join("");
});
