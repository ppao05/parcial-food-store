import "../../../style.css";
import { requireRole } from "../../../utils/auth";

requireRole("ADMIN");

const container = document.getElementById("orders-container")!;

const filter = document.getElementById("status-filter") as HTMLSelectElement;

let pedidos: any[] = [];

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

function renderOrders() {

  container.innerHTML = "";

  let pedidosFiltrados = pedidos;

  if (
    filter.value !== "TODOS"
  ) {
    pedidosFiltrados =
      pedidos.filter(
        (p) =>
          p.estado === filter.value
      );
  }

  pedidosFiltrados
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

      const cantidadProductos =
        pedido.detalles?.length || 0;

      card.innerHTML = `
        <h3>
          Pedido #${pedido.id}
        </h3>

        <p>
          Cliente:
          ${pedido.usuarioDto?.nombre || "Cliente"}
          ${pedido.usuarioDto?.apellido || ""}
        </p>

        <p>
          Fecha:
          ${pedido.fecha}
        </p>

        <p>
          Productos:
          ${cantidadProductos}
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

        <div
          class="order-actions"
        >

          <select
            class="status-select"
            data-id="${pedido.id}"
          >

            <option
              value="PENDIENTE"
              ${
                pedido.estado ===
                "PENDIENTE"
                  ? "selected"
                  : ""
              }
            >
              PENDIENTE
            </option>

            <option
              value="EN_PREPARACION"
              ${
                pedido.estado ===
                "EN_PREPARACION"
                  ? "selected"
                  : ""
              }
            >
              EN_PREPARACION
            </option>

            <option
              value="ENTREGADO"
              ${
                pedido.estado ===
                "ENTREGADO"
                  ? "selected"
                  : ""
              }
            >
              ENTREGADO
            </option>

            <option
              value="CANCELADO"
              ${
                pedido.estado ===
                "CANCELADO"
                  ? "selected"
                  : ""
              }
            >
              CANCELADO
            </option>

          </select>

        </div>
      `;

      container.appendChild(card);

    });

  document
    .querySelectorAll(
      ".status-select"
    )
    .forEach((select) => {

      select.addEventListener(
        "change",
        () => {

          const pedido =
            pedidos.find(
              (p) =>
                p.id ===
                Number(
                  (
                    select as HTMLSelectElement
                  ).dataset.id
                )
            );

          if (!pedido) return;

          pedido.estado =
            (
              select as HTMLSelectElement
            ).value;

          renderOrders();

        }
      );

    });

}

async function loadOrders() {

  try {

    const response =
      await fetch(
        "/data/pedidos.json"
      );

    const pedidosJson =
      await response.json();

    const pedidosLocal =
      JSON.parse(
        localStorage.getItem(
          "pedidosLocal"
        ) || "[]"
      );

    pedidos = [
      ...pedidosJson,
      ...pedidosLocal
    ];

    renderOrders();

  } catch (error) {

    console.error(error);

    container.innerHTML =
      "<h2>Error cargando pedidos</h2>";

  }

}

filter.addEventListener(
  "change",
  renderOrders
);

loadOrders();