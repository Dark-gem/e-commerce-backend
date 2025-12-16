import { User } from "../models/user.js";
export const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const user = await User.findById({ _id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: " User details are:", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
