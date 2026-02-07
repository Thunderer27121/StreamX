import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useAddComment(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment) => {
      const res = await axios.post(
        `${import.meta.env.VITE_api_base_url}/api/comments/add`,
        newComment
      );
      return res.data.comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
}
