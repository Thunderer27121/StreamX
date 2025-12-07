import express from "express";
import { disliked, dislikeremoved, liked, likeremoved } from "../controllers/likeController.js";

const router  = express.Router();

router.get("/liked",liked);
router.get("/unliked",likeremoved);
router.get("/disliked",disliked);
router.get("/dislikeremoved",dislikeremoved);

export default router;
