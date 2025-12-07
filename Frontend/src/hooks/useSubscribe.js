import axios from "axios";
import { toast } from "react-toastify";

export function useSubscribe(subscribed, setSubscribed) {
  const toggleSubscription = async (userId, channelId) => {
    try {
      const url = subscribed
        ? `${import.meta.env.VITE_api_base_url}/api/sub/removesub`
        : `${import.meta.env.VITE_api_base_url}/api/sub/addsub`;

      const res = await axios.post(url, { userid: userId, channelid: channelId });

      if (res.status === 200) {
        setSubscribed(!subscribed);
      } else {
        toast.error("Subscription error");
      }
    } catch (err) {
      toast.error("Error");
    }
  };

  return { toggleSubscription };
}
