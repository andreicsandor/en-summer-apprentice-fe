export function addEventsLoader() {
  const loader = document.querySelector("#eventsLoader");
  loader.classList.remove("hidden");
}

export function removeEventsLoader() {
  const loader = document.querySelector("#eventsLoader");
  loader.classList.add("hidden");
}

export function addOrdersLoader() {
  const loader = document.querySelector("#ordersLoader");
  loader.classList.remove("hidden"); 
}

export function removeOrdersLoader() {
  const loader = document.querySelector("#ordersLoader");
  loader.classList.add("hidden");
}

export function addEditLoader() {
  const loader = document.querySelector("#editLoader");
  loader.classList.remove("hidden"); 
}

export function removeEditLoader() {
  const loader = document.querySelector("#editLoader");
  loader.classList.add("hidden");
}