document.addEventListener("DOMContentLoaded", async function () {
  // Load Clerk SDK
  await window.Clerk.load();

  const signInBtn = document.getElementById("sign-in-btn");
  const signUpBtn = document.getElementById("sign-up-btn");
  const signOutBtn = document.getElementById("sign-out-btn");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Auth Button Listeners
  signInBtn.onclick = () => Clerk.openSignIn();
  signUpBtn.onclick = () => Clerk.openSignUp();
  signOutBtn.onclick = () => Clerk.signOut();

  // Update UI based on sign-in state
  Clerk.addListener(({ user }) => {
    if (user) {
      signInBtn.style.display = "none";
      signUpBtn.style.display = "none";
      signOutBtn.style.display = "inline-block";
    } else {
      signInBtn.style.display = "inline-block";
      signUpBtn.style.display = "inline-block";
      signOutBtn.style.display = "none";
    }
  });

  // Products
  const products = [
    {
      id: 1,
      name: "Classic Denim Jacket",
      price: 2499,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      description: "A timeless denim jacket with a vintage look.",
    },
    {
      id: 2,
      name: "Retro Sneakers",
      price: 3499,
      image: "https://images.unsplash.com/photo-1595950657874-58d3b3b46c92",
      description: "Step back in time with our retro sneakers.",
    },
    {
      id: 3,
      name: "Vintage Graphic Tee",
      price: 1299,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
      description: "Soft cotton tee featuring old-school print.",
    },
  ];

  const grid = document.getElementById("product-grid");
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.getElementById("close-modal");

  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="openProduct(${p.id})">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
      </div>
    </div>
  `).join('');

  window.openProduct = (id) => {
    const p = products.find(x => x.id === id);
    modalContent.innerHTML = `
      <img src="${p.image}" alt="${p.name}" style="width:100%; border-radius:8px;">
      <h2>${p.name}</h2>
      <p>${p.description}</p>
      <h3>₹${p.price}</h3>
      <button id="addToCartBtn">Add to Cart</button>
    `;
    modal.style.display = "flex";

    document.getElementById("addToCartBtn").onclick = () => addToCart(p);
  };

  closeModal.onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
    modal.style.display = "none";
  }

  checkoutBtn.onclick = () => {
    window.location.href = "checkout.html";
  };
});
