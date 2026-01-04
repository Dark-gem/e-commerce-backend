import express from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  updateProduct,
  searchProduct,
  getAllProducts,
} from "../controllers/productcontroller.js";
import { authmiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/addproduct", authmiddleware, adminOnly, addProduct);
router.get("/getproduct/:id", getProductById);
router.delete("/deleteproduct/:id", authmiddleware, adminOnly, deleteProduct);
router.put("/updateProduct/:id", authmiddleware, adminOnly, updateProduct);
router.get("/search", searchProduct);
router.get("/", getAllProducts);

export default router;
