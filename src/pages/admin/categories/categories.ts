import "../../../style.css";
import { requireRole } from "../../../utils/auth";

requireRole("ADMIN");

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

const tbody = document.getElementById("categories-body") as HTMLTableSectionElement;
const form = document.getElementById("category-form") as HTMLFormElement;
const formTitle = document.getElementById("form-title") as HTMLHeadingElement;
const categoryIdInput = document.getElementById("category-id") as HTMLInputElement;
const categoryNameInput = document.getElementById("category-name") as HTMLInputElement;
const categoryDescriptionInput = document.getElementById("category-description") as HTMLInputElement;
const cancelEditBtn = document.getElementById("cancel-edit") as HTMLButtonElement;

let categorias: Categoria[] = [];

function renderTable() {
  tbody.innerHTML = "";

  categorias.forEach((categoria) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${categoria.id}</td>
      <td>${categoria.nombre}</td>
      <td>${categoria.descripcion}</td>
      <td>
        <button type="button" class="edit-btn" data-id="${categoria.id}">
          Editar
        </button>

        <button type="button" class="delete-btn" data-id="${categoria.id}">
          Eliminar
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function resetForm() {
  formTitle.textContent = "Nueva Categoría";
  categoryIdInput.value = "";
  categoryNameInput.value = "";
  categoryDescriptionInput.value = "";
}

function saveCategory(e: SubmitEvent) {
  e.preventDefault();

  const id = categoryIdInput.value;
  const nombre = categoryNameInput.value.trim();
  const descripcion = categoryDescriptionInput.value.trim();

  if (!nombre || !descripcion) {
    alert("Completá nombre y descripción");
    return;
  }

  if (id) {
    const categoria = categorias.find((c) => c.id === Number(id));

    if (!categoria) return;

    categoria.nombre = nombre;
    categoria.descripcion = descripcion;
  } else {

  const nuevoId =
    categorias.length > 0
      ? Math.max(...categorias.map((c) => c.id)) + 1
      : 1;

  categorias.push({
    id: nuevoId,
    nombre,
    descripcion,
  });

}

  resetForm();
  renderTable();
}

function editCategory(id: number) {
  const categoria = categorias.find((c) => c.id === id);

  if (!categoria) return;

  formTitle.textContent = "Editar Categoría";
  categoryIdInput.value = categoria.id.toString();
  categoryNameInput.value = categoria.nombre;
  categoryDescriptionInput.value = categoria.descripcion;
}

function deleteCategory(id: number) {
  const confirmar = window.confirm("¿Seguro que querés eliminar esta categoría?");

  if (!confirmar) return;

  categorias = categorias.filter((c) => c.id !== id);
  renderTable();
}

function handleTableClick(e: Event) {
  const target = e.target as HTMLElement;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = Number(target.dataset.id);

  if (target.classList.contains("edit-btn")) {
    editCategory(id);
  }

  if (target.classList.contains("delete-btn")) {
    deleteCategory(id);
  }
}

async function loadCategories() {
  try {
    const response = await fetch("/data/categorias.json");

    if (!response.ok) {
      throw new Error("No se pudo cargar categorias.json");
    }

    categorias = await response.json();
    renderTable();
  } catch (error) {
    console.error("Error cargando categorías:", error);
    alert("No se pudieron cargar las categorías");
  }
}

form.addEventListener("submit", saveCategory);

cancelEditBtn.addEventListener("click", resetForm);

tbody.addEventListener("click", handleTableClick);

loadCategories();