// DOM Elements
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
const addToCartBtn = document.querySelector('.add-to-cart-btn');
const checkoutBtn = document.querySelector('.checkout-btn');
const quantityInput = document.querySelector('.quantity-input');
const minusBtn = document.querySelector('.minus');
const plusBtn = document.querySelector('.plus');
const checkoutModal = document.querySelector('.checkout-modal');
const checkoutOverlay = document.querySelector('.checkout-overlay');
const closeCheckoutBtn = document.querySelector('.close-checkout');
const successModal = document.querySelector('.success-modal');
const successOverlay = document.querySelector('.success-overlay');
const continueBtn = document.querySelector('.continue-btn');
const checkoutForm = document.getElementById('checkout-form');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('.total-price');
const shippingPriceElement = document.querySelector('.shipping-price');
const finalPriceElement = document.querySelector('.final-price');
const summaryQuantity = document.querySelector('.summary-quantity');
const summaryTotal = document.querySelector('.summary-total');

// Product Data - Updated with your product image
const product = {
    id: 1,
    name: 'COMMERCE COMICS PART-1',
    subtitle: 'ACCOUNTANCY XI',
    price: 399,
    image: 'product-image.png', // Your product image file
    description: 'A revolutionary approach to learning accountancy! Commerce Comics Part-1 transforms complex accounting concepts into engaging visual stories.'
};

// Cart State
let cart = [];
let currentQuantity = 1;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('commerceForumCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Auto-fill location fields
    setupLocationFields();
});

// Set up all event listeners
function setupEventListeners() {
    // Cart icon click
    cartIcon.addEventListener('click', openCart);
    
    // Close cart
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    continueShoppingBtn.addEventListener('click', closeCart);
    
    // Quantity controls
    minusBtn.addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityInput.value = currentQuantity;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        if (currentQuantity < 10) {
            currentQuantity++;
            quantityInput.value = currentQuantity;
        }
    });
    
    quantityInput.addEventListener('change', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }
        currentQuantity = value;
        quantityInput.value = currentQuantity;
    });
    
    // Add to cart button
    addToCartBtn.addEventListener('click', addToCart);
    
    // Checkout button in cart
    checkoutBtn.addEventListener('click', openCheckout);
    
    // Close checkout modal
    closeCheckoutBtn.addEventListener('click', closeCheckout);
    checkoutOverlay.addEventListener('click', closeCheckout);
    
    // Form submission
    checkoutForm.addEventListener('submit', handleOrderSubmission);
    
    // Continue shopping button in success modal
    continueBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        successOverlay.classList.remove('active');
        closeCart();
    });
}

// Setup location-related fields
function setupLocationFields() {
    // Auto-fill phone number
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.value = '8117909090';
    }
    
    // Auto-fill state
    const stateField = document.getElementById('state');
    if (stateField) {
        stateField.value = 'Odisha';
    }
}

// Open cart sidebar
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Add product to cart
function addToCart() {
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += currentQuantity;
    } else {
        // Add new item to cart
        const cartItem = {
            ...product,
            quantity: currentQuantity
        };
        cart.push(cartItem);
    }
    
    // Save to localStorage
    saveCartToStorage();
    
    // Update UI
    updateCartUI();
    
    // Show notification
    showNotification('Commerce Comics added to cart!');
    
    // Reset quantity
    currentQuantity = 1;
    quantityInput.value = currentQuantity;
    
    // Open cart sidebar
    openCart();
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    renderCartItems();
    
    // Update cart totals
    updateCartTotals();
}

// Render cart items in sidebar
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 40px 0;">
                <i class="fas fa-shopping-cart" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                <p style="color: #666;">Your cart is empty</p>
                <p style="color: #888; font-size: 14px; margin-top: 10px;">Add Commerce Comics Part-1 to get started!</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="decrease-item" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-item" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Add event listeners to quantity and remove buttons
    document.querySelectorAll('.decrease-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            updateCartItemQuantity(index, -1);
        });
    });
    
    document.querySelectorAll('.increase-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            updateCartItemQuantity(index, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeCartItem(index);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(index, change) {
    if (cart[index]) {
        const newQuantity = cart[index].quantity + change;
        
        if (newQuantity < 1) {
            // Remove item if quantity becomes 0
            removeCartItem(index);
        } else if (newQuantity <= 10) {
            // Update quantity
            cart[index].quantity = newQuantity;
            saveCartToStorage();
            updateCartUI();
            showNotification(`Quantity updated to ${newQuantity}`);
        }
    }
}

// Remove item from cart
function removeCartItem(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartUI();
    showNotification('Item removed from cart');
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 0 : 0; // Free shipping from Puri, Odisha
    const total = subtotal + shipping;
    
    totalPriceElement.textContent = `₹${subtotal}`;
    shippingPriceElement.textContent = subtotal > 0 ? 'FREE' : '₹0';
    finalPriceElement.textContent = `₹${total}`;
    
    // Update checkout summary
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    summaryQuantity.textContent = totalQuantity;
    summaryTotal.textContent = `₹${total}`;
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('commerceForumCart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<p>${message}</p>`;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        transition: transform 0.4s;
        font-weight: 600;
        text-align: center;
        max-width: 90%;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3000);
}

// Open checkout modal
function openCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty! Add Commerce Comics to proceed.');
        return;
    }
    
    closeCart();
    checkoutModal.classList.add('active');
    checkoutOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close checkout modal
function closeCheckout() {
    checkoutModal.classList.remove('active');
    checkoutOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle order submission
function handleOrderSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(checkoutForm);
    const orderData = {
        customer: {
            name: formData.get('fullname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            pincode: formData.get('pincode')
        },
        paymentMethod: formData.get('payment'),
        items: [...cart],
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        orderId: generateOrderId(),
        date: new Date().toISOString(),
        shippingFrom: 'Puri, Odisha'
    };
    
    // In a real application, you would send this data to your server here
    console.log('Order submitted from Puri, Odisha:', orderData);
    
    // Show success message
    closeCheckout();
    showSuccessModal(orderData.orderId);
    
    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCartUI();
}

// Generate a random order ID
function generateOrderId() {
    const prefix = 'CF-PURI';
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}-${randomNum}`;
}

// Show success modal
function showSuccessModal(orderId) {
    // Update order ID in modal
    const orderIdElement = document.querySelector('.order-id span');
    if (orderIdElement) {
        orderIdElement.textContent = orderId;
    }
    
    // Show modal
    successModal.classList.add('active');
    successOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        if (cartSidebar.classList.contains('active')) {
            closeCart();
        }
        if (checkoutModal.classList.contains('active')) {
            closeCheckout();
        }
        if (successModal.classList.contains('active')) {
            successModal.classList.remove('active');
            successOverlay.classList.remove('active');
        }
    }
});

// Add phone number formatting
const phoneField = document.getElementById('phone');
if (phoneField) {
    phoneField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        e.target.value = value;
    });
}

// Add pincode validation
const pincodeField = document.getElementById('pincode');
if (pincodeField) {
    pincodeField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 6) {
            value = value.substring(0, 6);
        }
        e.target.value = value;
    });
}

// Add designer credit animation
function animateDesignerCredit() {
    const designerElement = document.querySelector('.designer');
    if (designerElement) {
        designerElement.style.transition = 'color 0.5s ease';
        designerElement.addEventListener('mouseenter', () => {
            designerElement.style.color = '#FFC107';
        });
        designerElement.addEventListener('mouseleave', () => {
            designerElement.style.color = 'var(--designer-color)';
        });
    }
}

// Initialize designer credit animation
animateDesignerCredit();