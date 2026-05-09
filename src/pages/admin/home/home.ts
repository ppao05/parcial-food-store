import "../../../style.css";

import { PRODUCTS, getCategories } from "../../../data/data";

const totalProducts = document.getElementById("total-products");
const availableProducts = document.getElementById("available-products");
const outStock = document.getElementById("out-stock");
const totalCategories = document.getElementById("total-categories");

if (
  totalProducts &&
  availableProducts &&
  outStock &&
  totalCategories
) {
  totalProducts.textContent = PRODUCTS.length.toString();

  availableProducts.textContent = PRODUCTS
    .filter((p) => p.disponible)
    .length.toString();

  outStock.textContent = PRODUCTS
    .filter((p) => p.stock === 0)
    .length.toString();

  totalCategories.textContent = getCategories()
    .length.toString();
}