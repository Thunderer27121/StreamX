import axios from "axios";

export function useLikeDislike(video, userId, liked, setLiked, disliked, setDisliked) {
  
  const toggleLike = async () => {
    const condition = liked ? "likeremoved" : "likeadded";
    await axios.get(`${import.meta.env.VITE_api_base_url}/api/like/${condition === "likeadded" ? "liked" : "unliked"}`, {
      params: { userId, videoId: video._id }
    });

    setLiked(prev => !prev);
    if (disliked) setDisliked(false);
  };

  const toggleDislike = async () => {
    const condition = disliked ? "dislikeremoved" : "dislikeadded";
    await axios.get(`${import.meta.env.VITE_api_base_url}/api/like/${condition === "dislikeadded" ? "disliked" : "dislikeremoved"}`, {
      params: { userId, videoId: video._id }
    });

    setDisliked(prev => !prev);
    if (liked) setLiked(false);
  };

  return { toggleLike, toggleDislike };
}
