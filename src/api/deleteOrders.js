import { API_BASE_URL } from "../config";

export function deleteOrder(id) {
  return fetch(`${API_BASE_URL}/Order/Delete?id=${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
    })
    .catch((error) => {
      console.error("Error deleting the order:", error);
      throw error;
    });
}
