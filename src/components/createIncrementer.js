export function createIncrementerItem() {
  return `
      <div class="incrementer-container"> 
        <button id="decrementButton" class="quantity-button">
          <img src="./src/assets/dash.svg" alt="Logo">
        </button>
        <input type="number" id="quantityInput" class="quantity-input" value="0" min="0" max="99">
        <button id="incrementButton" class="quantity-button">
          <img src="./src/assets/plus.svg" alt="Logo">
        </button>
      </div>
    `;
}
