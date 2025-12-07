import Channel from "../models/channelModal.js";
import cloudinary from "../db/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

export const updateChannel = async (req, res) => {
  try {
    const channelId = req.params.id;
    const { name, handle, description } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (name) channel.name = name;
    if (handle) channel.handle = handle;
    if (description !== undefined) channel.description = description;
    if (req.file) {
      const folder = `streamx/channel-profiles/${channelId}`;
      await cloudinary.api.delete_resources_by_prefix(folder);

      const result = await uploadToCloudinary(req.file.buffer, folder);
      channel.profilePictureUrl = result.secure_url;
    }

    await channel.save();

    const updated = await Channel.findById(channelId)
      .populate("videos")
      .populate("subscribers");

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
