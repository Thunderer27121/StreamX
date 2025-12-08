
import cloudinary from "../db/cloudinary.js";
import Channel from "../models/channelModal.js";
import { Video } from "../models/videomodal.js";

function isGoogleAvatar(url) {
  if (!url) return false;
  return url.includes("googleusercontent.com");
}

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

    return publicPath.replace(/\.[^/.]+$/, "");
  } catch (err) {
    console.error("Error extracting public_id:", err);
    return null;
  }
}

export const deleteChannel = async (req, res) => {
  const { channelId } = req.params;

  try {
    const channel = await Channel.findById(channelId).populate("videos");
    console.log(channel);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.profilePictureUrl && !isGoogleAvatar(channel.profilePictureUrl)) {
      try {
        const avatarPublicId = getCloudinaryPublicIdFromUrl(channel.profilePictureUrl);
        if (avatarPublicId) {
          await cloudinary.uploader.destroy(avatarPublicId);
        }
      } catch (err) {
        console.error(
          `Cloudinary delete failed for channel avatar ${channel._id}:`,
          err.message
        );
      }
    }

    const videos = channel.videos || [];
    console.log(videos);

    await Promise.all(
      videos.map(async (video) => {
        if (video.publicId) {
          try {
            await cloudinary.uploader.destroy(video.publicId, {
              resource_type: "video",
            });
          } catch (err) {
            console.error(
              `Cloudinary delete failed for video file ${video._id}:`,
              err.message
            );
          }
        }

        if (video.thumbnail) {
          try {
            const thumbPublicId = getCloudinaryPublicIdFromUrl(video.thumbnail);
            if (thumbPublicId) {
              await cloudinary.uploader.destroy(thumbPublicId);
            }
          } catch (err) {
            console.error(
              `Cloudinary delete failed for thumbnail of video ${video._id}:`,
              err.message
            );
          }
        }
      })
    );

    if (videos.length > 0) {
      const videoIds = videos.map((v) => v._id);

      await Comment.deleteMany({ video: { $in: videoIds } });

      await Video.deleteMany({ _id: { $in: videoIds } });
    }

    await Channel.findByIdAndDelete(channelId);

    return res.status(200).json({
      message:
        "Channel, its profile picture, videos, thumbnails and comments deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting channel:", error);
    return res
      .status(500)
      .json({ message: "Error deleting channel", error: error.message });
  }
};