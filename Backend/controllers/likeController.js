import { Video } from "../models/videomodal.js";

export async function liked(req, res){
  try {
    const {userId , videoId} = req.query;
    const video = await Video.findOne({publicId: videoId});
    if(!video){
        return res.status(404).json({message: "video not found"});
    }
    const likeuser = await video.likes.find((id)=>id.toString() === userId);
    if(likeuser){
        return res.status(200).json({message : "already liked"}); 
    }
    video.dislikes = await video.dislikes.filter((id)=>id != userId);
    video.likes.push(userId);
    await video.save();
    return res.status(200).json({message : "like added"});
  } catch (error) {
    return res.json(error);
  }
}

export async function likeremoved(req , res){
   try {
     const {userId , videoId} = req.query;
    const video = await Video.findOne({publicId: videoId});
    if(!video){
        return res.status(404).json({message : "video not found"});
    }
    video.likes = video.likes.filter((id)=>id!= userId);
    await video.save();
    return res.status(200).json({message : "like removed"});
   } catch (error) {
    console.log(error);
   }
}

export async function disliked(req, res){
     try {
    const {userId , videoId} = req.query;
    const video = await Video.findOne({publicId: videoId});
    if(!video){
        return res.status(404).json({message: "video not found"});
    }
    const dislikeuser = await video.dislikes.find((id)=>id.toString() === userId);
    if(dislikeuser){
        return res.status(200).json({message : "already disliked"}); 
    }
    video.likes = await video.likes.filter((id)=>id != userId);
    video.dislikes.push(userId);
    await video.save();
    return res.status(200).json({message : "disliked"});
  } catch (error) {
    return res.json(error);
  }
}

export async function dislikeremoved(req,res){
    try {
     const {userId , videoId} = req.query;
    const video = await Video.findOne({publicId: videoId});
    if(!video){
        return res.status(404).json({message : "video not found"});
    }
    video.dislikes = video.dislikes.filter((id)=>id!= userId);
    await video.save();
    return res.status(200).json({message : "dislike removed"});
   } catch (error) {
    console.log(error);
   }
}