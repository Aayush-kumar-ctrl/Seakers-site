import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Product from "./models/Product.js";
import Cart from "./models/Cart.js";

import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Old Skool Sneakers API is running");
});

// 🔐 Protected route example
app.get("/api/profile", ClerkExpressRequireAuth(), (req, res) => {
  res.json({
    message: "Welcome to your profile!",
    userId: req.auth.userId,
  });
});

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST a product (optional, for adding products)
app.post("/api/products", async (req, res) => {
  try {
    const { name, image, price, description } = req.body;
    const product = await Product.create({ name, image, price, description });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Add item to cart
app.post("/api/cart", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { productId, name, price, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ clerkId });
    if (!cart) {
      cart = await Cart.create({ clerkId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// Get user cart
app.get("/api/cart", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const cart = await Cart.findOne({ clerkId });
    res.json(cart || { items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
