// script.js - robust Clerk init + product grid + modal + add-to-cart
// Replace your current script.js with this file. Keep index.html and style.css as-is.
// Serve over http://localhost:PORT (not file://). Ensure your Clerk script tag uses the browser bundle:
// <script data-clerk-publishable-key="pk_test_..." src="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js" async crossorigin="anonymous"></script>

(function () {
  const PUBLISHABLE_KEY = "pk_test_Y3Jpc3Ata29pLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";

  // --- Utility: wait for a global to exist (poll) ---
  function waitForGlobal(name, timeout = 7000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      (function poll() {
        if (window[name]) return resolve(window[name]);
        if (Date.now() - start > timeout) return reject(new Error(`${name} not found after ${timeout}ms`));
        setTimeout(poll, 50);
      })();
    });
  }

  // --- Initialize Clerk safely and attach handlers ---
  async function initClerk() {
    try {
      console.log("[init] waiting for Clerk script to load...");
      await waitForGlobal("Clerk", 8000);
      console.log("[init] Clerk global found:", !!window.Clerk);

      // load with explicit publishable key (safe even if data attribute exists)
      if (typeof Clerk.load === "function") {
        console.log("[init] calling Clerk.load(...)");
        await Clerk.load({ publishableKey: PUBLISHABLE_KEY });
      } else {
        console.warn("[init] Clerk.load is not a function — continuing without explicit load()");
      }

      // verify functions exist
      if (typeof Clerk.openSignIn !== "function" || typeof Clerk.openSignUp !== "function") {
        console.warn("[init] Clerk.openSignIn/openSignUp not available yet. Listing Clerk object:", Clerk);
      }

      const sIn = document.getElementById("sign-in-btn");
      const sUp = document.getElementById("sign-up-btn");

      if (sIn) {
        // remove previous listeners (defensive)
        sIn.replaceWith(sIn.cloneNode(true));
      }
      if (sUp) {
        sUp.replaceWith(sUp.cloneNode(true));
      }

      // re-query after replacement
      const signInBtn = document.getElementById("sign-in-btn");
      const signUpBtn = document.getElementById("sign-up-btn");

      if (signInBtn) {
        signInBtn.addEventListener("click", (e) => {
          e.preventDefault();
          try {
            if (typeof Clerk.openSignIn === "function") {
              Clerk.openSignIn({ appearance: { layout: "modal" } });
            } else {
              alert("Clerk is not ready (openSignIn unavailable). See console for details.");
              console.error("openSignIn not a function — Clerk object:", Clerk);
            }
          } catch (err) {
            console.error("Error calling Clerk.openSignIn()", err);
            alert("Failed to open Sign In. See console for details.");
          }
        });
      } else {
        console.warn("sign-in-btn not found in DOM");
      }

      if (signUpBtn) {
        signUpBtn.addEventListener("click", (e) => {
          e.preventDefault();
          try {
            if (typeof Clerk.openSignUp === "function") {
              Clerk.openSignUp({ appearance: { layout: "modal" } });
            } else {
              alert("Clerk is not ready (openSignUp unavailable). See console for details.");
              console.error("openSignUp not a function — Clerk object:", Clerk);
            }
          } catch (err) {
            console.error("Error calling Clerk.openSignUp()", err);
            alert("Failed to open Sign Up. See console for details.");
          }
        });
      } else {
        console.warn("sign-up-btn not found in DOM");
      }

      console.log("[init] Clerk handlers attached successfully");
    } catch (err) {
      console.error("[init] Clerk initialization failed:", err);
      // show concise user-visible hint
      try {
        // eslint-disable-next-line no-alert
        alert("Clerk failed to initialize. Open DevTools console for details.");
      } catch (e) {}
    }
  } // initClerk()

  // --- Products/modal/add-to-cart (unchanged behavior you had) ---
  const products = [
    {
      id: 1,
      name: "Classic Denim Jacket",
      price: 2499,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      description: "A timeless denim jacket with a vintage look. Perfect for any season.",
      reviews: "⭐ 4.7 (143 Reviews)",
    },
    {
      id: 2,
      name: "Retro Sneakers",
      price: 3499,
      image: "https://images.unsplash.com/photo-1595950657874-58d3b3b46c92",
      description: "Step back in time with our retro-style sneakers — comfort meets style.",
      reviews: "⭐ 4.8 (321 Reviews)",
    },
    {
      id: 3,
      name: "Vintage Graphic Tee",
      price: 1299,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format",
      description: "Soft cotton tee featuring old-school print for a nostalgic vibe.",
      reviews: "⭐ 4.6 (89 Reviews)",
    },
    {
      id: 4,
      name: "Old Skool Cap",
      price: 899,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format",
      description: "Keep it cool with this retro cap that never goes out of fashion.",
      reviews: "⭐ 4.5 (67 Reviews)",
    },
  ];

  const grid = document.getElementById("product-grid");
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.getElementById("close-modal");

  if (grid) {
    grid.innerHTML = products
      .map(
        (p) => `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
        </div>
      </div>
    `
      )
      .join("");

    // attach click handlers (non-inline)
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = parseInt(card.getAttribute("data-id"), 10);
        openProduct(id);
      });
    });
  } else {
    console.warn("product-grid element not found");
  }

  window.openProduct = function (id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    modalContent.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h2>${p.name}</h2>
      <p>${p.description}</p>
      <p><strong>${p.reviews}</strong></p>
      <p style="font-size:1.2rem;font-weight:bold;">₹${p.price}</p>
      <button id="modal-add-btn">Add to Cart</button>
    `;
    if (modal) modal.style.display = "flex";

    const addBtn = document.getElementById("modal-add-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        addToCart(p.id);
      });
    }
  };

  window.addToCart = function (id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    alert(`${p.name} added to cart!`);
    if (modal) modal.style.display = "none";
  };

  if (closeModal) closeModal.addEventListener("click", () => { if (modal) modal.style.display = "none"; });
  window.addEventListener("click", (e) => { if (e.target === modal) { if (modal) modal.style.display = "none"; } });

  // --- run Clerk initialization after DOM ready ---
  // small delay before init helps when script tag is async; but waitForGlobal handles polling
  setTimeout(() => initClerk(), 50);
})();
