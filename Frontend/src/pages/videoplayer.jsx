import { useParams } from "react-router-dom";
import { useUser } from "../contexts/usercontext.jsx";
import { useRef } from "react";

import { useVideoData } from "../hooks/usevideodata.js";
import { useSubscribe } from "../hooks/useSubscribe.js";
import { useLikeDislike } from "../hooks/useDislike.js";
import { useViews } from "../hooks/useViews.js";

import Video from "../components/Video.jsx";
import VideoInfo from "../components/Videoinfo.jsx";
import VideoChannel from "../components/Videochannel.jsx";
import VideoActions from "../components/Videoactions.jsx";
import Comments from "../components/Comments.jsx";

export default function VideoPlayer() {
  const { id } = useParams();
  console.log(id);
  const { user } = useUser();
  const videoRef = useRef(null);

  const {
    video,
    liked,
    setLiked,
    disliked,
    setDisliked,
    subscribed,
    setSubscribed,
    isLoading
  } = useVideoData(id, user?._id);

  const { toggleSubscription } = useSubscribe(subscribed, setSubscribed);
  const { toggleLike, toggleDislike } = useLikeDislike(
    video,
    user?._id,
    liked,
    setLiked,
    disliked,
    setDisliked
  );
  const { handleView } = useViews(video, user?._id);

  return (
    <div
      className="
        fixed inset-x-0 top-16 bottom-0
        bg-black text-white
        flex flex-col lg:flex-row
        overflow-hidden min-h-0
      "
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin" />
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-red-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <p className="text-xl font-semibold text-white animate-pulse">Loading video...</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <section
        className="
          w-full lg:w-[50%]
          flex-shrink-0 flex flex-col
          border-b lg:border-b-0 lg:border-r border-gray-800
          min-h-0
        "
      >
        <div className="w-full lg:flex-none  lg:h-[55%]">
            <Video
              src={video?.videoUrl}
              ref={videoRef}
              onTimeUpdate={(e) => handleView(e.target.currentTime)}
            />
      
        </div>

    
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-1 pb-3 ">
          
          <VideoInfo video={video} />

          <div className="flex lg:hidden items-start justify-between gap-25 border-b border-gray-800 pb-3">
  <VideoChannel
    video={video}
    user={user}
    subscribed={subscribed}
    toggleSubscription={() =>
      toggleSubscription(user?._id, video?.uploadedBy?._id)
    }
  />

  <div className="flex flex-col items-start justify-start self-start">
    <VideoActions
      video={video}
      liked={liked}
      disliked={disliked}
      toggleLike={toggleLike}
      toggleDislike={toggleDislike}
    />
  </div>
</div>

          <div className="hidden lg:block border-b border-gray-800 pb-3 space-y-3">
            <VideoChannel
              video={video}
              user={user}
              subscribed={subscribed}
              toggleSubscription={() =>
                toggleSubscription(user?._id, video?.uploadedBy?._id)
              }
            />

            <VideoActions
              video={video}
              liked={liked}
              disliked={disliked}
              toggleLike={toggleLike}
              toggleDislike={toggleDislike}
            />
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col bg-black min-h-0">
        <Comments
          videoId={video?._id}
          user={user}
          videoChannelId={video?.uploadedBy._id}
          googleId={video?.uploadedBy.googleId}
        />
      </section>
    </div>
  );
}