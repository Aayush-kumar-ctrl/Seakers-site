import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🛍️ Sneakers Store API is running successfully...");
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
