import express from "express";
import { getLoggedInUser } from "../controllers/userController.js";
import { authmiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/getLoggedInUser", authmiddleware, getLoggedInUser);

export default router;
