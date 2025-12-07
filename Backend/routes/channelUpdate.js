import express from "express";
import multer from "multer";
import { updateChannel } from "../controllers/channelUpdateController.js";
import { deleteChannel } from "../controllers/deleteChannelController.js";

const router = express.Router();


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.put("/:id", upload.single("profilePicture"), updateChannel);
router.delete("/delete/:channelId",  deleteChannel);

export default router;
