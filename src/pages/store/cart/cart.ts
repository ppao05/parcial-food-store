import "../../../style.css";
import {
  getCart,
  saveCart,
  getCartCount,
} from "../../../utils/cart";
import { requireRole } from "../../../utils/auth";

requireRole("USUARIO");

const container = document.getElementById("cart")!;
const totalEl = document.getElementById("total")!;
const clearBtn = document.getElementById("clear-cart")!;

function renderCart() {
  const cart = getCart();

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<h2>El carrito está vacío</h2>";
    totalEl.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");

    div.classList.add("cart-item");

    const subtotal = item.product.precio * item.cantidad;

    total += subtotal;

    div.innerHTML = `
      <div class="cart-info">
        <h3>${item.product.nombre}</h3>
        <p>Precio: $${item.product.precio}</p>
        <p>Subtotal: $${subtotal}</p>
      </div>

      <div class="cart-actions">
        <button class="minus">-</button>

        <span>${item.cantidad}</span>

        <button class="plus">+</button>

        <button class="delete">🗑</button>
      </div>
    `;

    div.querySelector(".plus")?.addEventListener("click", () => {
      cart[index].cantidad++;
      saveCart(cart);
      renderCart();
    });

    div.querySelector(".minus")?.addEventListener("click", () => {
      if (cart[index].cantidad > 1) {
        cart[index].cantidad--;
      } else {
        cart.splice(index, 1);
      }

      saveCart(cart);
      renderCart();
    });

    div.querySelector(".delete")?.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });

    container.appendChild(div);
  });

  totalEl.textContent = `Total: $${total}`;
}

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("cart");
  renderCart();
});

renderCart();