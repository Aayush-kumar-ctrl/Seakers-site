import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST new product
router.post("/", async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const product = new Product({ name, price, image });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid Product Data" });
  }
});

export default router;
