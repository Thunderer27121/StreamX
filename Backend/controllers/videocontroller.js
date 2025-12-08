import Channel from "../models/channelModal.js";
import { Video } from "../models/videomodal.js";
import cloudinary from "../db/cloudinary.js";
import { Comments } from "../models/commentModal.js";


function getCloudinaryPublicIdFromUrl(url) {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let afterUpload = parts[1].split(/[?#]/)[0];

    const segments = afterUpload.split("/");
    const versionIndex = segments.findIndex(seg => /^v[0-9]+$/.test(seg));
    let publicPath;

    if (versionIndex !== -1) {
      publicPath = segments.slice(versionIndex + 1).join("/");
    } else {
      publicPath = afterUpload;
    }

    publicPath = publicPath.replace(/\.[^/.]+$/, "");

    return publicPath || null;
  } catch (err) {
    console.error("Error extracting Cloudinary public_id:", err);
    return null;
  }
}

export async function uploadVideo(req, res) {
  const { title, description, videoUrl, publicId, duration, uploadedBy, category } = req.body;
  try {
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const channelres = await Channel.findOne({ _id: uploadedBy });
    if (!channelres) {
      return res.status(404).json({ message: "there is no channel for such id" });
    }
    const exist_video = await Video.findOne({ title, publicId });
    if (exist_video) {
      return res.status(409).json({ message: "A video already exists by this title" });
    }
    const thumbnail = videoUrl
      .replace("/upload/", "/upload/so_1,w_400,h_250/")
      .replace(".mp4", ".jpg");
    const video = await Video.create({ title, description, videoUrl, thumbnail, publicId, duration, uploadedBy, category });
    if (video) {
      await Channel.findByIdAndUpdate(uploadedBy, {
        $push: { videos: video._id }
      });
      return res.status(201).json({
        message: "video added successfully",
        data: video
      })
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error while uploading the video" });
  }
}


export async function getAllVideos(req, res){
  const videos = await Video.find({}).populate("uploadedBy");
  if(videos.length == 0){
    return res.status(404).json("No Videos Available");
  }
  return res.status(201).json({message : "Got videos succesfully", videos});
}


export async function singlevideo(req, res) {
  try {
    const  publicId = req.query.publicId;
    console.log(publicId);
    const video = await Video.findOne({publicId}).populate("uploadedBy");
    console.log(video);
    if(!video){
      return res.status(404).json({message : "video not found"});
    }
    res.json(video);
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Failed to fetch video" });
  }
}
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    console.log(video.publicId)
    if (video.publicId) {
      await cloudinary.uploader.destroy(video.publicId, {
        resource_type: "video",
      });
    }

    await Comments.deleteMany({ video: video._id });

    await video.deleteOne();

    return res.json({ message: "Video and its comments deleted successfully" });
  } catch (err) {
    console.error("Error deleting video:", err);
    return res.status(500).json({ message: "Server error while deleting video" });
  }
};
