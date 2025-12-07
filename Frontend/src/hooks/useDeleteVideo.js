// src/hooks/useDeleteVideo.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../contexts/usercontext";

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const { user } = useUser(); 

  return useMutation({
    // expects: { publicId, id }
    mutationFn: async ({ publicId, id }) => {
      await axios.delete(`${import.meta.env.VITE_api_base_url}/api/video/delete`, {
        data: { publicId },
      });

    
      await axios.delete(
        `${import.meta.env.VITE_api_base_url}/api/dbvideo/videodelete/${id}`
      );
    },
    onSuccess: () => {
      toast.success("Video deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["video"] });

      if (user?.googleId) {
        queryClient.invalidateQueries({
          queryKey: ["channel", user.googleId],
        });
      }
    },
    onError: (error) => {
      console.error("Error deleting video:", error?.response?.data || error);
      toast.error("Failed to delete video");
    },
  });
}
