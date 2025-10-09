const form = document.getElementById("productForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    name: document.getElementById("name").value,
    price: Number(document.getElementById("price").value),
    image: document.getElementById("image").value,
    description: document.getElementById("description").value
  };

  try {
    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });

    if (response.ok) {
      status.textContent = "✅ Product added successfully!";
      form.reset();
    } else {
      status.textContent = "❌ Failed to add product!";
    }
  } catch (error) {
    console.error(error);
    status.textContent = "❌ Error occurred!";
  }
});
