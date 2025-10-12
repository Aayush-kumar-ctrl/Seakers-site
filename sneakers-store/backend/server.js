import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
