import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 15);
  next();
});
userschema.methods.comparepassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};
export const User = mongoose.model("User", userschema);
