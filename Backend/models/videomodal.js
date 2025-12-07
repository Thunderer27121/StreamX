import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true, // Cloudinary video URL
    },
    publicId: {
      type: String,
      required: true, // Cloudinary public_id for deletion later
    },
    duration: {
      type: String, // in seconds (you can get from Cloudinary response)
    },
    views: [{
      type: mongoose.Schema.Types.ObjectId,
      default: 0,
      ref  : "User"
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref  : "User",
      default: 0,
    }],
    dislikes : [{
      type : mongoose.Schema.Types.ObjectId,
      default : 0,
      ref : "User"
    }],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel", 
      required: true,
    },
    thumbnail: {
      type: String,
      required: true, 
    },
    category: {
      type: String,
      enum: ["Entertainment", "Education", "Music", "Gaming", "Sports", "News", "Others"],
      default: "Others",
    },
    comments : [
      {
        type : mongoose.Schema.Types.ObjectId,  
      }
    ]
  },
  { timestamps: true }
);

export const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
