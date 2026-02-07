import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

export function useVideoData(id, userId) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const { data: video, isLoading } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_api_base_url}/api/dbvideo/`, {
        params: { publicId: id }
      });
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!video || !userId) return;

    setSubscribed(video.uploadedBy.subscribers.includes(userId));
    setLiked(video.likes.includes(userId));
    setDisliked(video.dislikes.includes(userId));
  }, [video, userId]);

  return {
    video,
    liked, setLiked,
    disliked, setDisliked,
    subscribed, setSubscribed, isLoading
  };
}
