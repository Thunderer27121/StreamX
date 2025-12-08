import { useNavigate } from "react-router-dom";
import { Play, Clock, Eye, TrendingUp } from "lucide-react";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/watch/${encodeURIComponent(video.publicId)}`);
  };

  // Format views count
  const formatViews = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer"
    >
      <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-2">
        
        {/* Thumbnail Container */}
        <div className="relative overflow-hidden aspect-video bg-zinc-950">
          {/* Image with zoom effect */}
          <img
            src={video?.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 ease-out"
          />
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
          
          {/* Duration Badge - Top Right */}
          <div className="absolute top-3 right-3 bg-black/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10">
            <Clock size={12} className="text-orange-400" />
            <span>{video.duration}</span>
          </div>

          {/* HD Badge - Top Left */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
            HD
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/30 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl scale-0 hover:scale-100 opacity-0 hover:opacity-100 transition-all duration-300">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 pt-8 opacity-0 hover:opacity-100 translate-y-2 hover:translate-y-0 transition-all duration-300">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Trending</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md">
                <TrendingUp size={12} className="text-orange-400" />
                <span>Popular</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-white font-bold text-base line-clamp-2 leading-snug transition-all duration-300">
            {video.title}
          </h3>
          
          {/* Channel Name */}
          <p className="text-zinc-400 text-sm font-medium hover:text-pink-400 transition-colors cursor-pointer truncate">
            {video.channel}
          </p>
          
          {/* Views and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2.5 py-1 rounded-full">
                <Eye size={14} className="text-pink-400" />
                <span className="font-semibold text-zinc-300">
                  {formatViews(video.views?.length || 0)}
                </span>
                <span className="text-xs">views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-purple-500/5 to-orange-500/5 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}