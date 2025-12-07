import Channel from "../models/channelModal.js";

export async function addsub(req, res) {
  try {
    const { userid, channelid } = req.body;
    console.log(channelid, userid);
    const channel = await Channel.findById(channelid);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const alreadySub = channel.subscribers.find(
      (id) => id.toString() === userid
    );

    if (alreadySub) {
      return res.json({ message: "You are already a subscriber" });
    }

    channel.subscribers.push(userid);

    await channel.save();

    res.status(200).json({
      message: "sub added",
    });

  } catch (error) {
    console.error("Error adding subscriber:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function removesub(req, res){
    const {userid, channelid} = req.body;
    const channel = await Channel.findById(channelid);
    if(!channel){
        return res.status(404).json({message : "channel not found"});
    }
    const subscriber = await channel.subscribers.find((id)=>id.toString() === userid);
    if(!subscriber){
        return res.status(400).json({message : "you are not a subscriber"});
    }
    channel.subscribers = await channel.subscribers.filter((id)=> id.toString() !== userid);
    await channel.save();
    return res.status(200).json({message : "sub removed"});
}