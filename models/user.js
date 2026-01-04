import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";
const userschema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next;
});
userschema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};
export const User = model("User", userschema);
