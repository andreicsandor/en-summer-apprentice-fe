import {
  eventsFilterSortState as state,
  setEventsFilterState as setFilterState,
  setEventsSortState as setSortState,
  toggleDropdown,
  toggleSortButton,
  getEventTypes,
  getEventVenues,
  getFilteredSortedEvents,
  addEventCards,
} from "../utils";
import { createTypeDropdownItem } from "./createTypeDropdown";
import { createVenueDropdownItem } from "./createVenueDropdown";

export function createEventsSearchBar() {
  const eventsSearchContainer = document.querySelector(".events-search");

  const searchBar = document.createElement("div");
  searchBar.className = "search-bar";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search...";

  const searchButton = document.createElement("button");
  searchButton.style.backgroundImage = "url('./src/assets/search.svg')";
  searchButton.style.backgroundSize = "cover";
  searchButton.style.border = "none";
  searchButton.style.backgroundRepeat = "no-repeat";
  searchButton.style.backgroundPosition = "center";
  searchButton.style.width = "16px";
  searchButton.style.height = "16px";

  searchBar.appendChild(searchInput);
  searchBar.appendChild(searchButton);

  searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    searchHandler(query);
  });

  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const query = searchInput.value;
      searchHandler(query);
    }
  });

  eventsSearchContainer.append(searchBar);
}

export function createEventsFilterDropdowns(events) {
  const eventsFilterContainer = document.querySelector(".events-filter");

  const filterByLabel = document.createElement("h3");
  filterByLabel.innerText = "Filter by";
  eventsFilterContainer.appendChild(filterByLabel);

  const typeDropdown = createTypeDropdownItem(getEventTypes(events));
  const venueDropdown = createVenueDropdownItem(getEventVenues(events));

  const defaultTypeValue = "";
  const defaultVenueValue = "all";

  typeDropdown.addEventListener("change", function () {
    filterHandler();

    let typeState =
      typeDropdown.value !== defaultTypeValue ? "selected" : "default";
    toggleDropdown(typeDropdown, typeState);
  });

  venueDropdown.addEventListener("change", function () {
    filterHandler();

    let venueState =
      venueDropdown.value !== defaultVenueValue ? "selected" : "default";
    toggleDropdown(venueDropdown, venueState);
  });

  eventsFilterContainer.append(typeDropdown, venueDropdown);
}

export function createEventsSortButtons() {
  const eventsSortContainer = document.querySelector(".events-sort");

  const sortByLabel = document.createElement("h3");
  sortByLabel.innerText = "Sort by";
  eventsSortContainer.appendChild(sortByLabel);

  const dateButton = document.createElement("button");
  dateButton.className = "sort-button";
  dateButton.innerHTML = "Date";
  dateButton.dataset.type = "Date";

  const nameButton = document.createElement("button");
  nameButton.className = "sort-button";
  nameButton.innerHTML = "Name";
  nameButton.dataset.type = "Name";

  dateButton.addEventListener("click", function () {
    sortHandler(dateButton);
  });

  nameButton.addEventListener("click", function () {
    sortHandler(nameButton);
  });

  eventsSortContainer.append(dateButton, nameButton);
}

async function searchHandler(query) {
  const filteredAndSortedEvents = await getFilteredSortedEvents();
  const formattedQuery = query.toLowerCase();

  const searchedEvents = filteredAndSortedEvents.filter(
    (event) =>
      event.eventName.toLowerCase().includes(formattedQuery) ||
      event.eventType.toLowerCase().includes(formattedQuery) ||
      event.venue.venueLocation.toLowerCase().includes(formattedQuery)
  );

  addEventCards(searchedEvents);
}

async function filterHandler() {
  const typeDropdown = document.getElementById("typeDropdown");
  const venueDropdown = document.getElementById("venueDropdown");

  setFilterState(
    venueDropdown.selectedOptions[0].dataset.venueId,
    typeDropdown.value
  );

  const events = await getFilteredSortedEvents();
  addEventCards(events);
}

async function sortHandler(clickedButton) {
  const buttonType = clickedButton.dataset.type.toLowerCase();
  let previousButton;

  if (clickedButton.dataset.type === "Date") {
    previousButton = document.querySelector('button[data-type="Name"]');
  } else {
    previousButton = document.querySelector('button[data-type="Date"]');
  }
  if (state.criterion !== buttonType) {
    toggleSortButton(previousButton, "none");
  }
  if (
    state.sort.criterion === buttonType &&
    state.sort.direction === "ascending"
  ) {
    setSortState("none", "none");
    toggleSortButton(clickedButton, "none");
  } else if (
    state.sort.criterion === buttonType &&
    state.sort.direction === "descending"
  ) {
    setSortState(buttonType, "ascending");
    toggleSortButton(clickedButton, "ascending");
  } else {
    setSortState(buttonType, "descending");
    toggleSortButton(clickedButton, "descending");
  }

  const events = await getFilteredSortedEvents();
  addEventCards(events);
}
