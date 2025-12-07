import express from "express";
import  {uploadVideo, getAllVideos, singlevideo, deleteVideo}  from "../controllers/videocontroller.js";

const router = express.Router();

router.post("/videoUpload", uploadVideo);
router.get("/getall", getAllVideos);
router.get("/", singlevideo);
router.delete("/videodelete/:id", deleteVideo);

export default router;