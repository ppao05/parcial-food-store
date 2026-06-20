import "../../../style.css";

import {
  getCart,
  saveCart,
} from "../../../utils/cart";

import {
  getUsuarioLogueado,
  requireRole,
} from "../../../utils/auth";

requireRole("USUARIO");

const ENVIO = 0;

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
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

interface CartItem {
  product: Producto;
  cantidad: number;
}

const container = document.getElementById("cart")!;
const subtotalEl = document.getElementById("subtotal")!;
const shippingEl = document.getElementById("shipping")!;
const totalEl = document.getElementById("total")!;
const clearBtn = document.getElementById("clear-cart")!;
const checkoutBox = document.getElementById("checkout")!;
const summaryBox = document.getElementById("summary")!;
const checkoutForm = document.getElementById("checkout-form") as HTMLFormElement;

function renderCart() {
  const cart = getCart() as CartItem[];

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>El carrito está vacío</h2>
        <a href="../home/home.html" class="go-store-btn">
          Volver a la tienda
        </a>
      </div>
    `;

    subtotalEl.textContent = "";
    shippingEl.textContent = "";
    totalEl.textContent = "";

    checkoutBox.style.display = "none";
    summaryBox.style.display = "none";
    clearBtn.style.display = "none";

    return;
  }

  checkoutBox.style.display = "block";
  summaryBox.style.display = "block";
  clearBtn.style.display = "block";

  let subtotal = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    const itemSubtotal = item.product.precio * item.cantidad;
    subtotal += itemSubtotal;

    div.innerHTML = `
      <img
        src="${item.product.imagen}"
        alt="${item.product.nombre}"
        class="cart-img"
      />

      <div class="cart-info">
        <h3>${item.product.nombre}</h3>
        <p>Precio unitario: $${item.product.precio}</p>
        <p>Stock disponible: ${item.product.stock}</p>
        <p>Subtotal: $${itemSubtotal}</p>
      </div>

      <div class="cart-actions">
        <button class="minus">-</button>
        <span>${item.cantidad}</span>
        <button class="plus">+</button>
        <button class="delete">🗑</button>
      </div>
    `;

    div.querySelector(".plus")?.addEventListener("click", () => {
      if (cart[index].cantidad < cart[index].product.stock) {
        cart[index].cantidad++;
        saveCart(cart);
        renderCart();
      } else {
        alert("No se puede superar el stock disponible");
      }
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

  const total = subtotal + ENVIO;

  subtotalEl.textContent = `Subtotal: $${subtotal}`;
  shippingEl.textContent = `Envío: $${ENVIO}`;
  totalEl.textContent = `Total: $${total}`;
}

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("cart");
  renderCart();
});

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const usuario = getUsuarioLogueado();
  const cart = getCart() as CartItem[];

  const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
  const payment = (document.getElementById("payment") as HTMLSelectElement).value;

  if (!usuario) {
    alert("No hay usuario en sesión");
    return;
  }

  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  if (!phone || !payment) {
    alert("Completá teléfono y forma de pago");
    return;
  }

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.precio * item.cantidad,
    0
  );

  const total = subtotal + ENVIO;

  const nuevoPedido = {
    id: Date.now(),
    fecha: new Date().toISOString().split("T")[0],
    estado: "PENDIENTE",
    total,
    envio: ENVIO,
    formaPago: payment,
    telefono: phone,
    detalles: cart.map((item) => ({
      cantidad: item.cantidad,
      subtotal: item.product.precio * item.cantidad,
      producto: item.product,
    })),
    usuarioDto: usuario,
  };

  const pedidosGuardados = JSON.parse(
    localStorage.getItem("pedidosLocal") || "[]"
  );

  pedidosGuardados.push(nuevoPedido);

  localStorage.setItem(
    "pedidosLocal",
    JSON.stringify(pedidosGuardados)
  );

  localStorage.removeItem("cart");

  alert("Pedido confirmado correctamente");

  window.location.href = "../../client/orders/orders.html";
});

renderCart();