import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export function useDeleteChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId) => {
       const res = await axios.delete(`${import.meta.env.VITE_api_base_url}/api/channels/delete/${channelId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      toast.info(data.message);
    },
    onError : (error)=>{
        toast.error(error.message)
    }
  });
}
