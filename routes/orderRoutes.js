import express from "express";
import { newOrder } from "../controllers/orderController.js";
import { getMyOrders } from "../controllers/orderController.js";
import { getOrderById } from "../controllers/orderController.js";
import { getAllOrders } from "../controllers/orderController.js";
import { cancelOrder } from "../controllers/orderController.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import { authmiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/newOrder", authmiddleware, newOrder);
router.get("/getMyOrders", authmiddleware, getMyOrders);
router.get("/getOrderById", authmiddleware, getOrderById);
router.get("/getAllOrders", authmiddleware, adminOnly, getAllOrders);
router.put("/cancleOrder", authmiddleware, cancelOrder);
export default router;
