import Channel from "../models/channelModal.js";
import { Video } from "../models/videomodal.js";


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
export async function deleteVideo(req, res) {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await Channel.findByIdAndUpdate(video.uploadedBy, {
      $pull: { videos: video._id },
    });

    await Video.findByIdAndDelete(id);

    return res.status(200).json({ message: "Video deleted from database" });
  } catch (err) {
    console.error("DB delete error:", err);
    return res
      .status(500)
      .json({ message: "Database error while deleting video" });
  }
}

