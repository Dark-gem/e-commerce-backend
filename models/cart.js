import mongoose from "mongoose";
const cartschema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: Number,
    },
  ],
});
export const Cart = mongoose.model("Cart", cartschema);
