import express from "express";
import {
  addtocart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import { authmiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/addtocart", authmiddleware, addtocart);
router.get("/", authmiddleware, getUserCart);
router.put("/updateCart", authmiddleware, updateCart);
export default router;
