import "../../../style.css";

import { requireRole } from "../../../utils/auth";

requireRole("ADMIN");

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
  eliminado?: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  eliminado?: boolean;
}

interface Pedido {
  id: number;
  fecha: string;
  estado: string;
  total: number;
  formaPago: string;
}

const totalProducts = document.getElementById("total-products");
const availableProducts = document.getElementById("available-products");
const outStock = document.getElementById("out-stock");
const totalCategories = document.getElementById("total-categories");

async function loadDashboard() {
  try {
    const [productosResponse, categoriasResponse, pedidosResponse] =
      await Promise.all([
        fetch("/data/productos.json"),
        fetch("/data/categorias.json"),
        fetch("/data/pedidos.json"),
      ]);

    const productos: Producto[] = await productosResponse.json();
    const categorias: Categoria[] = await categoriasResponse.json();
    const pedidos: Pedido[] = await pedidosResponse.json();

    const productosActivos = productos.filter((p) => !p.eliminado);
    const categoriasActivas = categorias.filter((c) => !c.eliminado);

    if (
      totalProducts &&
      availableProducts &&
      outStock &&
      totalCategories
    ) {
      totalProducts.textContent = productosActivos.length.toString();

      availableProducts.textContent = productosActivos
        .filter((p) => p.disponible)
        .length.toString();

      outStock.textContent = productosActivos
        .filter((p) => p.stock === 0)
        .length.toString();

      totalCategories.textContent = categoriasActivas.length.toString();
    }

    console.log("Pedidos cargados para dashboard:", pedidos.length);
  } catch (error) {
    console.error("Error al cargar dashboard:", error);
    alert("No se pudieron cargar los datos del dashboard");
  }
}

loadDashboard();