"use strict";

// ==========================================
// SHOPPIN - CE-1 E-COMMERCE SHOPPING CART
// ==========================================

const products = [{
        id: 1,
        name: "Laptop",
        price: 50000,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Headphones",
        price: 3000,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Smart Watch",
        price: 2500,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Sunglasses",
        price: 700,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Backpack",
        price: 1200,
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Running Shoes",
        price: 1800,
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Camera",
        price: 32000,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Wireless Earbuds",
        price: 2200,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 9,
        name: "Classic Watch",
        price: 1900,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 10,
        name: "Travel Bottle",
        price: 450,
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 11,
        name: "Keyboard",
        price: 1600,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 12,
        name: "Leather Wallet",
        price: 850,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = [];
let couponApplied = false;

const COUPON_CODE = "SAVE10";
const DISCOUNT_RATE = 0.10;
const FREE_DELIVERY_LIMIT = 2000;
const DELIVERY_CHARGE = 99;

// Format prices in Indian rupees
function money(amount) {
    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    });
}

// ==========================================
// DISPLAY, SEARCH, FILTER AND SORT PRODUCTS
// ==========================================

function displayProducts() {
    const list = document.getElementById("productList");

    if (!list) return;

    const searchInput = document.getElementById("search");
    const categoryInput = document.getElementById("category");
    const sortInput = document.getElementById("sort");

    const search = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const category = categoryInput ? categoryInput.value : "all";
    const sort = sortInput ? sortInput.value : "default";

    let filteredProducts = products.filter(function(product) {
        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        const matchesCategory =
            category === "" ||
            category.toLowerCase() === "all" ||
            product.category === category;

        return matchesSearch && matchesCategory;
    });

    if (sort === "lowToHigh") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    const count = document.getElementById("productCount");

    if (count) {
        count.textContent = filteredProducts.length +
            (filteredProducts.length === 1 ? " product" : " products");
    }

    if (filteredProducts.length === 0) {
        list.innerHTML =
            '<p class="no-products">No products found. Try another search or category.</p>';
        return;
    }

    list.innerHTML = filteredProducts.map(function(product) {
        return `
            <article class="product-card">
                <div class="product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='https://placehold.co/600x400/282d4c/c5b5ff?text=Product';"
                    >
                </div>

                <p class="product-category">${product.category}</p>

                <h3>${product.name}</h3>

                <p class="price">${money(product.price)}</p>

                <button
                    type="button"
                    class="add-button"
                    onclick="addToCart(${product.id})"
                >
                    + Add to Cart
                </button>
            </article>
        `;
    }).join("");
}

// ==========================================
// ADD, REMOVE AND UPDATE CART ITEMS
// ==========================================

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}

function changeQuantity(id, change) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);

    if (cart.length === 0) {
        couponApplied = false;
        showCouponMessage("", "");
    }

    renderCart();
}

// ==========================================
// CALCULATE SUBTOTAL, DISCOUNT AND DELIVERY
// ==========================================

function calculateTotals() {
    const subtotal = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    const discount = couponApplied ?
        subtotal * DISCOUNT_RATE :
        0;

    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_LIMIT ?
        0 :
        DELIVERY_CHARGE;

    const total = subtotal - discount + delivery;

    return {
        subtotal,
        discount,
        delivery,
        total
    };
}

// ==========================================
// DISPLAY CART AND UPDATE TOTALS
// ==========================================

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");

    if (!cartItems) return;

    const itemCount = cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);

    if (cartCount) {
        cartCount.textContent = itemCount;
    }

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';
        couponApplied = false;
    } else {
        cartItems.innerHTML = cart.map(function(item) {
            return `
                <div class="cart-item">
                    <div class="cart-product-info">
                        <strong>${item.name}</strong>
                        <p>${money(item.price)} each</p>

                        <div class="quantity-controls">
                            <button
                                type="button"
                                aria-label="Decrease ${item.name} quantity"
                                onclick="changeQuantity(${item.id}, -1)"
                            >−</button>

                            <span>${item.quantity}</span>

                            <button
                                type="button"
                                aria-label="Increase ${item.name} quantity"
                                onclick="changeQuantity(${item.id}, 1)"
                            >+</button>
                        </div>

                        <button
                            type="button"
                            class="remove-btn"
                            onclick="removeFromCart(${item.id})"
                        >Remove</button>
                    </div>

                    <strong class="cart-item-total">
                        ${money(item.price * item.quantity)}
                    </strong>
                </div>
            `;
        }).join("");
    }

    const totals = calculateTotals();

    document.getElementById("subtotal").textContent =
        money(totals.subtotal);

    document.getElementById("discount").textContent =
        "- " + money(totals.discount);

    document.getElementById("delivery").textContent =
        money(totals.delivery);

    document.getElementById("total").textContent =
        money(totals.total);

    const checkoutButton = document.getElementById("checkoutBtn");

    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }

    const checkoutTotal = document.getElementById("checkoutTotal");

    if (checkoutTotal) {
        checkoutTotal.textContent = money(totals.total);
    }
}

// ==========================================
// DISCOUNT COUPON
// ==========================================

function showCouponMessage(message, type) {
    const couponMessage = document.getElementById("couponMessage");

    if (!couponMessage) return;

    couponMessage.textContent = message;
    couponMessage.className = type;
}

function applyCoupon() {
    const couponInput = document.getElementById("couponCode");

    if (!couponInput) return;

    const code = couponInput.value.trim().toUpperCase();

    if (cart.length === 0) {
        showCouponMessage(
            "Add a product to your cart first.",
            "error"
        );
        return;
    }

    if (code === COUPON_CODE) {
        couponApplied = true;

        showCouponMessage(
            "Success! 10% discount applied.",
            "success"
        );
    } else {
        couponApplied = false;

        showCouponMessage(
            "Invalid coupon. Please enter SAVE10.",
            "error"
        );
    }

    renderCart();
}

// ==========================================
// CHECKOUT MODAL
// ==========================================

function checkout() {
    if (cart.length === 0) {
        alert("Please add products to your cart first.");
        return;
    }

    const modal = document.getElementById("checkoutModal");

    if (!modal) {
        alert("Checkout form was not found. Please check index.html.");
        return;
    }

    const checkoutForm = document.getElementById("checkoutForm");
    const orderMessage = document.getElementById("orderMessage");

    if (checkoutForm) {
        checkoutForm.reset();
    }

    if (orderMessage) {
        orderMessage.textContent = "";
    }

    renderCart();

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}

function closeCheckout() {
    const modal = document.getElementById("checkoutModal");

    if (modal) {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    }
}

function scrollToCart() {
    const cartPanel = document.getElementById("shoppingCart");

    if (cartPanel) {
        cartPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function scrollToProducts() {
    const productsSection = document.getElementById("productsSection");

    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// ==========================================
// CONNECT ALL BUTTONS AND INPUTS
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search");
    const categoryInput = document.getElementById("category");
    const sortInput = document.getElementById("sort");
    const applyCouponBtn = document.getElementById("applyCouponBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const checkoutForm = document.getElementById("checkoutForm");
    const modal = document.getElementById("checkoutModal");

    if (searchInput) {
        searchInput.addEventListener("input", displayProducts);
    }

    if (categoryInput) {
        categoryInput.addEventListener("change", displayProducts);
    }

    if (sortInput) {
        sortInput.addEventListener("change", displayProducts);
    }

    if (applyCouponBtn) {
        applyCouponBtn.addEventListener("click", applyCoupon);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkout);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeCheckout);
    }

    if (modal) {
        modal.addEventListener("click", function(event) {
            if (event.target === modal) {
                closeCheckout();
            }
        });
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closeCheckout();
        }
    });

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function(event) {
            event.preventDefault();

            if (cart.length === 0) return;

            const customerName =
                document.getElementById("customerName").value.trim();

            const customerEmail =
                document.getElementById("customerEmail").value.trim();

            if (!customerName || !customerEmail) {
                alert("Please enter your name and email.");
                return;
            }

            const orderMessage =
                document.getElementById("orderMessage");

            const orderTotal = calculateTotals().total;

            if (orderMessage) {
                orderMessage.textContent =
                    "Order placed successfully, " + customerName +
                    "! Your demo order total was " + money(orderTotal) +
                    ". Thank you for shopping with Shoppin!";
            }

            cart = [];
            couponApplied = false;

            renderCart();
            checkoutForm.reset();
            showCouponMessage("", "");
        });
    }

    // Initialize the store
    displayProducts();
    renderCart();
});