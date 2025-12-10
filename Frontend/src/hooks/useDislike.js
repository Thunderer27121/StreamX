import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLikeDislike(video, userId, liked, setLiked, disliked, setDisliked) {
  const queryClient = useQueryClient();
  const baseUrl = import.meta.env.VITE_api_base_url;
  const videoId = video?._id;

  const likeMutation = useMutation({
    mutationFn: async ({ liked }) => {
      const condition = liked ? "likeremoved" : "likeadded";

      return axios.get(
        `${baseUrl}/api/like/${condition === "likeadded" ? "liked" : "unliked"}`,
        {
          params: { userId, videoId },
        }
      );
    },

    onMutate: async ({ liked, disliked }) => {
      if (!videoId || !userId) return;

      await queryClient.cancelQueries(["video", videoId]);

      const previousVideo = queryClient.getQueryData(["video", videoId]);

      if (liked) {
        setLiked(false);
      } else {
        setLiked(true);
        if (disliked) setDisliked(false);
      }

      queryClient.setQueryData(["video", videoId], (old) => {
        if (!old) return old;

        let newLikes = [...(old.likes || [])];
        let newDislikes = [...(old.dislikes || [])];

        if (liked) {
          newLikes = newLikes.filter((id) => id !== userId);
        } else {
          if (!newLikes.includes(userId)) newLikes.push(userId);
          if (disliked) {
            newDislikes = newDislikes.filter((id) => id !== userId);
          }
        }

        return {
          ...old,
          likes: newLikes,
          dislikes: newDislikes,
        };
      });

      return { previousVideo };
    },

    onError: (err, variables, context) => {
      if (context?.previousVideo && videoId) {
        queryClient.setQueryData(["video", videoId], context.previousVideo);
      }
      const prev = context?.previousVideo;
      if (prev && userId) {
        setLiked(prev.likes?.includes(userId) || false);
        setDisliked(prev.dislikes?.includes(userId) || false);
      }
      console.error("Error toggling like:", err);
    },

    onSettled: () => {
      if (videoId) {
        queryClient.invalidateQueries(["video", videoId]);
      }
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: async ({ disliked }) => {
      const condition = disliked ? "dislikeremoved" : "dislikeadded";

      return axios.get(
        `${baseUrl}/api/like/${
          condition === "dislikeadded" ? "disliked" : "dislikeremoved"
        }`,
        {
          params: { userId, videoId },
        }
      );
    },

    onMutate: async ({ liked, disliked }) => {
      if (!videoId || !userId) return;

      await queryClient.cancelQueries(["video", videoId]);

      const previousVideo = queryClient.getQueryData(["video", videoId]);

      if (disliked) {
        setDisliked(false);
      } else {
        setDisliked(true);
        if (liked) setLiked(false);
      }
      queryClient.setQueryData(["video", videoId], (old) => {
        if (!old) return old;

        let newLikes = [...(old.likes || [])];
        let newDislikes = [...(old.dislikes || [])];

        if (disliked) {
          
          newDislikes = newDislikes.filter((id) => id !== userId);
        } else {
          
          if (!newDislikes.includes(userId)) newDislikes.push(userId);

          if (liked) {
            newLikes = newLikes.filter((id) => id !== userId);
          }
        }

        return {
          ...old,
          likes: newLikes,
          dislikes: newDislikes,
        };
      });

      return { previousVideo };
    },

    onError: (err, variables, context) => {
      if (context?.previousVideo && videoId) {
        queryClient.setQueryData(["video", videoId], context.previousVideo);
      }
      const prev = context?.previousVideo;
      if (prev && userId) {
        setLiked(prev.likes?.includes(userId) || false);
        setDisliked(prev.dislikes?.includes(userId) || false);
      }
      console.error("Error toggling dislike:", err);
    },

    onSettled: () => {
      if (videoId) {
        queryClient.invalidateQueries(["video", videoId]);
      }
    },
  });

  const toggleLike = () => {
    if (!userId || !videoId) return;
    likeMutation.mutate({ liked, disliked });
  };

  const toggleDislike = () => {
    if (!userId || !videoId) return;
    dislikeMutation.mutate({ liked, disliked });
  };

  return { toggleLike, toggleDislike };
}
