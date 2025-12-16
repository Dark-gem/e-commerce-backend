import express from "express";
import authRoutes from "./authRoutes.js";
import productroutes from "./productroutes.js";
import userRoutes from "./userroutes.js";
import cartRoutes from "./cart.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/product", productroutes);
router.use("/user", userRoutes);
router.use("/cart", cartRoutes);
export default router;
