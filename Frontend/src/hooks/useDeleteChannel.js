import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"
import { useUser } from "../contexts/usercontext";

export function useDeleteChannel() {
  const {user} = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId) => {
       const res = await axios.delete(`${import.meta.env.VITE_api_base_url}/api/channels/delete/${channelId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["channel",user?.googleId] });
      toast.info(data.message);
      navigate("/");
    },
    onError : (error)=>{
        toast.error(error.message)
    }
  });
}
