import "../../../style.css";

import {
  getUsuarioLogueado,
  requireRole
} from "../../../utils/auth";

requireRole("USUARIO");

const container =
  document.getElementById("orders-container")!;

function getBadgeClass(
  estado: string
) {
  switch (estado) {
    case "PENDIENTE":
      return "badge-pendiente";

    case "EN_PREPARACION":
      return "badge-preparacion";

    case "ENTREGADO":
      return "badge-entregado";

    case "CANCELADO":
      return "badge-cancelado";

    default:
      return "";
  }
}

async function loadOrders() {

  const usuario = getUsuarioLogueado();

  if (!usuario) return;

  try {

    const response =
      await fetch("/data/pedidos.json");

    const pedidosJson =
      await response.json();

    const pedidosLocal =
      JSON.parse(
        localStorage.getItem(
          "pedidosLocal"
        ) || "[]"
      );

    const todosLosPedidos = [
      ...pedidosJson,
      ...pedidosLocal
    ];

    const misPedidos =
      todosLosPedidos.filter(
        (p) =>
          p.usuarioDto?.id === usuario.id
      );

    if (misPedidos.length === 0) {

      container.innerHTML = `
        <div class="empty-orders">
          <h2>No tenés pedidos todavía</h2>

          <a
            href="../../store/home/home.html"
            class="go-store-btn"
          >
            Ir a comprar
          </a>
        </div>
      `;

      return;
    }

    container.innerHTML = "";

    misPedidos
      .sort(
        (a, b) =>
          new Date(b.fecha).getTime() -
          new Date(a.fecha).getTime()
      )
      .forEach((pedido) => {

        const card =
          document.createElement("div");

        card.classList.add(
          "order-card"
        );

        const primerosProductos =
          pedido.detalles
            ?.slice(0, 3)
            .map(
              (d: any) =>
                d.producto.nombre
            )
            .join(", ");

        card.innerHTML = `
          <h3>
            Pedido #${pedido.id}
          </h3>

          <p>
            Fecha:
            ${pedido.fecha}
          </p>

          <p>
            ${primerosProductos}
          </p>

          <p>
            Total:
            $${pedido.total}
          </p>

          <span
            class="
            order-badge
            ${getBadgeClass(
              pedido.estado
            )}
            "
          >
            ${pedido.estado}
          </span>
        `;

        container.appendChild(card);

      });

  } catch (error) {

    console.error(error);

    container.innerHTML =
      "<h2>Error al cargar pedidos</h2>";

  }
}

loadOrders();