import { useParams } from "react-router-dom";
import VideoCard from "../components/videocard.jsx";
import { useVideo } from "../contexts/videocontext.jsx";
import { Loader2, AlertCircle, VideoOff } from "lucide-react";

export default function Home() {
  
  const { Videos, isLoading, isError, error ,refetch } = useVideo();
  const { category } = useParams(); 
 if(location.pathname === "/"){
  refetch();
 }
  let filteredVideos = Videos || [];
  let selectedLabel = "All";

  if (category) {
    const cat = category.toLowerCase();

    if (cat === "trending") {
      selectedLabel = "Trending";
      filteredVideos = [...(Videos || [])].sort(
        (a, b) => (b.views?.length || 0) - (a.views?.length || 0)
      );
    } else if (cat === "music") {
      selectedLabel = "Music";
      filteredVideos = (Videos || []).filter(
        (video) => video.category === "Music"
      );
    } else if (cat === "gaming") {
      selectedLabel = "Gaming";
      filteredVideos = (Videos || []).filter(
        (video) => video.category === "Gaming"
      );
    } else {
      selectedLabel = category;
      filteredVideos = (Videos || []).filter(
        (video) => video.category?.toLowerCase() === cat
      );
    }
  }

  return (
    <div className="flex bg-black min-h-screen w-full text-white">
      <div className="max-w-7xl w-full px-4 py-6">

        {/* LOADING SCREEN */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="relative">
              {/* Outer spinning ring */}
              <div className="w-24 h-24 border-4 border-gray-800 border-t-orange-500 rounded-full animate-spin"></div>
              
              {/* Inner pulsing circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Loader2 className="w-10 h-10 text-orange-500 animate-pulse" />
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Loading Videos
              </h3>
              <div className="flex items-center justify-center space-x-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
              <p className="text-gray-500 mt-3 text-sm">
                Fetching the best content for you
              </p>
            </div>

            {/* Skeleton loader cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mt-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-900 rounded-xl h-48 mb-3"></div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-900 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-900 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ERROR SCREEN */}
        {isError && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
            <div className="relative z-10">
              {/* Glowing error circle */}
              <div className="absolute inset-0 bg-red-500 opacity-20 blur-3xl rounded-full animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-red-900 to-red-950 p-6 rounded-full">
                <AlertCircle className="w-16 h-16 text-red-500" strokeWidth={2} />
              </div>
            </div>

            <div className="mt-8 text-center max-w-md z-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                Oops! Something went wrong
              </h2>
              <p className="text-red-400 text-lg mb-2">
                {error?.message || "Failed to load videos"}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                We couldn't fetch the videos. This might be a temporary issue.
              </p>
              
              <button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50"
              >
                Try Again
              </button>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500 opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-orange-500 opacity-5 rounded-full blur-3xl"></div>
          </div>
        )}

        {/* NO VIDEOS FOUND */}
        {!isLoading && !isError && filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 opacity-10 blur-3xl rounded-full"></div>
              
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-full border border-gray-800">
                <VideoOff className="w-20 h-20 text-orange-500" strokeWidth={1.5} />
              </div>
            </div>

            <div className="mt-8 text-center max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-2">
                No Videos Found
              </h2>
              <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                <p className="text-4xl font-black mt-2 mb-4">
                  {selectedLabel}
                </p>
              </div>
              <p className="text-gray-400 text-lg mb-6">
                Try uploading a video in this category or explore other content.
              </p>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 border border-gray-700 hover:border-orange-500"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* VIDEO GRID */}
        {!isLoading && !isError && filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}