// models/commentModel.js
import mongoose from "mongoose";

const commentschema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    user_avatar: {
      type: String,
      required: true,
    },

    user_name: {
      type: String,
      required: true,
      trim: true,
    },

    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comments =
  mongoose.models.Comment || mongoose.model("Comment", commentschema);
