document.addEventListener("DOMContentLoaded", function () {
  // Initialize Clerk
  window.Clerk.load().then(() => {
    document.getElementById("sign-in-btn").onclick = () => Clerk.openSignIn();
    document.getElementById("sign-up-btn").onclick = () => Clerk.openSignUp();
  });

  // Products data
  const products = [
    {
      id: 1,
      name: "Classic Denim Jacket",
      price: 2499,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      description: "A timeless denim jacket with a vintage look. Perfect for any season.",
      reviews: "⭐ 4.7 (143 Reviews)"
    },
    {
      id: 2,
      name: "Retro Sneakers",
      price: 3499,
      image: "https://images.unsplash.com/photo-1595950657874-58d3b3b46c92",
      description: "Step back in time with our retro-style sneakers — comfort meets style.",
      reviews: "⭐ 4.8 (321 Reviews)"
    },
    {
      id: 3,
      name: "Vintage Graphic Tee",
      price: 1299,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format",
      description: "Soft cotton tee featuring old-school print for a nostalgic vibe.",
      reviews: "⭐ 4.6 (89 Reviews)"
    },
    {
      id: 4,
      name: "Old Skool Cap",
      price: 899,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format",
      description: "Keep it cool with this retro cap that never goes out of fashion.",
      reviews: "⭐ 4.5 (67 Reviews)"
    }
  ];

  const grid = document.getElementById("product-grid");
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.getElementById("close-modal");

  // Render products
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="openProduct(${p.id})">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
      </div>
    </div>
  `).join('');

  // Modal handling
  window.openProduct = function(id) {
    const p = products.find(x => x.id === id);
    modalContent.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h2>${p.name}</h2>
      <p>${p.description}</p>
      <p><strong>${p.reviews}</strong></p>
      <p style="font-size:1.2rem;font-weight:bold;">₹${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    modal.style.display = "flex";
  }

  window.addToCart = function(id) {
    const p = products.find(x => x.id === id);
    alert(`${p.name} added to cart!`);
    modal.style.display = "none";
  }

  closeModal.onclick = () => modal.style.display = "none";
  window.onclick = e => { if (e.target == modal) modal.style.display = "none"; }
});
