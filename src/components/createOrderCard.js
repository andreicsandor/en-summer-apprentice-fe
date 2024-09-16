import { formatDate, formatPrice, resetEditPanel } from "../utils";
import { createEditableCard } from "./createEditableCard";
import { getEvent } from "../api/fetchEvents";
import { deleteOrder } from "../api/deleteOrders";
import toastr from 'toastr';
import { addOrdersLoader, removeOrdersLoader, addEditLoader, removeEditLoader } from "./createLoader";

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

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

    <div class="popup-container" id="popupContainer">
      <div class="custom-popup" id="customPopup">
      <p style="margin-bottom: 15px; font-size: 1.1em;">Are you sure you want to cancel the order?</p>
      <div style="display: flex; justify-content: flex-end; align-items: center;">
        <button class="quantity-button" style="color: #fa6e79; font-weight: bold;" id="confirmDelete">Confirm</button>
        <button class="quantity-button" style="font-weight: bold;" id="cancelDelete">Cancel</button>
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

  const menuContainer = document.querySelector(".orders-sort");
  menuContainer.classList.add("hidden");
  const listContainer = document.querySelector(".orders");
  listContainer.classList.add("hidden");

  addOrdersLoader();

  deleteOrder(orderId)
    .then(() => {
      toastr.success("Order has been cancelled.", "Woosh!&nbsp;&nbsp;&nbsp;🎭");
      orderCardElement.remove();
      resetEditPanel();
    })
    .catch((error) => {
      toastr.error(
        "We couldn't delete your order.",
        "Oops!&nbsp;&nbsp;&nbsp;🤔"
      );
      console.error("Error deleting the order:", error);
    })

    .finally(() => {
      setTimeout(() => {
        removeOrdersLoader();

        const menuContainer = document.querySelector(".orders-sort");
        menuContainer.classList.remove("hidden");
        const listContainer = document.querySelector(".orders");
        listContainer.classList.remove("hidden");
      }, 500);
    });
}

async function popupHandler(order, orderCard) {
  const overlay = document.getElementById("overlay");
  const popupContainer = orderCard.querySelector("#popupContainer");
  const confirmDeleteButton = orderCard.querySelector("#confirmDelete");
  const cancelDeleteButton = orderCard.querySelector("#cancelDelete");

  overlay.style.display = "block";
  popupContainer.style.display = "block";

  confirmDeleteButton.addEventListener("click", async () => {
    deleteHandler(order, orderCard);

    overlay.style.display = "none";
    popupContainer.style.display = "none";
  });

  cancelDeleteButton.addEventListener("click", () => {
    overlay.style.display = "none";
    popupContainer.style.display = "none";
  });
}

function editHandler(order) {
  const editHolder = document.querySelector(".edit-holder");
  editHolder.classList.add("hidden"); 

  addEditLoader();

  getEvent(order.eventId)
    .then(relatedEvent => {
      const editableCard = createEditableCard(relatedEvent, order);
      const editHolder = document.querySelector(".edit-holder");
      editHolder.innerHTML = "";
      editHolder.appendChild(editableCard);
    })
    .catch(error => {
      toastr.error("Something went wrong.");
      console.error("Error fetching related event:", error);
    })
    .finally(() => {
      setTimeout(() => {
        removeEditLoader();

        const editHolder = document.querySelector(".edit-holder");
        editHolder.classList.remove("hidden"); 
      }, 200);
    });
}

function attachEvents(orderCard, order) {
  const deleteButton = orderCard.querySelector(".delete-button");
  deleteButton.addEventListener("click", function () {
    popupHandler(order, orderCard);
  });

  const updateButton = orderCard.querySelector(".update-button");
  updateButton.addEventListener("click", function () {
    editHandler(order);
  });

  orderCard.addEventListener("click", function () {
    editHandler(order);
  });
}
