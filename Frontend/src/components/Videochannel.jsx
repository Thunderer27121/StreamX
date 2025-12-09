import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export default function VideoChannel({ isloading ,video, subscribed, toggleSubscription, user }) {
  return (
    <div className="mt-4 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Channel info */}
        <div className="flex items-center gap-3 text-white">
          <img
            src={video?.uploadedBy.profilePictureUrl}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{video?.uploadedBy.name}</h3>
            <p className="text-sm text-gray-300">
              {video?.uploadedBy.subscribers.length} subscribers
            </p>
          </div>
        </div>

        {/* Subscribe button */}
        {video?.uploadedBy.googleId !== user?.googleId && (
          <motion.button
          disabled={isloading}
            onClick={toggleSubscription}
            className={`w-full sm:w-auto px-5 py-2 sm:px-8 sm:py-3 rounded-full font-semibold
              flex items-center justify-center gap-2 text-sm sm:text-base
              ${
                subscribed
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {subscribed && <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />}
            {subscribed ? "Subscribed" : "Subscribe"}
          </motion.button>
        )}
      </div>
    </div>
  );
}
