// Function to increase quantity and decrease stock
function increaseQuantity(element) {
  var quantityElement = element.parentElement.querySelector('.quantity-value');
  var stockElement = element.parentElement.parentElement.querySelector('.stock-value');
  
  var currentQuantity = parseInt(quantityElement.textContent);
  var currentStock = parseInt(stockElement.textContent);
  
  if (currentStock > 0) {
      quantityElement.textContent = currentQuantity + 1;
      stockElement.textContent = currentStock - 1;
      updateTotal();
      updateTotalAmountDisplay(); // Update total amount display
  }
}

// Function to decrease quantity and increase stock
function decreaseQuantity(element) {
  var quantityElement = element.parentElement.querySelector('.quantity-value');
  var stockElement = element.parentElement.parentElement.querySelector('.stock-value');
  
  var currentQuantity = parseInt(quantityElement.textContent);
  var currentStock = parseInt(stockElement.textContent);
  
  if (currentQuantity > 0) {
      quantityElement.textContent = currentQuantity - 1;
      stockElement.textContent = currentStock + 1;
      updateTotal();
      updateTotalAmountDisplay(); // Update total amount display
  }
}

// Function to add stock based on input
function addStock(element) {
  var stockElement = element.parentElement.querySelector('.stock-value');
  var addStockInput = element.parentElement.querySelector('.add-stock-input');
  
  var additionalStock = parseInt(addStockInput.value);
  
  if (additionalStock >= 0) {
      var currentStock = parseInt(stockElement.textContent);
      stockElement.textContent = currentStock + additionalStock;
      addStockInput.value = 0; // Reset the input value to 0
  }
}


// Cart data structure
let cart = {};

// Function to add or remove an item from the cart
function updateCart(itemName, itemPrice, quantityChange) {
  // If the item is not in the cart, add it with an initial quantity of 0
  if (!cart[itemName]) {
      cart[itemName] = {
          quantity: 0,
          price: itemPrice
      };
  }
  
  // Update the quantity based on the change (increase or decrease)
  cart[itemName].quantity += quantityChange;
  
  // If the quantity becomes zero, remove the item from the cart
  if (cart[itemName].quantity <= 0) {
      delete cart[itemName];
  }
  
  // Update the cart display and total amount display
  updateCartDisplay();
  updateTotalAmountDisplay();
}

// Function to render the cart display
function updateCartDisplay() {
  // Get the cart section element
  const cartItemsContainer = document.querySelector('#cart-items');
  
  // Clear the existing cart content
  cartItemsContainer.innerHTML = '';
  
  // Iterate through the cart and display the name, quantity, and total cost of each item
  for (const itemName in cart) {
      const item = cart[itemName];
      
      // Calculate the total cost for the item
      const totalCost = item.quantity * item.price;
      
      // Create a div element to display the item name, quantity, and total cost
      const cartItemDiv = document.createElement('div');
      cartItemDiv.className = 'cart-item';
      cartItemDiv.innerHTML = `
          x${item.quantity} - ${itemName} P${totalCost.toFixed(2)}
      `;
      
      // Append the div element to the cart section
      cartItemsContainer.appendChild(cartItemDiv);
  }
  
  // Update the total amount display
  updateTotalAmountDisplay();
}

// Attach event listeners to the "+" and "-" buttons
document.querySelectorAll('.add').forEach(button => {
  button.addEventListener('click', function() {
      const foodItem = button.closest('.food-item');
      const itemName = foodItem.querySelector('p').textContent;
      const itemPrice = parseInt(foodItem.querySelector('.price').textContent.replace('P', ''), 10);
      updateCart(itemName, itemPrice, 1);
  });
});

document.querySelectorAll('.minus').forEach(button => {
  button.addEventListener('click', function() {
      const foodItem = button.closest('.food-item');
      const itemName = foodItem.querySelector('p').textContent;
      const itemPrice = parseInt(foodItem.querySelector('.price').textContent.replace('P', ''), 10);
      updateCart(itemName, itemPrice, -1);
  });
});

// Function to calculate the total amount of the order after applying discount
function calculateTotalAmount() {
  let totalAmount = 0;
  for (const itemName in cart) {
    const item = cart[itemName];
    totalAmount += item.quantity * item.price;
  }
  
  const discountPercentage = getDiscount();
  totalAmount = totalAmount - (totalAmount * discountPercentage);
  
  return totalAmount;
}


// Function to calculate and display the change amount
function calculateAndDisplayChange() {
  const paymentInput = document.querySelector('#payment-amount');
  const changeDisplay = document.querySelector('#change');
  const paymentAmount = parseFloat(paymentInput.value);
  const totalAmount = calculateTotalAmount();

  if (!isNaN(paymentAmount) && paymentAmount >= totalAmount) {
      const change = paymentAmount - totalAmount;
      changeDisplay.textContent = `Change: P${change.toFixed(2)}`;
  } else {
      changeDisplay.textContent = 'Change: P0.00';
  }
}

// Attach event listener to the discount dropdown
document.querySelector('#discount-type').addEventListener('change', updateTotalAmountDisplay);


// Function to calculate and display the change amount
function calculateAndDisplayChange() {
  const paymentInput = document.querySelector('#payment-amount');
  const changeDisplay = document.querySelector('#change');
  const paymentAmount = parseFloat(paymentInput.value);
  const totalAmount = calculateTotalAmount();

  if (!isNaN(paymentAmount)) {
    if (paymentAmount >= totalAmount) {
      const change = paymentAmount - totalAmount;
      changeDisplay.textContent = `Change: P${change.toFixed(2)}`;
    } else {
      changeDisplay.textContent = 'Please enter a greater amount.';
    }
  } else {
    changeDisplay.textContent = 'Invalid input. Please enter a valid amount.';
  }
}


// Attach event listener to the change button
document.querySelector('#calculate-change-button').addEventListener('click', calculateAndDisplayChange);


// Function to update the total amount display
function updateTotalAmountDisplay() {
  const totalAmount = calculateTotalAmount();
  const totalAmountElement = document.querySelector('#total-amount');
  totalAmountElement.textContent = `Total: P${totalAmount.toFixed(2)}`;
}

// Call the function to update the total amount display whenever the cart is modified
function updateTotal() {
  updateTotalAmountDisplay();
}


// Function to get the selected discount type and apply discount
function getDiscount() {
  const discountType = document.querySelector('#discount-type').value;
  let discountPercentage = 0;
  
  switch (discountType) {
    case 'pwd':
      discountPercentage = 0.30; // 30% discount
      break;
    case 'senior':
      discountPercentage = 0.20; // 20% discount
      break;
    case 'student':
      discountPercentage = 0.10; // 10% discount
      break;
    default:
      discountPercentage = 0; // No discount
  }
  
  return discountPercentage;
}
