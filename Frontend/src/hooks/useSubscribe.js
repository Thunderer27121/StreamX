import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../contexts/usercontext";

export function useSubscribe(isSubscribed, setSubscribed) {
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

    // OPTIMISTIC UPDATE for BOTH ChannelPage and VideoPlayer
    onMutate: async ({ channelId, isCurrentlySubscribed }) => {
      // Cancel both
      await queryClient.cancelQueries({ queryKey: ["channel", channelId] });
      await queryClient.cancelQueries({ queryKey: ["video", user] });

      // Snapshot previous states
      const previousChannel = queryClient.getQueryData(["channel", channelId]);
      const previousVideo = queryClient.getQueryData(["video", user]);

      // Flip UI instantly
      if (setSubscribed) setSubscribed(!isCurrentlySubscribed);

      // 🔥 UPDATE CHANNEL CACHE OPTIMISTICALLY
      queryClient.setQueryData(["channel", channelId], (old) => {
        if (!old) return old;
        const alreadySubbed = old.subscribers.includes(currentUserId);

        return {
          ...old,
          subscribers: alreadySubbed
            ? old.subscribers.filter((id) => id !== currentUserId)
            : [...old.subscribers, currentUserId],
        };
      });

      // 🔥 UPDATE VIDEO CACHE OPTIMISTICALLY (if exists)
      queryClient.setQueryData(["video", user], (old) => {
        if (!old || !old.uploadedBy) return old;
        const alreadySubbed = old.uploadedBy.subscribers.includes(currentUserId);

        return {
          ...old,
          uploadedBy: {
            ...old.uploadedBy,
            subscribers: alreadySubbed
              ? old.uploadedBy.subscribers.filter((id) => id !== currentUserId)
              : [...old.uploadedBy.subscribers, currentUserId],
          },
        };
      });

      return { previousChannel, previousVideo, channelId };
    },

    // ROLLBACK
    onError: (err, vars, ctx) => {
      if (setSubscribed) setSubscribed((prev) => !prev);

      if (ctx?.previousChannel)
        queryClient.setQueryData(["channel", ctx.channelId], ctx.previousChannel);

      if (ctx?.previousVideo)
        queryClient.setQueryData(["video", user], ctx.previousVideo);

      toast.error("Subscription error");
      console.error("SUBSCRIBE ERROR:", err?.response?.data || err.message);
    },

    // REFETCH TRUTH DATA
    onSettled: (_d, _e, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: ["channel", channelId] });
      queryClient.invalidateQueries({ queryKey: ["video", user] });
    },
  });

  const toggleSubscription = (channelId) => {
    mutation.mutate({
      channelId,
      isCurrentlySubscribed: isSubscribed,
    });
  };

  return {
    toggleSubscription,
    isLoading: mutation.isPending,
  };
}
