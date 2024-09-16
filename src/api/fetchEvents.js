import { API_BASE_URL } from "../config";

export async function getEvent(id) {
  const response = await fetch(`${API_BASE_URL}/Event/GetById?id=${id}`);
  const data = await response.json();
  return data;
}

export async function getEvents(venueId = null, eventTypeName = null) {
  let url = `${API_BASE_URL}/Event/GetEvents`;

  // Build the query string
  const params = new URLSearchParams();
  if (venueId && venueId !== "all") {
    params.append("venueId", venueId);
  }
  if (eventTypeName && eventTypeName !== "") {
    params.append("eventTypeName", eventTypeName);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// export async function getEvents() {
//   const response = await fetch(`${API_BASE_URL}/Event/GetAll`);
//   const data = await response.json();
//   return data;
// }
