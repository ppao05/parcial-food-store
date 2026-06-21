import "../../../style.css";
import { requireRole } from "../../../utils/auth";

requireRole("ADMIN");

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
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

const tbody = document.getElementById("products-body") as HTMLTableSectionElement;

const form = document.getElementById("product-form") as HTMLFormElement;
const formTitle = document.getElementById("form-title") as HTMLHeadingElement;

const productIdInput = document.getElementById("product-id") as HTMLInputElement;
const productNameInput = document.getElementById("product-name") as HTMLInputElement;
const productDescriptionInput = document.getElementById("product-description") as HTMLInputElement;
const productPriceInput = document.getElementById("product-price") as HTMLInputElement;
const productStockInput = document.getElementById("product-stock") as HTMLInputElement;
const productCategorySelect = document.getElementById("product-category") as HTMLSelectElement;
const productImageInput = document.getElementById("product-image") as HTMLInputElement;
const productAvailableInput = document.getElementById("product-available") as HTMLInputElement;

const cancelEditBtn = document.getElementById("cancel-edit") as HTMLButtonElement;

let productos: Producto[] = [];
let categorias: Categoria[] = [];

function renderCategoryOptions() {
  productCategorySelect.innerHTML = `
    <option value="">Seleccionar categoría</option>
  `;

  categorias
    .filter((c) => !c.eliminado)
    .forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id.toString();
      option.textContent = categoria.nombre;

      productCategorySelect.appendChild(option);
    });
}

function renderTable() {
  tbody.innerHTML = "";

  productos
    .filter((p) => !p.eliminado)
    .forEach((producto) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${producto.id}</td>

        <td>
          <img
            src="${producto.imagen}"
            alt="${producto.nombre}"
            class="admin-thumb"
          >
        </td>

        <td>${producto.nombre}</td>

        <td>${producto.descripcion}</td>

        <td>$${producto.precio}</td>

        <td>${producto.categoria.nombre}</td>

        <td>${producto.stock}</td>

        <td>
          ${producto.disponible ? "Disponible" : "No disponible"}
        </td>

        <td>
          <button type="button" class="edit-btn" data-id="${producto.id}">
            Editar
          </button>

          <button type="button" class="delete-btn" data-id="${producto.id}">
            Eliminar
          </button>
        </td>
      `;

      tbody.appendChild(row);
    });
}

function resetForm() {
  formTitle.textContent = "Nuevo Producto";

  productIdInput.value = "";
  productNameInput.value = "";
  productDescriptionInput.value = "";
  productPriceInput.value = "";
  productStockInput.value = "";
  productCategorySelect.value = "";
  productImageInput.value = "";
  productAvailableInput.checked = true;
}

function saveProduct(e: SubmitEvent) {
  e.preventDefault();

  const id = productIdInput.value;
  const nombre = productNameInput.value.trim();
  const descripcion = productDescriptionInput.value.trim();
  const precio = Number(productPriceInput.value);
  const stock = Number(productStockInput.value);
  const categoriaId = Number(productCategorySelect.value);
  const imagen = productImageInput.value.trim();
  const disponible = productAvailableInput.checked;

  if (!nombre || !descripcion || !imagen || !categoriaId) {
    alert("Completá todos los campos");
    return;
  }

  if (precio <= 0) {
    alert("El precio debe ser mayor a 0");
    return;
  }

  if (stock < 0) {
    alert("El stock no puede ser negativo");
    return;
  }

  const categoria = categorias.find((c) => c.id === categoriaId);

  if (!categoria) {
    alert("La categoría seleccionada no existe");
    return;
  }

  if (id) {
    const producto = productos.find((p) => p.id === Number(id));

    if (!producto) return;

    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.precio = precio;
    producto.stock = stock;
    producto.imagen = imagen;
    producto.disponible = disponible;
    producto.categoria = categoria;
  } else {
    const nuevoId =
      productos.length > 0
        ? Math.max(...productos.map((p) => p.id)) + 1
        : 1;

    productos.push({
      id: nuevoId,
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      disponible,
      categoria,
    });
  }

  resetForm();
  renderTable();
}

function editProduct(id: number) {
  const producto = productos.find((p) => p.id === id);

  if (!producto) return;

  formTitle.textContent = "Editar Producto";

  productIdInput.value = producto.id.toString();
  productNameInput.value = producto.nombre;
  productDescriptionInput.value = producto.descripcion;
  productPriceInput.value = producto.precio.toString();
  productStockInput.value = producto.stock.toString();
  productCategorySelect.value = producto.categoria.id.toString();
  productImageInput.value = producto.imagen;
  productAvailableInput.checked = producto.disponible;
}

function deleteProduct(id: number) {
  const confirmar = window.confirm("¿Seguro que querés eliminar este producto?");

  if (!confirmar) return;

  const producto = productos.find((p) => p.id === id);

  if (!producto) return;

  producto.eliminado = true;

  renderTable();
}

function handleTableClick(e: Event) {
  const target = e.target as HTMLElement;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = Number(target.dataset.id);

  if (target.classList.contains("edit-btn")) {
    editProduct(id);
  }

  if (target.classList.contains("delete-btn")) {
    deleteProduct(id);
  }
}

async function loadData() {
  try {
    const [productosResponse, categoriasResponse] = await Promise.all([
      fetch("/data/productos.json"),
      fetch("/data/categorias.json"),
    ]);

    productos = await productosResponse.json();
    categorias = await categoriasResponse.json();

    renderCategoryOptions();
    renderTable();
  } catch (error) {
    console.error("Error cargando productos:", error);
    alert("No se pudieron cargar los productos");
  }
}

form.addEventListener("submit", saveProduct);
cancelEditBtn.addEventListener("click", resetForm);
tbody.addEventListener("click", handleTableClick);

loadData();