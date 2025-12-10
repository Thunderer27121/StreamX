import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../contexts/usercontext";

export function useSubscribe(subscribed, setSubscribed, videoPublicId) {
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
      await queryClient.cancelQueries({ queryKey: ["video", user?._id] });
      await queryClient.cancelQueries({ queryKey: ["video", videoPublicId] });

      const previousList = queryClient.getQueryData(["video", user?._id]);
      const previousSingle = queryClient.getQueryData(["video", videoPublicId]);

      if (setSubscribed) setSubscribed(!isCurrentlySubscribed);

      queryClient.setQueryData(["video", user?._id], (old) => {
        if (!old) return old;

        return old.map((v) => {
          if (v.uploadedBy._id !== channelId) return v;

          const already = v.uploadedBy.subscribers.includes(currentUserId);

          return {
            ...v,
            uploadedBy: {
              ...v.uploadedBy,
              subscribers: already
                ? v.uploadedBy.subscribers.filter((id) => id !== currentUserId)
                : [...v.uploadedBy.subscribers, currentUserId],
            },
          };
        });
      });

      queryClient.setQueryData(["video", videoPublicId], (old) => {
        if (!old || !old.uploadedBy) return old;

        const already = old.uploadedBy.subscribers.includes(currentUserId);

        return {
          ...old,
          uploadedBy: {
            ...old.uploadedBy,
            subscribers: already
              ? old.uploadedBy.subscribers.filter((id) => id !== currentUserId)
              : [...old.uploadedBy.subscribers, currentUserId],
          },
        };
      });

      return { previousList, previousSingle };
    },

    onError: (_err, _vars, ctx) => {
      if (setSubscribed) setSubscribed((prev) => !prev);

      if (ctx?.previousList)
        queryClient.setQueryData(["video", user?._id], ctx.previousList);

      if (ctx?.previousSingle)
        queryClient.setQueryData(["video", videoPublicId], ctx.previousSingle);

      toast.error("Subscription error");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["video", user?._id] });
      queryClient.invalidateQueries({ queryKey: ["video", videoPublicId] });
    },
  });

  const toggleSubscription = (channelId) => {
    mutation.mutate({
      channelId,
      isCurrentlySubscribed: subscribed,
    });
  };

  return {
    toggleSubscription,
    isLoading: mutation.isPending,
  };
}
