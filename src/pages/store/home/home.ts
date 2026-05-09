import "../../../style.css";
import { PRODUCTS, getCategories } from "../../../data/data";
import { addToCart, getCartCount } from "../../../utils/cart";

const container = document.getElementById("products")!;
const searchInput = document.getElementById("search") as HTMLInputElement;
const categoriesContainer = document.getElementById("categories")!;
const badge = document.getElementById("cart-count")!;

let filteredProducts = PRODUCTS.filter((p) => p.disponible);

function updateBadge() {
  badge.textContent = getCartCount().toString();
}

function renderProducts(products: typeof PRODUCTS) {
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<h2>No hay resultados</h2>";
    return;
  }

  products.forEach((p) => {
    const div = document.createElement("div");

    div.classList.add("card");

    div.innerHTML = `
      <img
        src="/src/assets/${p.imagen}"
        alt="${p.nombre}"
        class="card-img"
      />

       <div class="card-body">
        <h3 class="card-title">${p.nombre}</h3>

        <p class="card-description">
          ${p.descripcion}
        </p>

        <p class="price">$${p.precio}</p>

        <button class="add-btn">
          Agregar al carrito
        </button>
      </div>
    `;

    const btn = div.querySelector("button")!;

    btn.addEventListener("click", () => {
      addToCart(p);
      updateBadge();

      const msg = document.createElement("p");
      msg.textContent = "✔ Producto agregado";
      msg.classList.add("success-msg");

      div.querySelector(".card-body")?.appendChild(msg);

      setTimeout(() => msg.remove(), 1000);
    });

    container.appendChild(div);
  });
}
function renderCategories() {
  const categories = getCategories();

  categoriesContainer.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "Todos";

  allBtn.addEventListener("click", () => {
    filteredProducts = PRODUCTS.filter((p) => p.disponible);
    renderProducts(filteredProducts);
  });

  categoriesContainer.appendChild(allBtn);

  categories.forEach((c) => {
    const btn = document.createElement("button");

    btn.textContent = c.nombre;

    btn.addEventListener("click", () => {
      filteredProducts = PRODUCTS.filter(
        (p) =>
          p.categorias.some((cat) => cat.id === c.id) &&
          p.disponible
      );

      renderProducts(filteredProducts);
    });

    categoriesContainer.appendChild(btn);
  });
}
searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase();

  const result = filteredProducts.filter((p) =>
    p.nombre.toLowerCase().includes(text)
  );

  renderProducts(result);
});

renderCategories();
renderProducts(filteredProducts);
updateBadge();