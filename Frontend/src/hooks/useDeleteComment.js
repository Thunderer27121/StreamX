import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useDeleteComment(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
  
    mutationFn: async ({ commentId, userId, channelId }) => {
      await axios.delete(
        `${import.meta.env.VITE_api_base_url}/api/comments/${commentId}/${userId || "null"}/${channelId || "null"}`
      );
    },
    onSuccess: (_, { commentId }) => {
      queryClient.setQueryData(["comments", videoId], (old) => {
        if (!old) return [];
        return old.filter((c) => c._id !== commentId);
      });
    },
  });
}
