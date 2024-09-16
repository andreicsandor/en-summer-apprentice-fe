import {
  ordersSortState as state,
  setOrdersSortState as setSortState,
  toggleSortButton,
  getSortedOrders,
  addOrderCards
} from "../utils";

export function createOrdersSortButtons() {
  const ordersSortContainer = document.querySelector(".orders-sort");

  const sortByLabel = document.createElement("h3");
  sortByLabel.innerText = "Sort by";
  ordersSortContainer.appendChild(sortByLabel);

  const dateButton = document.createElement("button");
  dateButton.className = "sort-button";
  dateButton.innerHTML = "Date";
  dateButton.dataset.type = "Date";

  const priceButton = document.createElement("button");
  priceButton.className = "sort-button";
  priceButton.innerHTML = "Price";
  priceButton.dataset.type = "Price";

  dateButton.addEventListener("click", function () {
    sortHandler(dateButton);
  });

  priceButton.addEventListener("click", function () {
    sortHandler(priceButton);
  });

  ordersSortContainer.append(dateButton, priceButton);
}

async function sortHandler(clickedButton) {
  const buttonType = clickedButton.dataset.type.toLowerCase();
  let previousButton;

  if (clickedButton.dataset.type === "Date") {
    previousButton = document.querySelector('button[data-type="Price"]');
  } else {
    previousButton = document.querySelector('button[data-type="Date"]');
  }

  if (state.criterion !== buttonType) {
    toggleSortButton(previousButton, "none");
  }

  if (
    state.criterion === buttonType &&
    state.direction === "ascending"
  ) {
    setSortState("none", "none");
    toggleSortButton(clickedButton, "none");
  } else if (
    state.criterion === buttonType &&
    state.direction === "descending"
  ) {
    setSortState(buttonType, "ascending");
    toggleSortButton(clickedButton, "ascending");
  } else {
    setSortState(buttonType, "descending");
    toggleSortButton(clickedButton, "descending");
  }

  const orders = await getSortedOrders();
  addOrderCards(orders);
}
