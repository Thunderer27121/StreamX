import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../contexts/usercontext";

export function useSubscribe(subscribed , setSubscribed) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const currentUserId = user?._id;

  const mutation = useMutation({
  mutationFn: async ({ channelId, isCurrentlySubscribed }) => {
    const url = isCurrentlySubscribed
      ? `${import.meta.env.VITE_api_base_url}/api/sub/removesub`
      : `${import.meta.env.VITE_api_base_url}/api/sub/addsub`;

    await axios.post(url, {
      userid: currentUserId,
      channelid: channelId,
    });
  },

  onMutate: async ({ channelId, isCurrentlySubscribed }) => {
    await queryClient.cancelQueries({ queryKey: ["video", user] });

    const previousVideo = queryClient.getQueryData(["video", user]);

    setSubscribed(!isCurrentlySubscribed);

    queryClient.setQueryData(["video", user], (old) => {
      if (!old || !old.uploadedBy) return old;

      const subscribers = old.uploadedBy.subscribers || [];
      const alreadySubbed = subscribers.includes(currentUserId);

      let newSubscribers;
      if (alreadySubbed) {
        newSubscribers = subscribers.filter((id) => id !== currentUserId);
      } else {
        newSubscribers = [...subscribers, currentUserId];
      }

      return {
        ...old,
        uploadedBy: {
          ...old.uploadedBy,
          subscribers: newSubscribers,
        },
      };
    });

    return { previousVideo };
  },

    onError: (_error, _variables, context) => {
      setSubscribed(prev => !prev);

      if (context?.previousVideo) {
        queryClient.setQueryData(["video", user], context.previousVideo);
      }
      console.error("SUBSCRIPTION ERROR:", _error?.response?.data || _error.message);
      toast.error("Subscription error");
    },

    onSettled: async (_data, _error, { channelId }) => {
      await queryClient.invalidateQueries({ queryKey: ["channel", channelId] });
      await queryClient.invalidateQueries({ queryKey: ["video", user] });
    },
  });

  const toggleSubscription = (channelId) => {
    mutation.mutate({ channelId , isCurrentlySubscribed : subscribed});
  };

  return {
    toggleSubscription,
    isLoading: mutation.isPending,
  };
}
