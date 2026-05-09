import type { Product } from "../types/product";
import type { ICategory } from "../types/category";

const categorias: ICategory[] = [
  {
    id: 1,
    eliminado: false,
    createdAt: "2024",
    nombre: "Pizzas",
    descripcion: "Pizzas artesanales",
  },

  {
    id: 2,
    eliminado: false,
    createdAt: "2024",
    nombre: "Hamburguesas",
    descripcion: "Hamburguesas gourmet",
  },

  {
    id: 3,
    eliminado: false,
    createdAt: "2024",
    nombre: "Bebidas",
    descripcion: "Bebidas frías",
  },

  {
    id: 4,
    eliminado: false,
    createdAt: "2024",
    nombre: "Postres",
    descripcion: "Postres dulces",
  },

  {
    id: 5,
    eliminado: false,
    createdAt: "2024",
    nombre: "Empanadas",
    descripcion: "Empanadas caseras",
  },

  {
    id: 6,
    eliminado: false,
    createdAt: "2024",
    nombre: "Ensaladas",
    descripcion: "Ensaladas frescas",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    eliminado: false,
    createdAt: "2024",

    nombre: "Pizza Muzzarella",
    precio: 4500,
    descripcion: "Pizza clásica con muzzarella",

    stock: 10,
    imagen: "pizza.jpg",
    disponible: true,

    categorias: [categorias[0]],
  },

  {
    id: 2,
    eliminado: false,
    createdAt: "2024",

    nombre: "Hamburguesa BBQ",
    precio: 5200,
    descripcion: "Hamburguesa con bacon y cheddar",

    stock: 8,
    imagen: "hamburguesa.jpg",
    disponible: true,

    categorias: [categorias[1]],
  },

  {
    id: 3,
    eliminado: false,
    createdAt: "2024",

    nombre: "Gaseosas",
    precio: 1800,
    descripcion: "Bebidas frías línea Coca Cola",

    stock: 20,
    imagen: "bebida.jpg",
    disponible: true,

    categorias: [categorias[2]],
  },

  {
    id: 4,
    eliminado: false,
    createdAt: "2024",

    nombre: "Flan mixto",
    precio: 2500,
    descripcion: "Flan con dulce de leche y crema",

    stock: 12,
    imagen: "postre.jpg",
    disponible: true,

    categorias: [categorias[3]],
  },

  {
    id: 5,
    eliminado: false,
    createdAt: "2024",

    nombre: "Empanada de carne",
    precio: 1200,
    descripcion: "Empanada criolla casera",

    stock: 30,
    imagen: "empanada.jpg",
    disponible: true,

    categorias: [categorias[4]],
  },

  {
    id: 6,
    eliminado: false,
    createdAt: "2024",

    nombre: "Ensalada Caesar",
    precio: 3200,
    descripcion: "Lechuga, pollo y aderezo Caesar",

    stock: 15,
    imagen: "ensalada.jpg",
    disponible: true,

    categorias: [categorias[5]],
  },
];

export function getCategories(): ICategory[] {
  return categorias.filter((c) => !c.eliminado);
}