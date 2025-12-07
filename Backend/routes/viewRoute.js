import express from "express";
import  {Addview}  from "../controllers/viewController.js";
const router = express.Router();

router.get("/", Addview);

export default router;