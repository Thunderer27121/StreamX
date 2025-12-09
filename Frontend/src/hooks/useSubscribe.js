import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../contexts/usercontext";

export function useSubscribe(subscribed, setSubscribed,) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const currentUserId = user?._id;

  const mutation = useMutation({
    mutationFn: async ({ channelId }) => {
      const url = subscribed
        ? `${import.meta.env.VITE_api_base_url}/api/sub/removesub`
        : `${import.meta.env.VITE_api_base_url}/api/sub/addsub`;

      await axios.post(url, {
        userid: currentUserId,
        channelid: channelId,
      });
    },

    onMutate: async ({ channelId }) => {
      await queryClient.cancelQueries({ queryKey: ["video", user] });

      const previousVideo = queryClient.getQueryData(["video", user]);

      setSubscribed(prev => !prev);

      queryClient.setQueryData(["video", user], (old) => {
        if (!old || !old.uploadedBy) return old;

        const subscribers = old.uploadedBy.subscribers || [];
        const isCurrentlySubscribed = subscribers.includes(currentUserId);

        let newSubscribers;
        if (isCurrentlySubscribed) {
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

      toast.error("Subscription error");
    },

    onSettled: (_data, _error, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: ["channel", channelId] });
      queryClient.invalidateQueries({ queryKey: ["video", user] });
    },
  });

  const toggleSubscription = (channelId) => {
    mutation.mutate({ channelId });
  };

  return {
    toggleSubscription,
    isLoading: mutation.isPending,
  };
}
