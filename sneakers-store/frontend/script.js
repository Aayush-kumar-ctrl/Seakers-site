// script.js
// Robust Clerk loader (will inject SDK if missing) + product grid + modal + add-to-cart
// Replace your script.js with this file. Keep index.html and style.css unchanged.
// Serve over http://localhost:PORT (not file://). If Clerk still fails, check DevTools Console.

(async function () {
  const PUBLISHABLE_KEY = "pk_test_Y3Jpc3Ata29pLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";
  const CLERK_CDN = "https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js";

  // Utility: sleep
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Utility: inject clerk script if not present
  async function ensureClerkScript() {
    if (window.Clerk) return true;
    // Avoid duplicates
    if (document.querySelector(`script[data-clerk-injected="true"]`)) {
      // script already injected, wait for it
    } else {
      const s = document.createElement("script");
      s.src = CLERK_CDN;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.setAttribute("data-clerk-publishable-key", PUBLISHABLE_KEY);
      s.setAttribute("data-clerk-injected", "true");
      document.head.appendChild(s);
    }

    // wait up to timeout for window.Clerk to appear
    const start = Date.now();
    const timeout = 9000;
    while (!window.Clerk && Date.now() - start < timeout) {
      await sleep(50);
    }
    return !!window.Clerk;
  }

  // Ensure Clerk available and initialized
  async function initClerk() {
    try {
      const present = await ensureClerkScript();
      if (!present) throw new Error("Clerk SDK not found after injection.");

      // Some builds expose Clerk as default; ensure we have functions
      if (typeof Clerk.load === "function") {
        await Clerk.load({ publishableKey: PUBLISHABLE_KEY }).catch((e) => {
          // non-fatal fallback: log and continue
          console.warn("Clerk.load rejected:", e);
        });
      }

      // Wait until openSignIn/openSignUp available (short poll)
      const start = Date.now();
      const timeout = 7000;
      while ((typeof Clerk.openSignIn !== "function" || typeof Clerk.openSignUp !== "function") && Date.now() - start < timeout) {
        await sleep(50);
      }

      if (typeof Clerk.openSignIn !== "function" || typeof Clerk.openSignUp !== "function") {
        console.warn("Clerk loaded but openSignIn/openSignUp unavailable. Clerk object:", Clerk);
        // still attach defensive handlers that will try later
      }

      attachClerkHandlers();
      console.info("Clerk initialization attempted.");
    } catch (err) {
      console.error("Clerk initialization error:", err);
      // don't block app; product grid will still render
    }
  }

  // Attach handlers (safe to call multiple times)
  function attachClerkHandlers() {
    const signInBtn = document.getElementById("sign-in-btn");
    const signUpBtn = document.getElementById("sign-up-btn");

    if (signInBtn) {
      signInBtn.replaceWith(signInBtn.cloneNode(true)); // remove previous listeners
    }
    if (signUpBtn) {
      signUpBtn.replaceWith(signUpBtn.cloneNode(true));
    }

    const sIn = document.getElementById("sign-in-btn");
    const sUp = document.getElementById("sign-up-btn");

    if (sIn) {
      sIn.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.Clerk && typeof Clerk.openSignIn === "function") {
          try { Clerk.openSignIn({ appearance: { layout: "modal" } }); }
          catch (err) { console.error("Clerk.openSignIn threw:", err); alert("Failed to open Sign In (see console)."); }
        } else {
          console.warn("Clerk not ready for openSignIn:", window.Clerk);
          alert("Sign In not ready yet. Try again in a moment.");
        }
      });
    }

    if (sUp) {
      sUp.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.Clerk && typeof Clerk.openSignUp === "function") {
          try { Clerk.openSignUp({ appearance: { layout: "modal" } }); }
          catch (err) { console.error("Clerk.openSignUp threw:", err); alert("Failed to open Sign Up (see console)."); }
        } else {
          console.warn("Clerk not ready for openSignUp:", window.Clerk);
          alert("Sign Up not ready yet. Try again in a moment.");
        }
      });
    }
  }

  // Start Clerk init but don't await forever (so page renders promptly)
  initClerk();

  // ----------------- products / modal / add-to-cart (unchanged) -----------------
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

    // attach click handlers
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id'), 10);
        openProduct(id);
      });
    });
  } else {
    console.warn("product-grid not found");
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
    if (modal) modal.style.display = "flex";

    const addBtn = document.getElementById('modal-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addToCart(p.id);
      });
    }
  };

  window.addToCart = function (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    alert(`${p.name} added to cart!`);
    if (modal) modal.style.display = "none";
  };

  if (closeModal) closeModal.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
  window.addEventListener('click', (e) => { if (e.target === modal) { if (modal) modal.style.display = 'none'; } });

})();
