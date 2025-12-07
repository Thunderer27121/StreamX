// controllers/channelController.js
import cloudinary from "../db/cloudinary.js";
import Channel from "../models/channelModal.js";
import Video from "../models/videomodal.js";

export const deleteChannel = async (req, res) => {
  const { channelId } = req.params;

  try {
    const channel = await Channel.findById(channelId).populate("videos"); 

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videos = channel.videos || [];

    await Promise.all(
      videos.map(async (video) => {
        if (!video.publicId) return;

        try {
          await cloudinary.uploader.destroy(video.publicId, {
            resource_type: "video", 
          });
        } catch (err) {
          console.error(
            `Cloudinary delete failed for video ${video._id}:`,
            err.message
          );
        }
      })
    );

    if (videos.length > 0) {
      const videoIds = videos.map((v) => v._id);
      await Video.deleteMany({ _id: { $in: videoIds } });
    }
    await Channel.findByIdAndDelete(channelId);

    return res.status(200).json({
      message: "Channel and all related videos deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting channel:", error);
    return res
      .status(500)
      .json({ message: "Error deleting channel", error: error.message });
  }
};
