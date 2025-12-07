import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true, // one channel per user
  },
  name: {
    type: String,
    required: true, // channel name
  },
  description: {
    type: String,
    default: "", // optional description
  },
  handle: {
    type: String,
    default: "", // optional banner image
  },
  profilePictureUrl: {
    type: String,
    default: "", // optional channel profile picture
  },
  email : {
    type : String,
    default : "",
    unique :true,
    required  :true
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    default: 0,
    ref : "User",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      default : 0 // if you have a Video collection
    },
  ],
});

const Channel = mongoose.models.Channel || mongoose.model("Channel", channelSchema);

export default Channel;


