import "../../../style.css";

import { addToCart, getCartCount } from "../../../utils/cart";
import { requireRole } from "../../../utils/auth";

requireRole("USUARIO");

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
  eliminado?: boolean;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
  eliminado?: boolean;
  categoria: Categoria;
}

const container = document.getElementById("products")!;
const searchInput = document.getElementById("search") as HTMLInputElement;
const categoriesContainer = document.getElementById("categories")!;
const badge = document.getElementById("cart-count")!;

let productos: Producto[] = [];
let filteredProducts: Producto[] = [];

function updateBadge() {
  badge.textContent = getCartCount().toString();
}

function renderProducts(products: Producto[]) {
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
        src="${p.imagen}"
        alt="${p.nombre}"
        class="card-img"
      />

      <div class="card-body">
        <span class="availability-badge">
          ${p.disponible && p.stock > 0 ? "Disponible" : "No disponible"}
        </span>

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

    div.addEventListener("click", () => {
      window.location.href = `../productDetail/productDetail.html?id=${p.id}`;
    });

    const btn = div.querySelector("button")!;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

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

function applySearch() {
  const text = searchInput.value.toLowerCase();

  const result = filteredProducts.filter((p) =>
    p.nombre.toLowerCase().includes(text)
  );

  renderProducts(result);
}

function renderCategories(categories: Categoria[]) {
  categoriesContainer.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "Todos";

  allBtn.addEventListener("click", () => {
    filteredProducts = productos;
    searchInput.value = "";
    renderProducts(filteredProducts);
  });

  categoriesContainer.appendChild(allBtn);

  categories.forEach((c) => {
    const btn = document.createElement("button");
    btn.textContent = c.nombre;

    btn.addEventListener("click", () => {
      filteredProducts = productos.filter((p) => p.categoria.id === c.id);
      searchInput.value = "";
      renderProducts(filteredProducts);
    });

    categoriesContainer.appendChild(btn);
  });
}

async function loadStore() {
  try {
    const [productosResponse, categoriasResponse] = await Promise.all([
      fetch("/data/productos.json"),
      fetch("/data/categorias.json"),
    ]);

    const productosData: Producto[] = await productosResponse.json();
    const categoriasData: Categoria[] = await categoriasResponse.json();

    productos = productosData.filter(
      (p) => p.disponible && !p.eliminado
    );

    const categoriasActivas = categoriasData.filter((c) => !c.eliminado);

    filteredProducts = productos;

    renderCategories(categoriasActivas);
    renderProducts(filteredProducts);
    updateBadge();
  } catch (error) {
    console.error("Error al cargar catálogo:", error);
    container.innerHTML = "<h2>No se pudo cargar el catálogo</h2>";
  }
}

searchInput.addEventListener("input", applySearch);

loadStore();