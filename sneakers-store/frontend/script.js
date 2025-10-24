window.addEventListener("DOMContentLoaded", async () => {
  await window.Clerk.load();

  const signInBtn = document.getElementById("sign-in-btn");
  const signUpBtn = document.getElementById("sign-up-btn");
  const signOutBtn = document.getElementById("sign-out-btn");
  const checkoutBtn = document.getElementById("checkout-btn");
  const grid = document.getElementById("product-grid");

  // 👤 Clerk Auth
  if (Clerk.user) {
    signInBtn.style.display = "none";
    signUpBtn.style.display = "none";
    signOutBtn.style.display = "inline-block";
  } else {
    signInBtn.onclick = () => Clerk.openSignIn();
    signUpBtn.onclick = () => Clerk.openSignUp();
  }

  signOutBtn.onclick = () => {
    Clerk.signOut().then(() => window.location.reload());
  };

  // 🛍️ Render Products
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

  // 🛒 Add to Cart
  window.addToCart = (id) => {
    const product = products.find((p) => p.id === id);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  // ✅ Checkout Redirect
  checkoutBtn.onclick = () => {
    window.location.href = "checkout.html";
  };
});

