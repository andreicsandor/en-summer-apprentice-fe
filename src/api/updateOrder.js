import { API_BASE_URL } from "../config";

export function updateOrder(id, ticketType, quantity) {
  return fetch(`${API_BASE_URL}/Order/Patch`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId: id,
      ticketCategory: ticketType,
      numberOfTickets: quantity,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update order");
      }
    })
    .catch((error) => {
      console.error("Error updating the order:", error);
      throw error;
    });
}
