import { Comments } from "../models/commentModal.js";
import { Video } from "../models/videomodal.js"; 


export const addComment = async (req, res) => {
  try {
    const {
      video,        
      user,         
      content,      
      user_avatar,
      user_name,
      time,
    } = req.body;

    if (!video || !user || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const created = await Comments.create({
      video,
      user,
      content,
      user_avatar,
      user_name,
      time,
    });
    if(created){
      const commentvideo = await Video.findById(video);
      commentvideo.comments.push(created.id);
      await commentvideo.save();
    }
    return res.status(201).json({
      message: "Comment added successfully",
      comment: created,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    return res.status(500).json({
      message: "Internal server error while adding comment",
    });
  }
};

export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({ message: "videoId is required" });
    }

    const comments = await Comments.find({ video: videoId }).sort({
      createdAt: -1,
    }).populate("user");

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res.status(500).json({
      message: "Internal server error while fetching comments",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, userId, channelId } = req.params;

    if (!userId && !channelId) {
      return res.status(400).json({ message: "userId or channelId required" });
    }
    const comment = await Comments.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const video = await Video.findById(comment.video).select("uploadedBy");
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    let isCommentOwner = false;
    let isVideoOwner = false;

    if (userId) {
      isCommentOwner = comment.user.toString() === userId.toString();
    }

    if (channelId) {
      isVideoOwner = video.uploadedBy.toString() === channelId.toString();
    }

    if (!isCommentOwner && !isVideoOwner) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this comment" });
    }

    await Comments.findByIdAndDelete(id);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res.status(500).json({
      message: "Internal server error while deleting comment",
    });
  }
};