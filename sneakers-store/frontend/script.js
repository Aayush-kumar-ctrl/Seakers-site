// Fetch products from backend API
const productsContainer = document.querySelector(".products");

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5000/api/products");
    const products = await response.json();

    productsContainer.innerHTML = ""; // Clear old hardcoded products

    products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">₹${product.price.toLocaleString()}</p>
      `;

      productsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
  }
}

// Run function when page loads
fetchProducts();
