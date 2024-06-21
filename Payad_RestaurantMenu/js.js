// Cart data structure
let cart = {};

// Function to increase quantity and decrease stock
function increaseQuantity(element) {
  console.log("Increase Quantity function called.");
  var quantityElement = element.parentElement.querySelector('.quantity-value');
  var currentQuantity = parseInt(quantityElement.textContent);

  if (!isNaN(currentQuantity)) { // Check if currentQuantity is a valid number
    quantityElement.textContent = currentQuantity + 1;
    updateCart(element);
  }
}

// Function to decrease quantity and increase stock
function decreaseQuantity(element) {
  console.log("Decrease Quantity function called.");
  var quantityElement = element.parentElement.querySelector('.quantity-value');
  var currentQuantity = parseInt(quantityElement.textContent);

  if (!isNaN(currentQuantity) && currentQuantity > 0) {
    quantityElement.textContent = currentQuantity - 1;
    updateCart(element);
  }
}

// Function to update the cart
function updateCart(element) {
  console.log("Update Cart function called.");
  var foodItem = element.closest('.food-item');
  var itemName = foodItem.querySelector('p').textContent;
  var itemPrice = parseFloat(foodItem.querySelector('.price').textContent.replace('P', ''));

  if (!cart[itemName]) {
    cart[itemName] = {
      quantity: 0,
      price: itemPrice
    };
  }

  cart[itemName].quantity = parseInt(foodItem.querySelector('.quantity-value').textContent);

  if (cart[itemName].quantity === 0) {
    delete cart[itemName];
  }

  updateCartDisplay();
}

// Function to render the cart display
function updateCartDisplay() {
  console.log("Update Cart Display function called.");
  const cartItemsContainer = document.querySelector('#cart-items');
  cartItemsContainer.innerHTML = '';

  let totalAmount = 0;

  for (const itemName in cart) {
    const item = cart[itemName];
    const totalCost = item.quantity * item.price;
    totalAmount += totalCost;

    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    cartItemDiv.textContent = `${item.quantity} x ${itemName}: P${totalCost.toFixed(1)}`;
    cartItemsContainer.appendChild(cartItemDiv);
  }

  updateTotalAmountDisplay(totalAmount);
}

// Function to update the total amount display
function updateTotalAmountDisplay(totalAmount) {
  console.log("Update Total Amount Display function called.");
  const totalAmountElement = document.querySelector('#total-amount');
  totalAmountElement.textContent = `Total: P${totalAmount.toFixed(1)}`;

  calculateAndDisplayChange(); // Update change amount whenever total amount changes
}

// Function to calculate and display the change amount with discounts
function calculateAndDisplayChange() {
  console.log("Calculate and Display Change function called.");
  const paymentInput = document.querySelector('#payment-amount');
  const changeDisplay = document.querySelector('#change');
  const paymentAmount = parseFloat(paymentInput.value);
  const totalAmount = parseFloat(document.querySelector('#total-amount').textContent.replace('Total: P', ''));
  let discount = 0;

  // Get the selected discount type
  const discountType = document.querySelector('#discount-type').value;

  // Apply discount based on the selected type
  switch (discountType) {
    case 'pwd':
      discount = totalAmount * 0.2; // 20% discount for PWD
      break;
    case 'senior':
      discount = totalAmount * 0.15; // 15% discount for Senior Citizen
      break;
    case 'student':
      discount = totalAmount * 0.1; // 10% discount for Student
      break;
    default:
      break;
  }

  // Calculate the discounted total amount
  const discountedTotal = totalAmount - discount;

  // Check if payment amount is valid and calculate change accordingly
  if (!isNaN(paymentAmount) && paymentAmount >= discountedTotal) {
    const change = paymentAmount - discountedTotal;
    changeDisplay.textContent = `Change: P${change.toFixed(2)}`;
  } else {
    changeDisplay.textContent = 'Change: P0.00';
  }
}

// Attach event listeners to the "+" and "-" buttons
document.querySelectorAll('.add').forEach(button => {
  console.log("Add button event listener attached.");
  button.removeEventListener('click', increaseQuantity); // Remove existing event listener
  button.addEventListener('click', increaseQuantity);
});

document.querySelectorAll('.minus').forEach(button => {
  console.log("Minus button event listener attached.");
  button.removeEventListener('click', decreaseQuantity); // Remove existing event listener
  button.addEventListener('click', decreaseQuantity);
});

// Attach event listener to the payment input
document.querySelector('#payment-amount').addEventListener('input', calculateAndDisplayChange);

// Attach event listener to the discount dropdown
document.querySelector('#discount-type').addEventListener('change', calculateAndDisplayChange);
