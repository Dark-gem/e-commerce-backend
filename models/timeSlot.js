import mongoose from "mongoose";
const timeSlotschema = new mongoose.Schema(
  {
    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FutsalCourt",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "closed"],
      default: "available",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },
  },
  { timestamps: true }
);
export const TimeSlot = mongoose.model("TimeSlot", timeSlotschema);
