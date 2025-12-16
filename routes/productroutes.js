import express from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  updateProduct,
  searchProduct,
} from "../controllers/productcontroller.js";

const router = express.Router();

router.post("/addproduct", addProduct);
router.post("/getproduct/:id", getProductById);
router.delete("/deleteproduct/:id", deleteProduct);
router.put("/updateProduct/:id", updateProduct);
router.get("/search", searchProduct);

export default router;
