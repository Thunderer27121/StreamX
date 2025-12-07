import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true, index: true }, // fast lookup
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },    // enforce uniqueness
  picture: { type: String },
  createdAt: { type: Date, default: Date.now, index: true },             // useful for sorting by recent users
});


export const User = mongoose.models.User || mongoose.model("User", userSchema);

