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

const detailContainer = document.getElementById("product-detail")!;
const badge = document.getElementById("cart-count")!;

let productoSeleccionado: Producto | null = null;
let cantidad = 1;

function updateBadge() {
  badge.textContent = getCartCount().toString();
}

function getProductIdFromUrl(): number | null {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  return id ? Number(id) : null;
}

function renderProductDetail(producto: Producto) {
  const sinStock = producto.stock === 0;
  const noDisponible = !producto.disponible || producto.eliminado;
  const botonDeshabilitado = sinStock || noDisponible;

  detailContainer.innerHTML = `
    <div class="detail-card">
      <img
        src="${producto.imagen}"
        alt="${producto.nombre}"
        class="detail-img"
      />

      <div class="detail-info">
        <span class="availability-badge">
          ${botonDeshabilitado ? "No disponible" : "Disponible"}
        </span>

        <h2>${producto.nombre}</h2>

        <p class="card-description">
          ${producto.descripcion}
        </p>

        <p class="price">$${producto.precio}</p>

        <p>Stock disponible: ${producto.stock}</p>

        <div class="quantity-control">
          <button id="decrease">-</button>
          <span id="quantity">${cantidad}</span>
          <button id="increase">+</button>
        </div>

        <button
          id="add-detail-btn"
          class="add-btn"
          ${botonDeshabilitado ? "disabled" : ""}
        >
          Agregar al carrito
        </button>

        <p id="detail-message" class="success-msg"></p>
      </div>
    </div>
  `;

  const decreaseBtn = document.getElementById("decrease")!;
  const increaseBtn = document.getElementById("increase")!;
  const quantitySpan = document.getElementById("quantity")!;
  const addBtn = document.getElementById("add-detail-btn") as HTMLButtonElement;
  const message = document.getElementById("detail-message")!;

  decreaseBtn.addEventListener("click", () => {
    if (cantidad > 1) {
      cantidad--;
      quantitySpan.textContent = cantidad.toString();
    }
  });

  increaseBtn.addEventListener("click", () => {
    if (cantidad < producto.stock) {
      cantidad++;
      quantitySpan.textContent = cantidad.toString();
    } else {
      message.textContent = "No se puede superar el stock disponible";
    }
  });

  addBtn.addEventListener("click", () => {
    if (botonDeshabilitado) {
      return;
    }

    for (let i = 0; i < cantidad; i++) {
      addToCart(producto);
    }

    updateBadge();
    message.textContent = "✔ Producto agregado al carrito";
  });
}

async function loadProductDetail() {
  try {
    const id = getProductIdFromUrl();

    if (!id) {
      detailContainer.innerHTML = "<h2>Producto no encontrado</h2>";
      return;
    }

    const response = await fetch("/data/productos.json");
    const productos: Producto[] = await response.json();

    const producto = productos.find((p) => p.id === id);

    if (!producto) {
      detailContainer.innerHTML = "<h2>Producto no encontrado</h2>";
      return;
    }

    productoSeleccionado = producto;

    renderProductDetail(productoSeleccionado);
    updateBadge();
  } catch (error) {
    console.error("Error al cargar detalle:", error);
    detailContainer.innerHTML = "<h2>No se pudo cargar el detalle del producto</h2>";
  }
}

loadProductDetail();