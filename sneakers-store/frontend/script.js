// script.js - Clerk init (robust) + existing product/modal/cart behavior preserved

(async function () {
  // --- Robust Clerk loader ---------------------------------------
  const PUBLISHABLE_KEY = "pk_test_Y3Jpc3Ata29pLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";

  // Wait for the Clerk script to appear on window (max ~5s)
  async function waitForClerk(timeout = 5000) {
    const start = Date.now();
    while (!window.Clerk) {
      if (Date.now() - start > timeout) return null;
      await new Promise((r) => setTimeout(r, 50));
    }
    return window.Clerk;
  }

  try {
    const ClerkLib = await waitForClerk(7000);
    if (!ClerkLib) throw new Error("Clerk script not found on window. Check script tag and network.");

    // Ensure Clerk is loaded with the publishable key (safe even if data attr exists)
    await Clerk.load({ publishableKey: PUBLISHABLE_KEY });

    // Attach button handlers after Clerk is ready
    const signInBtn = document.getElementById("sign-in-btn");
    const signUpBtn = document.getElementById("sign-up-btn");

    if (signInBtn) signInBtn.addEventListener("click", () => Clerk.openSignIn({ appearance: { layout: "modal" } }));
    if (signUpBtn) signUpBtn.addEventListener("click", () => Clerk.openSignUp({ appearance: { layout: "modal" } }));

    // Optional: log current user to console (helps debug)
    try {
      if (Clerk.user) {
        console.log("Clerk user loaded:", Clerk.user);
      } else {
        // subscribe to auth changes if you want to react later
        if (Clerk.on) {
          Clerk.on("user", (u) => console.log("Clerk user changed:", u));
        }
      }
    } catch (e) {
      // non-fatal
      console.warn("Clerk user check failed:", e);
    }

    console.log("✅ Clerk initialized successfully");
  } catch (err) {
    console.error("❌ Clerk initialization error:", err);
    // keep going: products/modal will still work
  }

  // ----------------------------------------------------------------
  // --- Existing product / modal / add-to-cart logic (unchanged) ---
  // Products data (same as you had)
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

  // DOM refs
  const grid = document.getElementById("product-grid");
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.getElementById("close-modal");

  // Render products
  if (grid) {
    grid.innerHTML = products.map(p => `
      <div class="product-card" onclick="openProduct(${p.id})">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
        </div>
      </div>
    `).join('');
  }

  // Modal handling (expose globally as before)
  window.openProduct = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    modalContent.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h2>${p.name}</h2>
      <p>${p.description}</p>
      <p><strong>${p.reviews}</strong></p>
      <p style="font-size:1.2rem;font-weight:bold;">₹${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    if (modal) modal.style.display = "flex";
  }

  window.addToCart = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    alert(`${p.name} added to cart!`);
    if (modal) modal.style.display = "none";
  }

  if (closeModal) closeModal.onclick = () => { if (modal) modal.style.display = "none"; };
  window.onclick = e => { if (e.target == modal) { if (modal) modal.style.display = "none"; } };

  // ----------------------------------------------------------------
  // end of script
})();
