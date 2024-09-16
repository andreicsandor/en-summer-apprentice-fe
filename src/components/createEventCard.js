import { formatDate, updatePriceItem, toggleCartButton } from "../utils";
import { createTicketDropdownItem } from "./createTicketDropdown";
import { createIncrementerItem } from "./createIncrementer";
import { createOrder } from "../api/createOrders";
import toastr from 'toastr';

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

export function createEventCard(event) {
  const eventCard = document.createElement("div");
  const formattedStartDate = formatDate(event.startDate);
  const formattedEndDate = formatDate(event.endDate);
  const displayDate =
    formattedStartDate === formattedEndDate
      ? formattedStartDate
      : `${formattedStartDate} – ${formattedEndDate}`;

  const contentMarkup = `
    <div class="event-card" data-event-id="${event}">
      <img src="${event.eventImage}" class="card-img-top" alt="${
        event.eventImage
      }">
      <div class="card-body">
        <header>
          <h2 class="event-title text-2xl font-bold">${event.eventName}</h2>
        </header> 
        <div class="content">
          <p class="description text-gray-700">${event.eventDescription}</p>
          <p class="date text-gray-700" style="font-size: 0.9rem;">${displayDate}</p>
          <p class="date text-gray-700" style="font-size: 0.9rem;">${event.venue.venueName}</p>
          <div class="order-options text-gray-700">
            ${createTicketDropdownItem(event.ticketCategories)}
            ${createIncrementerItem()}
          </div>
          <div class="purchase-options text-gray-700">
            <button class="add-button">
              <img src="./src/assets/bag-plus-fill.svg" alt="Logo">
            </button>
            <span id="totalPrice" class="total-price"></span> 
          </div>
        </div>
      </div>
    </div>
  `;

  eventCard.innerHTML = contentMarkup;

  attachEvents(eventCard);

  return eventCard;
}

function createHandler(dropdown, input, cartButton, priceElement) {
  const ticketType = dropdown
    ? dropdown.options[dropdown.selectedIndex].value
    : null;
  const quantity = parseInt(input.value, 10);

  if (quantity <= 0 || !ticketType) {
    console.success("No valid input data.");
    return;
  }

  createOrder(ticketType, quantity) 
    .then(() => {
      toastr.success("Order placed successfully.", "Hooray!&nbsp;&nbsp;&nbsp;🎫");
      input.value = 0;
      dropdown.selectedIndex = 0;
      cartButton.disabled = true;
      priceElement.textContent = "";
    })
    .catch((error) => {
      toastr.error("We couldn't place your order.", "Oops!&nbsp;&nbsp;&nbsp;🙁");
      console.error("Error saving the order:", error);
    });
}

function attachEvents(eventCard) {
  const decrementButton = eventCard.querySelector("#decrementButton");
  const incrementButton = eventCard.querySelector("#incrementButton");
  const cartButton = eventCard.querySelector(".add-button");
  const input = eventCard.querySelector(".quantity-input");
  const dropdown = eventCard.querySelector(".ticket-category-dropdown");
  const priceElement = eventCard.querySelector("#totalPrice");

  decrementButton.addEventListener("click", function () {
    if (input.value > input.min) {
      input.value = parseInt(input.value, 10) - 1;
    }
    toggleCartButton(input, cartButton);
    updatePriceItem(input, dropdown, priceElement);
  });

  incrementButton.addEventListener("click", function () {
    if (input.value < input.max) {
      input.value = parseInt(input.value, 10) + 1;
    }
    toggleCartButton(input, cartButton);
    updatePriceItem(input, dropdown, priceElement);
  });

  input.addEventListener("blur", () => {
    if (!input.value) {
      input.value = 0;
    }
    toggleCartButton(input, cartButton);
    updatePriceItem(input, dropdown, priceElement);
  });

  input.addEventListener("input", function () {
    toggleCartButton(input, cartButton);
    updatePriceItem(input, dropdown, priceElement);
  });

  cartButton.addEventListener("click", function () {
    createHandler(dropdown, input, cartButton, priceElement);
  });

  if (dropdown) {
    dropdown.addEventListener("change", function () {
      updatePriceItem(input, dropdown, priceElement);
    });
  }

  toggleCartButton(input, cartButton);
  updatePriceItem(input, dropdown, priceElement);
}
