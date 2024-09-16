export function createTypeDropdownItem(eventTypes) {
  if (!eventTypes || eventTypes.length === 0) return;

  const dropdown = document.createElement("select");
  dropdown.className = "filter-dropdown";
  dropdown.id = "typeDropdown";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerText = "All Types";
  dropdown.appendChild(defaultOption);

  eventTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.innerText = type;
    dropdown.appendChild(option);
  });

  return dropdown;
}
