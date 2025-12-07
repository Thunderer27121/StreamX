import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useViews(video, userId) {
  const queryclient = useQueryClient();
  const handleView = async (currentTime) => {
    if (currentTime > 5) {
      await axios.get(`${import.meta.env.VITE_api_base_url}/api/views/`, {
        params: { userId, videoId: video?._id }
      });
    }
    queryclient.invalidateQueries({
        queryKey: ["channel", user?.googleId],
      });
  };

  return { handleView };
}
