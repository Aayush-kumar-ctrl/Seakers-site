// script.js - robust Clerk init + products/modal/add-to-cart (drop-in replacement)
//
// Paste this file as your script.js (replace existing). Keep your index.html and style.css unchanged.
// Served on localhost (http://localhost:PORT) and ensure Clerk dashboard allowed origin includes that URL.

(async function () {
  const PUBLISHABLE_KEY = "pk_test_Y3Jpc3Ata29pLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";

  // wait until Clerk script is present on window
  async function waitForClerk(timeout = 7000) {
    const start = Date.now();
    while (!window.Clerk) {
      if (Date.now() - start > timeout) return null;
      await new Promise((r) => setTimeout(r, 50));
    }
    return window.Clerk;
  }

  // try to initialize Clerk safely
  try {
    const ClerkLib = await waitForClerk(7000);
    if (!ClerkLib) throw new Error("Clerk script not found (check script tag/network).");

    // If data attribute exists in index.html this is safe; calling load with publishableKey is also safe
    // Use the publishable key to be explicit
    await Clerk.load({ publishableKey: PUBLISHABLE_KEY });

    // Attach handlers after Clerk is ready
    const signInBtn = document.getElementById("sign-in-btn");
    const signUpBtn = document.getElementById("sign-up-btn");

    if (signInBtn) {
      signInBtn.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          Clerk.openSignIn({ appearance: { layout: "modal" } });
        } catch (err) {
          console.error("Clerk.openSignIn() error:", err);
          alert("Unable to open Sign In — see console for details.");
        }
      });
    }

    if (signUpBtn) {
      signUpBtn.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          Clerk.openSignUp({ appearance: { layout: "modal" } });
        } catch (err) {
          console.error("Clerk.openSignUp() error:", err);
          alert("Unable to open Sign Up — see console for details.");
        }
      });
    }

    console.log("✅ Clerk initialized");
  } catch (err) {
    console.error("❌ Clerk initialization failed:", err);
    // don't stop — continue to render products/modal
  }

  // ----------------- products / modal / add-to-cart (same behaviour as before) -----------------
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

  // render products
  if (grid) {
    grid.innerHTML = products.map(p => `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
        </div>
      </div>
    `).join('');

    // attach click handlers (safer than inline onclick)
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id'), 10);
        openProduct(id);
      });
    });
  }

  // open product modal
  window.openProduct = function (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    modalContent.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h2>${p.name}</h2>
      <p>${p.description}</p>
      <p><strong>${p.reviews}</strong></p>
      <p style="font-size:1.2rem;font-weight:bold;">₹${p.price}</p>
      <button id="modal-add-btn">Add to Cart</button>
    `;
    modal.style.display = "flex";

    const addBtn = document.getElementById('modal-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addToCart(p.id);
      });
    }
  };

  // add to cart behavior (unchanged alert)
  window.addToCart = function (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    alert(`${p.name} added to cart!`);
    if (modal) modal.style.display = "none";
  };

  // modal close handlers
  if (closeModal) closeModal.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
  window.addEventListener('click', (e) => { if (e.target === modal) { if (modal) modal.style.display = 'none'; } });

})();
