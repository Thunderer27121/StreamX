import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useAddComment(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment) => {
      const res = await axios.post(
        "http://localhost:5000/api/comments/add",
        newComment
      );
      return res.data.comment;
    },
    onSuccess: (savedComment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
}
