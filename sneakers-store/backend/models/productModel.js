import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: "Stylish sneaker for modern comfort"
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
