export function createTicketDropdownItem(ticketCategories, orderCategory) {
  if (!ticketCategories || ticketCategories.length === 0) return "";

  const options = ticketCategories
    .map(
      (category) => `
      <option value="${category.ticketCategoryId}" data-price="${
        category.price
      }" 
      ${category.ticketCategoryDescription === orderCategory ? "selected" : ""}>
        ${category.ticketCategoryDescription} 
      </option>
    `
    )
    .join("");

  if (ticketCategories.length === 1) {
    return `
      <select class="ticket-category-dropdown" disabled>
        ${options}
      </select>
      `;
  }

  return `
      <select class="ticket-category-dropdown">
        ${options}
      </select>
    `;
}
