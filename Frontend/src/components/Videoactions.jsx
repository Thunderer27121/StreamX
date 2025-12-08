import {motion} from "framer-motion";
import { ThumbsUp , ThumbsDown } from "lucide-react";
import Share from "./Share.jsx";


export default function VideoActions({ video, liked, disliked, toggleLike, toggleDislike }) {
  const shareUrl = `${window.location.origin}/${video?.publicId}`;
  return (
    <div className="flex items-center gap-2  sm:mr-10 px-1  flex-wrap">
            <div className="flex items-center bg-gray-800  rounded-full overflow-hidden border border-gray-700">
              <motion.button
                onClick={toggleLike}
                className={`px-2 sm:px-5  sm:py-3 flex items-center gap-1.5 sm:gap-2 transition-colors text-sm sm:text-base ${liked ? "text-orange-500" : "text-white hover:text-orange-500"
                  }`}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsUp size={18} className="sm:w-5 sm:h-5" fill={liked ? "currentColor" : "none"} />
                <span className="font-medium">{video?.likes?.length}</span>
              </motion.button>
              <div className="w-px h-5 sm:h-6 bg-gray-700"></div>
              <motion.button
                onClick={toggleDislike}
                className={`px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2 transition-colors text-sm sm:text-base ${disliked ? "text-orange-500" : "text-white hover:text-orange-500"
                  }`}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsDown size={18} className="sm:w-5 sm:h-5" fill={disliked ? "currentColor" : "none"} />
                <span className="font-medium">{video?.dislikes?.length}</span>
              </motion.button>
            </div>
      <Share
      url={shareUrl}
        title={video?.title}
        text={`Check out this video: ${video?.title}`}
      />
    </div>
  );
}
