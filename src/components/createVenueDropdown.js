export function createVenueDropdownItem(eventVenues) {
  if (!eventVenues || eventVenues.length === 0) return;

  const dropdown = document.createElement("select");
  dropdown.className = "filter-dropdown";
  dropdown.id = "venueDropdown";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.innerText = "All Venues";
  dropdown.appendChild(defaultOption);

  eventVenues.forEach((venue) => {
    const option = document.createElement("option");
    option.value = venue.id;
    option.setAttribute('data-venue-id', venue.id);
    option.innerText = venue.name;
    dropdown.appendChild(option);
  });

  return dropdown;
}
