import { createEventCard } from "./components/createEventCard";
import { createOrderCard } from "./components/createOrderCard";
import { getEvent, getEvents } from "./api/fetchEvents";
import { getOrders } from "./api/fetchOrders";

// Addings cards functions

export const addOrderCards = async (orders) => {
  const ordersContainer = document.querySelector(".orders");
  
  const mainMessage = document.createElement('h2');
  mainMessage.className = 'main-message';
  mainMessage.innerText = 'No orders available';

  ordersContainer.innerHTML = '';
  ordersContainer.appendChild(mainMessage);

  if (orders.length) {
    ordersContainer.innerHTML = "";

    for (let order of orders) {
      const data = await getEvent(order.eventId);
      const eventName = data.eventName;
      ordersContainer.appendChild(createOrderCard(order, eventName));
    }
  }
};

export const addEventCards = (events) => {
  const eventsContainer = document.querySelector(".events");

  const mainMessage = document.createElement('h2');
  mainMessage.className = 'main-message';
  mainMessage.innerText = 'No events available';

  eventsContainer.innerHTML = '';
  eventsContainer.appendChild(mainMessage);

  if (events.length) {
    eventsContainer.innerHTML = "";

    for (let event of events) {
      eventsContainer.appendChild(createEventCard(event));
    }
  }
};

// Resetting elements fucntions

export function refreshOrderCard(order) {
  const orderCardToUpdate = document.querySelector(
    `#order-card-${order.orderId}`
  );
  const parentNode = orderCardToUpdate.parentNode;

  getEvent(order.eventId).then((data) => {
    const eventName = data.eventName;
    const updatedOrderCard = createOrderCard(order, eventName);
    parentNode.replaceChild(updatedOrderCard, orderCardToUpdate);
  });
}

export function resetEditPanel() {
  const editSection = document.querySelector(".edit-holder");

  const contentMarkup = `
        <img src="./src/assets/bag-fill.svg" alt="Logo" style="margin-bottom: 20px">
        <h2 class="edit-section-title">Manage Your Orders</h2>
    `;

  editSection.innerHTML = "";
  editSection.innerHTML = contentMarkup;
}

// Formatting functions

export function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatPrice(price) {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Updating elements functions

export function updatePriceItem(input, dropdown, priceElement) {
  const quantity = parseInt(input.value);
  let ticketPrice = 0;

  if (dropdown) {
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    ticketPrice = parseFloat(selectedOption.getAttribute("data-price"));
  }

  if (quantity > 0) {
    const totalPrice = ticketPrice * quantity;
    const formattedTotalPrice = formatPrice(totalPrice);
    priceElement.textContent = `RON ${formattedTotalPrice}`;
  } else {
    priceElement.textContent = "";
  }
}

export function toggleCartButton(input, cartButton) {
  const currentQuantity = parseInt(input.value);
  cartButton.disabled = currentQuantity <= 0;
}

export function toggleSortButton(button, state) {
  if (state === "ascending") {
    button.innerHTML = `<span class="ascending-icon"></span> ${button.dataset.type}`;
    button.className = "sort-button active";
  } else if (state === "descending") {
    button.innerHTML = `<span class="descending-icon"></span> ${button.dataset.type}`;
    button.className = "sort-button active";
  } else {
    button.innerHTML = button.dataset.type;
    button.className = "sort-button";
  }
}

export function toggleDropdown(dropdown, state) {
  if (state === "selected") {
    dropdown.className = "filter-dropdown active";
  } else {
    dropdown.className = "filter-dropdown";
  }
}

// Sorting functions & constants for Orders

export const ordersSortState = {
  criterion: "none",
  direction: "none",
};

export async function getSortedOrders() {
  const criterionSort = ordersSortState.criterion;
  const directionSort = ordersSortState.direction;
  const orders = await getOrders();

  let sortedOrders;

  switch (criterionSort) {
    case "date":
      sortedOrders =
        directionSort === "ascending"
          ? sortOrdersByDate(orders)
          : sortOrdersByDate(orders, "descending");
      break;
    case "price":
      sortedOrders =
        directionSort === "ascending"
          ? sortOrdersByPrice(orders)
          : sortOrdersByPrice(orders, "descending");
      break;
    case "none":
      sortedOrders = orders;
      break;
    default:
      throw new Error("Invalid sort criterion.");
  }

  return sortedOrders;
}

export function setOrdersSortState(criterion, direction = "none") {
  ordersSortState.criterion = criterion;
  ordersSortState.direction = direction;
}

export function sortOrdersByDate(orders, direction = "ascending") {
  return [...orders].sort((a, b) => {
    const dateA = new Date(a.orderedAt);
    const dateB = new Date(b.orderedAt);

    if (direction === "ascending") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}

export function sortOrdersByPrice(orders, direction = "ascending") {
  return [...orders].sort((a, b) => {
    const priceA = a.totalPrice;
    const priceB = b.totalPrice;

    if (direction === "ascending") {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });
}

// Filtering and Sorting functions & constants for Events

export const eventsFilterSortState = {
  filter: {
    venueId: null,
    eventTypeName: null,
  },
  sort: {
    criterion: "none",
    direction: "none",
  },
};

export async function getFilteredSortedEvents() {
  const venueFilter = eventsFilterSortState.filter.venueId;
  const typeFilter = eventsFilterSortState.filter.eventTypeName;
  const criterionSort = eventsFilterSortState.sort.criterion;
  const directionSort = eventsFilterSortState.sort.direction;
  const filteredEvents = await getEvents(venueFilter, typeFilter);

  let sortedEvents;

  switch (criterionSort) {
    case "date":
      sortedEvents =
        directionSort === "ascending"
          ? sortEventsByDate(filteredEvents)
          : sortEventsByDate(filteredEvents, "descending");
      break;
    case "name":
      sortedEvents =
        directionSort === "ascending"
          ? sortEventsByName(filteredEvents)
          : sortEventsByName(filteredEvents, "descending");
      break;
    case "none":
      sortedEvents = filteredEvents;
      break;
    default:
      throw new Error("Invalid sort criterion.");
  }

  return sortedEvents;
}

export function setEventsFilterState(venueId = null, eventTypeName = null) {
  eventsFilterSortState.filter.venueId = venueId;
  eventsFilterSortState.filter.eventTypeName = eventTypeName;
}

export function setEventsSortState(criterion, direction = "none") {
  eventsFilterSortState.sort.criterion = criterion;
  eventsFilterSortState.sort.direction = direction;
}

export function sortEventsByDate(events, direction = "ascending") {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);

    if (direction === "ascending") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}

export function sortEventsByName(events, direction = "ascending") {
  return [...events].sort((a, b) => {
    const nameA = a.eventName.toUpperCase(); // Ignore case
    const nameB = b.eventName.toUpperCase(); // Ignore case

    if (nameA < nameB) {
      return direction === "ascending" ? -1 : 1;
    }

    if (nameA > nameB) {
      return direction === "ascending" ? 1 : -1;
    }

    // names are equal
    return 0;
  });
}

// Manipulating data

export function getEventVenues(events) {
  const eventVenues = [];

  events.forEach((event) => {
    if (!eventVenues.some((venue) => venue.id === event.venue.venueId)) {
      eventVenues.push({
        id: event.venue.venueId,
        name: event.venue.venueName,
      });
    }
  });

  return eventVenues;
}

export function getEventTypes(events) {
  const eventTypes = new Set(events.map((event) => event.eventType));
  return eventTypes;
}
