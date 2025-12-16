import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const generateacesstoken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
const genteraterefreshtoken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    res.json({ message: "User registered sucessfully", user });
    // console.log("Body", req.body);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid Email or Password" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "INvalid Email or Password" });
    const accesstoken = generateacesstoken(user._id);
    const refreshtoken = genteraterefreshtoken(user._id);

    // res.token("acesstoken", accesstoken, {
    //   http: true,
    //   secure: false,
    //   samesite: "none",
    //   maxAge: 7 * 60 * 1000,
    // });

    // res.token("refreshtoken", refreshtoken, {
    //   http: true,
    //   secure: false,
    //   samesite: "none",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.json({ message: "login sucessfully", accesstoken, refreshtoken });
  } catch (error) {
    console.log(error);
  }
};
