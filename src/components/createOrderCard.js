import { formatDate, formatPrice, resetEditPanel } from "../utils";
import { createEditableCard } from "./createEditableCard";
import { getEvent } from "../api/fetchEvents";
import { deleteOrder } from "../api/deleteOrders";

export function createOrderCard(order, eventName) {
  const orderCard = document.createElement("div");
  const formattedDate = formatDate(order.orderedAt);
  const formattedPrice = formatPrice(order.totalPrice);

  const contentMarkup = `
    <div class="order-card" id="order-card-${order.orderId}">
      <div class="card-body">
        <div class="order-information">
          <header>
            <h2 class="event-title">${eventName}</h2>
          </header> 
          <div class="content">
            <p class="text-gray-700 ticket-quantity">${order.numberOfTickets} 
            <span class="ticket-type">${order.ticketCategory}</span> 
            ticket${order.numberOfTickets > 1 ? "s" : ""}</p>
            <p class="text-gray-700">RON ${formattedPrice}</p>
            <p class="date text-gray-700">${formattedDate}</p>
          </div>
        </div>
        <div class="button-group">
          <button href="#" class="update-button">
            <img src="./src/assets/pencil-fill.svg" alt="Logo">
          </button>
          <button href="#" class="delete-button" data-order-id="${
            order.orderId
          }">
            <img src="./src/assets/trash-fill.svg" alt="Logo">
          </button>
        </div>
      </div>
    </div>
  `;

  orderCard.innerHTML = contentMarkup;

  attachEvents(orderCard, order);

  return orderCard;
}

async function deleteHandler(order, orderCardElement) {
  const orderId = order.orderId;

  deleteOrder(orderId)
    .then(() => {
      orderCardElement.remove();
      resetEditPanel();
    })
    .catch((error) => {});
}

async function editHandler(order) {
  const relatedEvent = await getEvent(order.eventId);
  const editableCard = createEditableCard(relatedEvent, order);

  const editSection = document.querySelector(".edit-section");
  editSection.innerHTML = "";

  editSection.appendChild(editableCard);
}

function attachEvents(orderCard, order) {
  const deleteButton = orderCard.querySelector(".delete-button");
  deleteButton.addEventListener("click", function () {
    deleteHandler(order, orderCard);
  });

  const updateButton = orderCard.querySelector(".update-button");
  updateButton.addEventListener("click", function () {
    editHandler(order);
  });

  orderCard.addEventListener("click", function () {
    editHandler(order);
  });
}
