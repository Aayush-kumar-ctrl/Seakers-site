// script.js — Clean, Efficient, and Robust
// Handles Clerk authentication + Product grid + Modal + Add to Cart

(async function () {
  const PUBLISHABLE_KEY = "pk_test_Y3Jpc3Ata29pLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";
  const CLERK_CDN = "https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js";

  // Sleep helper
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Inject Clerk SDK if missing
  async function loadClerk() {
    if (window.Clerk) return true;

    if (!document.querySelector("script[data-clerk-injected]")) {
      const script = document.createElement("script");
      script.src = CLERK_CDN;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.setAttribute("data-clerk-publishable-key", PUBLISHABLE_KEY);
      script.setAttribute("data-clerk-injected", "true");
      document.head.appendChild(script);
    }

    const start = Date.now(), timeout = 9000;
    while (!window.Clerk && Date.now() - start < timeout) await sleep(50);
    return !!window.Clerk;
  }

  // Initialize Clerk (only once)
  async function initClerk() {
    try {
      const ready = await loadClerk();
      if (!ready) throw new Error("Clerk SDK failed to load.");

      // Load the Clerk client
      if (typeof Clerk.load === "function") {
        await Clerk.load({ publishableKey: PUBLISHABLE_KEY });
      }

      // Wait for modal functions to exist
      const start = Date.now(), timeout = 7000;
      while (
        (!Clerk.openSignIn || !Clerk.openSignUp) &&
        Date.now() - start < timeout
      ) await sleep(50);

      attachAuthButtons();
      console.info("✅ Clerk initialized successfully");
    } catch (err) {
      console.error("❌ Clerk initialization error:", err);
    }
  }

  // Generic safe handler for Clerk actions
  function handleClerkAction(action, label) {
    if (window.Clerk && typeof action === "function") {
      try {
        action({ appearance: { layout: "modal" } });
      } catch (err) {
        console.error(`${label} error:`, err);
        alert(`${label} failed (see console).`);
      }
    } else {
      alert(`${label} not ready yet. Please try again.`);
    }
  }

  // Attach button handlers
  function attachAuthButtons() {
    const map = [
      ["sign-in-btn", () => handleClerkAction(Clerk.openSignIn, "Sign In")],
      ["sign-up-btn", () => handleClerkAction(Clerk.openSignUp, "Sign Up")],
    ];

    for (const [id, handler] of map) {
      const btn = document.getElementById(id);
      if (!btn) continue;
      const clone = btn.cloneNode(true); // remove old listeners
      btn.replaceWith(clone);
      clone.addEventListener("click", (e) => {
        e.preventDefault();
        handler();
      });
    }
  }

  // Start Clerk initialization (don’t block rest of UI)
  initClerk();

  // ----------------- Product Grid + Modal + Cart -----------------
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

  // Render product grid
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

    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => openProduct(+card.dataset.id));
    });
  }

  // Modal logic
  function openProduct(id) {
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

    document.getElementById("modal-add-btn").onclick = () => {
      alert(`${p.name} added to cart!`);
      modal.style.display = "none";
    };
  }

  // Modal close behavior
  closeModal?.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
})();
