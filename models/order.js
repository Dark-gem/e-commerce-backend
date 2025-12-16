import mongoose, { model, Schema } from "mongoose";
const orderschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: Array,
  totalamount: Number,
  status: {
    type: String,
    default: "pending",
  },
});
export const Order = mongoose.model("order", orderschema);
