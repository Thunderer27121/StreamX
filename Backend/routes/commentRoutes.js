import express from "express";
import {
  addComment,
  getCommentsByVideo,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();


router.post("/add", addComment);

router.get("/:videoId", getCommentsByVideo);

router.delete("/:id/:userId/:channelId", deleteComment);

export default router;
