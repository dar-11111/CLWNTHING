// Add event listeners to Add to Cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const productId = button.getAttribute('data-product-id');
        const productName = button.getAttribute('data-product-name');
        const productPrice = parseFloat(button.getAttribute('data-product-price'));
        const productSize = button.parentElement.querySelector(`select[id^="size"]`).value;
        const productColor = button.parentElement.querySelector(`select[id^="color"]`).value;
        const productImage = button.parentElement.querySelector('img').src; // Get the product image URL

        // Create a product object
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            size: productSize,
            color: productColor,
            quantity: 1, // Set initial quantity to 1
            image: productImage // Include the image URL

        };
        
        // Get the current cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the product already exists in the cart
        const existingProductIndex = cart.findIndex(item => item.id === productId && item.size === productSize && item.color === productColor);

        if (existingProductIndex > -1) {
            // If it exists, update the quantity
            cart[existingProductIndex].quantity += 1; // Increase quantity by 1
        } else {
            // If it doesn't exist, add the new product to the cart
            cart.push(product);
        }

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        alert(`${productName} has been added to your cart! Quantity: ${cart[existingProductIndex]?.quantity || 1}`);
    });
});


// Display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cartItemsContainer.innerHTML = ''; // Clear previous items

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <input type="checkbox" class="item-checkbox" data-index="${index}" onchange="updateTotalAmount()">
            <img src="${item.image}" alt="${item.name}"> <!-- Include the product image -->
            <p>${item.name} - Size: ${item.size}, Color: ${item.color}, Quantity: ${item.quantity} - Price: ${item.price} PHP</p>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });
}

    updateTotalAmount(); // Update total amount after displaying items


// Update total amount based on selected items
function updateTotalAmount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    const checkboxes = document.querySelectorAll('.item-checkbox:checked');
    checkboxes.forEach(checkbox => {
        const index = checkbox.getAttribute('data-index');
        const item = cart[index];
        total += item.price * item.quantity; // Add item's total price to the total
    });

    document.getElementById('total-amount').innerText = `Total Amount: ${total} PHP`;
}

// Delete selected items from the cart
function deleteSelectedItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');
    
    // Create an array of indices to delete in reverse order
    const indicesToDelete = Array.from(checkboxes).map(checkbox => checkbox.getAttribute('data-index')).sort((a, b) => b - a);

    // Remove items from cart using reverse order to maintain correct indices
    indicesToDelete.forEach(index => {
        cart.splice(index, 1); // Remove item from cart
    });

    // Update localStorage and refresh cart display
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); // Refresh cart display
}

// Proceed to checkout button functionality
document.getElementById('proceed-checkout').addEventListener('click', () => {
    const selectedItems = [];
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');

    let totalAmount = 0; // Initialize total amount

    checkboxes.forEach(checkbox => {
        const index = checkbox.getAttribute('data-index');
        const item = JSON.parse(localStorage.getItem('cart'))[index];
        selectedItems.push(item);
        totalAmount += item.price * item.quantity; // Calculate total amount
    });

    if (selectedItems.length > 0) {
        // Create a custom message for the selected items
        const itemDetails = selectedItems.map(item => `${item.name} (Size: ${item.size}, Color: ${item.color}, Quantity: ${item.quantity}, Price: ${item.price} PHP)`).join('\n');
        alert(`Proceeding to checkout for selected items:\n${itemDetails}\n\nTotal Amount: ${totalAmount} PHP`);
        // You can redirect to a checkout page here
        // window.location.href = 'checkout.html';
    } else {
        alert('No items selected for checkout.');
    }
});

// Add a single delete button for selected items
document.getElementById('delete-selected').addEventListener('click', deleteSelectedItems);

// Display cart on page load
document.addEventListener('DOMContentLoaded', () => {
    displayCart(); // Call the displayCart function to populate items on load
});
