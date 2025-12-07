import { Video } from "../models/videomodal.js";

export async function Addview(req, res) {
  try {
    const { userId, videoId } = req.query;

    const updated = await Video.updateOne(
      { _id: videoId },
      { $addToSet: { views: userId } } 
    );

    if (updated.modifiedCount === 0) {
      return res.status(200).json({ message: "Already viewed" });
    }

    return res.status(200).json({ message: "View added" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
