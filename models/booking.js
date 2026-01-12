import mongoose from "mongoose";

const bookingschema = new mongoose.Schema(
  {
    userID: {
      type: String,
      ref: "User",
      required: true,
    },
    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FutsalCOurt",
      required: true,
    },
    timeSlotID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TimeSlot",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalprice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "closed"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);
export const Booking = mongoose.model("Booking", bookingschema);
