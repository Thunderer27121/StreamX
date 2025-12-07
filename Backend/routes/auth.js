import express from "express";
import { loggin,getpfp } from "../controllers/authController.js";

const router = express.Router();

// Google Login Route
router.post("/login", loggin);
router.get("/profile-pfp/:id", getpfp);

export default router;