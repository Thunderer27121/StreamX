import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useComments } from "../hooks/useComments";
import { useAddComment } from "../hooks/useAddComment";
import { useDeleteComment } from "../hooks/useDeleteComment";
import { useChannel } from "../contexts/channelContext";

export default function Comments({ videoId, user, videoChannelId, googleId }) {
  const [comment, setComment] = useState("");

  const { channel } = useChannel();
  const viewerChannelId = channel?._id || null;

  const {
    data: comments = [],
    isLoading,
    isError,
  } = useComments(videoId);

  const { mutate: addComment, isPending: isAdding } = useAddComment(videoId);
  const { mutate: deleteComment, isPending: isDeleting } =
    useDeleteComment(videoId);

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      video: videoId,
      user: user._id,
      content: comment.trim(),
      user_avatar: `${import.meta.env.VITE_api_base_url}/api/auth/profile-pfp/${user._id}`,
      user_name: user.name,
      time: new Date().toDateString(),
    };

    setComment("");
    addComment(newComment);
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    deleteComment({
      commentId,
      userId: user._id,
      channelId: viewerChannelId,
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-950">
      <div className="p-2 border-b border-gray-800 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {isLoading ? "Loading..." : `${comments.length} Comments`}
        </h2>
      </div>

      <div className="p-2 border-b border-gray-800 flex-shrink-0">
        <div className="flex gap-4">
          <img
            src={`${import.meta.env.VITE_api_base_url}/api/auth/profile-pfp/${user._id}`}
            alt="Your avatar"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
          />

          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              className="w-full bg-transparent border-b border-gray-700 focus:border-orange-500 outline-none py-2 text-white placeholder-gray-500 text-xs sm:text-sm"
            />

            <div className="flex justify-end mt-2 gap-2">
              <button
                onClick={() => setComment("")}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <motion.button
                onClick={handleAddComment}
                disabled={!comment.trim() || isAdding}
                className="px-4 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium text-xs sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={{ scale: comment.trim() ? 1.05 : 1 }}
                whileTap={{ scale: comment.trim() ? 0.95 : 1 }}
              >
                {isAdding ? "Posting..." : "Comment"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable list area */}
      <div className="flex-1 overflow-y-auto " style={{scrollbarWidth : "none" }}>
        <div className="p-3 space-y-2">
          {isError && (
            <p className="text-red-400 text-sm">
              Failed to load comments. Try again later.
            </p>
          )}

          {!isLoading && comments.length === 0 && !isError && (
            <p className="text-gray-500 text-sm">No comments yet. Be first!</p>
          )}

          {comments.map((c) => {
            const isCommentOwner = c?.user?._id === user?._id;
            const isVideoOwner = viewerChannelId === videoChannelId;
            const creater = c?.user?.googleId === googleId;
            const canDelete = isCommentOwner || isVideoOwner;

            return (
              <motion.div
                key={c._id}
                className="flex gap-3 p-2 rounded-lg hover:bg-gray-900 transition-colors"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img
                  src={`${import.meta.env.VITE_api_base_url}/api/auth/profile-pfp/${c._id}`}
                  alt={c.user_name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs sm:text-sm text-white">
                        {c.user_name}
                      </span>
                      <span className="text-gray-400 text-[10px] sm:text-xs">
                        {c.time}
                      </span>
                      {creater === true && (
                        <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-orange-600/20 text-orange-400">
                          Creator
                        </span>
                      )}
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        disabled={isDeleting}
                        className="text-gray-400 hover:text-red-400 text-[10px] sm:text-xs flex items-center gap-1 disabled:opacity-60"
                      >
                        <Trash2 size={14} />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm mt-1 break-words">
                    {c.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
