import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "20m",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user_.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "user created suceddfully", User });
  } catch (error) {}
};
