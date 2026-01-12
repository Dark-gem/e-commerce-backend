import mongoose from "mongoose";
const futsalschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    priceperHour: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export const FutsalCourt = mongoose.model("FutsalCourt", futsalschema);
