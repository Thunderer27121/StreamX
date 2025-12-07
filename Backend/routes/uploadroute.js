import express from "express";
import multer from "multer";
import cloudinary from "../db/cloudinary.js";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "upload/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "streamx_videos",
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.log("error in deleting the temp video file", err);
    });

    res.json({
      success: true,
      response: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// ✅ Delete from Cloudinary
router.delete("/delete", async (req, res) => {
  try {
    const { publicId } = req.body; // axios.delete(..., { data: { publicId } })

    if (!publicId) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    if (result.result !== "ok") {
      return res
        .status(500)
        .json({ success: false, message: "Cloudinary deletion failed", result });
    }

    return res.status(200).json({
      success: true,
      message: "Video deleted from Cloudinary",
      result,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting from Cloudinary",
      error: error.message,
    });
  }
});

export default router;
