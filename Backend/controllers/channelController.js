import Channel from "../models/channelModal.js";

export async function getChannel(req, res) {
    const {googleId} =  req.body;
    const channel = await Channel.findOne({googleId: googleId}).populate("videos");
    if(!channel){
        return res.json({message : "channel not found"});
    }
        res.json(channel);
}


export async function createchannel(req, res){
    const {googleId , name , handle , description , picture, email} = req.body;
    const getch = await Channel.find({googleId});
    if(getch.length>0){
        return res.json({message : "channel already exists by this user"});
    }
    const channel = await Channel.create(
        {googleId : googleId,
         name : name,
         description : description,
         handle : handle,
         email : email,
         profilePictureUrl : picture
        })
    if(!channel){
        return res.json({message : "failed to create channel, Try again!"})
    }
    res.json({channel});

}