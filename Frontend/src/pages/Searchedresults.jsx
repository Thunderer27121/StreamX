import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import VideoCard from "../components/videocard.jsx";
import { useVideo } from "../contexts/videocontext.jsx";
import { Search, Users, Video, CheckCircle, TrendingUp } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const { Videos, isLoading } = useVideo();
  const q = useQuery().get("q") || "";
  const query = q.toLowerCase();

  const allVideos = Videos || [];

  // VIDEO SEARCH
  const videoResults = allVideos.filter((v) => {
    const title = v.title?.toLowerCase() || "";
    const desc = v.description?.toLowerCase() || "";
    const channelName =
      typeof v.uploadedBy === "object"
        ? v.uploadedBy.name?.toLowerCase() || ""
        : "";

    return (
      title.includes(query) ||
      desc.includes(query) ||
      channelName.includes(query)
    );
  });

  // UNIQUE CHANNELS FROM VIDEOS
  const channelMap = new Map();

  allVideos.forEach((v) => {
    if (typeof v.uploadedBy === "object") {
      channelMap.set(v.uploadedBy._id, v.uploadedBy);
    }
  });

  const allChannels = [...channelMap.values()];

  const channelResults = allChannels.filter((ch) =>
    ch.name?.toLowerCase().includes(query)
  );

  const totalResults = videoResults.length + channelResults.length;

  return (
    <div className="bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Search Results
            </h1>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-sm">Results for:</span>
            <span className="text-lg font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              "{q}"
            </span>
            {!isLoading && (
              <span className="ml-2 text-sm bg-zinc-800 px-3 py-1 rounded-full">
                {totalResults} {totalResults === 1 ? 'result' : 'results'}
              </span>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-zinc-400">Searching for amazing content...</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* CHANNELS SECTION */}
            {channelResults.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-400" />
                    Channels
                  </h2>
                  <span className="text-sm text-zinc-500">
                    ({channelResults.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {channelResults.map((ch) => (
                    <Link
                      key={ch._id}
                      to={`/channel/${ch._id}`}
                      className="group block"
                    >
                      <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-5 border border-zinc-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:scale-[1.02]">
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300"></div>
                        
                        <div className="relative flex items-center gap-4">
                          {/* Profile with ring */}
                          <div className="relative flex-shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300"></div>
                            <img
                              src={ch.profilePictureUrl}
                              className="relative w-16 h-16 rounded-full object-cover border-2 border-zinc-800 group-hover:border-pink-500/50 transition-colors"
                              alt={ch.name}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg truncate group-hover:text-pink-400 transition-colors">
                                {ch.name}
                              </h3>
                              <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400 flex-shrink-0" />
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                              <Users className="w-3.5 h-3.5" />
                              <span>{(ch.subscribers?.length || 0).toLocaleString()} subscribers</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* VIDEOS SECTION */}
            {videoResults.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-400" />
                    Videos
                  </h2>
                  <span className="text-sm text-zinc-500">
                    ({videoResults.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {videoResults.map((video) => (
                    <div key={video._id} className="group">
                      <VideoCard video={video} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NO RESULTS */}
            {videoResults.length === 0 && channelResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
                  <div className="relative w-32 h-32 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <Search className="w-16 h-16 text-zinc-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">No results found</h2>
                <p className="text-zinc-500 text-center max-w-md">
                  We couldn't find any videos or channels matching "{q}". Try different keywords or check your spelling.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}