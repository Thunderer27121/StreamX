import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useComments(videoId) {
  return useQuery({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_api_base_url}/api/comments/${videoId}`
      );
      return res.data.comments || [];
    },
    enabled: !!videoId,
  });
}
