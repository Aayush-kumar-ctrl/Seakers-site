import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  clerkId: { type: String, required: true }, // link to Clerk user
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
