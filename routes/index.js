import express from "express";
import authRoutes from "./authRoutes.js";
import productroutes from "./productRoutes.js";
import userRoutes from "./userRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderROutes from "./orderRoutes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/product", productroutes);
router.use("/user", userRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderROutes);
export default router;
