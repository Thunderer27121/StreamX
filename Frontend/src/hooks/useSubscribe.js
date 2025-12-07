import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../contexts/usercontext";

export function useSubscribe(subscribed, setSubscribed) {
  const {user} = useUser();
  const queryclient = useQueryClient();
  const toggleSubscription = async (userId, channelId) => {
    try {
      const url = subscribed
        ? `${import.meta.env.VITE_api_base_url}/api/sub/removesub`
        : `${import.meta.env.VITE_api_base_url}/api/sub/addsub`;

      const res = await axios.post(url, { userid: userId, channelid: channelId });

      if (res.status === 200) {
        setSubscribed(!subscribed);
        await queryclient.invalidateQueries({queryKey : ["channel", user?.googleId]})
      } else {
        toast.error("Subscription error");
      }
    } catch (err) {
      toast.error("Error");
    }
  };

  return { toggleSubscription };
}
