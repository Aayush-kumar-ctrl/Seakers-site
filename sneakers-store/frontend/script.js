// script.js
// Waits for the HTML document to fully load before running the script.
window.addEventListener("DOMContentLoaded", async () => {
  //Clerk.load(): Initializes Clerk, a user authentication service
  await window.Clerk.load();

  // 🎯 Get important DOM elements
  const signInBtn = document.getElementById("sign-in-btn");
  const signUpBtn = document.getElementById("sign-up-btn");
  const signOutBtn = document.getElementById("sign-out-btn");
  const checkoutBtn = document.getElementById("checkout-btn");
  
  const grid = document.getElementById("product-grid");

  // 📦 Dummy Product Data (replace with your own or import from products.js)
  const products = [
    { id: 1, name: "Classic T-Shirt", price: 599, image: "images/tshirt.jpg" },
    { id: 2, name: "Stylish Shoes", price: 1299, image: "images/shoes.jpg" },
    { id: 3, name: "Wrist Watch", price: 899, image: "images/watch.jpg" },
    { id: 4, name: "Denim Jeans", price: 999, image: "images/jeans.jpg" },
    { id: 5, name: "straight fit", price: 2999, image: "images/fitjeans.jpg" },




  ];

  // 👤 Clerk Authentication Logic
  const user = Clerk.user;

  if (user) {
    // If user is logged in
    signInBtn.style.display = "none";
    signUpBtn.style.display = "none";
    signOutBtn.style.display = "inline-block";
  } else {
    // If user is NOT logged in
    signOutBtn.style.display = "none";
    signInBtn.onclick = () => Clerk.openSignIn();
    signUpBtn.onclick = () => Clerk.openSignUp();
  }

  // 🚪 Sign-Out Function, to signout for a logged in user
  signOutBtn.onclick = async () => {
    await Clerk.signOut();
    window.location.reload();
  };

  // 🛍️ Render Product Grid, grid display 
  grid.innerHTML = products
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart 🛒</button>
      </div>
    `
    )
    .join("");

  // 🛒 Add to Cart (Stored in LocalStorage)?? browser memory /
  window.addToCart = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Avoid duplicates
    if (cart.find((p) => p.id === id)) {
      showToast(`${product.name} is already in your cart!`);
      return;
    }
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    showToast(`${product.name} added to cart ✅`);
  };

  // ✅ Checkout Button Action
  checkoutBtn.onclick = () => {
    if (!Clerk.user) {
      showToast("Please sign in to proceed to checkout 🛒");
      return;
    }
    window.location.href = "checkout.html";
  };

  // 🔔 Simple Toast Notification (instead of alerts), development
  function showToast(message) {
    let toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "toast";
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2000);
  }
});

