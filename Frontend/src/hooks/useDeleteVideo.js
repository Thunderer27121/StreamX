// src/hooks/useDeleteVideo.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../contexts/usercontext";

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const { user } = useUser(); 

  return useMutation({
    mutationFn: async ({ publicId, id }) => {
      await axios.delete(`${import.meta.env.VITE_api_base_url}/api/video/delete`, {
        data: { publicId },
      });

    
      await axios.delete(
        `${import.meta.env.VITE_api_base_url}/api/dbvideo/videodelete/${id}`
      );
    },
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["video",user?._id] });

      if (user?.googleId) {
        queryClient.invalidateQueries({
          queryKey: ["channel", user?.googleId],
        });
      }
    },
    onError: (error) => {
      console.error("Error deleting video:", error?.response?.data || error);
      toast.error("Failed to delete video");
    },
  });
}
