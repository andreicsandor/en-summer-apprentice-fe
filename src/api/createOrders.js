import { API_BASE_URL } from "../config";

export function createOrder(ticketType, quantity) {
  return fetch(`${API_BASE_URL}/Order/Create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticketCategoryId: ticketType,
      numberOfTickets: quantity,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to create order.");
    }
  })
  .catch((error) => {
    console.error("Error creating the order:", error);
    throw error;
  });
}
