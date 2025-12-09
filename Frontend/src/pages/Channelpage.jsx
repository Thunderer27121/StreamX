import { useParams } from "react-router-dom";
import { useVideo } from "../contexts/videocontext.jsx";
import VideoCard from "../components/videocard.jsx";
import { Play, Users, Video, CheckCircle2, Bell, TrendingUp } from "lucide-react";
import { useUser } from "../contexts/usercontext.jsx";
import Share from "../components/Share.jsx";
import { useChannel } from "../contexts/channelContext.jsx";
import { useSubscribe } from "../hooks/useSubscribe.js";

export default function ChannelPage() {
    const { user } = useUser();
    const { channelId } = useParams();
    const { Videos, isLoading } = useVideo();
    const { channel } = useChannel();

    const allVideos = Videos || [];

    const channelVideos = allVideos.filter((v) => {
        if (typeof v.uploadedBy === "object") {
            return v.uploadedBy._id === channelId;
        }
        return v.uploadedBy === channelId;
    });

    const Channel =
        channelVideos.length > 0 && typeof channelVideos[0].uploadedBy === "object"
            ? channelVideos[0].uploadedBy
            : null;

    // total views
    const totalViews = channelVideos.reduce(
        (acc, video) => acc + (video.views?.length || 0),
        0
    );

    const isSubscribed = channel?.subscribers?.includes(user?._id) ?? false;
       const { toggleSubscription, isLoading: issubloading } = useSubscribe(isSubscribed);

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* CHANNEL HEADER */}
                {channel ? (
                    <div className="mb-8">
                        <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 animate-gradient"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>

                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="relative -mt-24 sm:-mt-28">
                                <div className="bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex justify-center md:justify-start">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                                                <div className="relative bg-black rounded-full p-1.5">
                                                    <img
                                                        src={Channel?.profilePictureUrl}
                                                        alt={Channel?.name}
                                                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                                                            {Channel.name}
                                                        </h1>
                                                        <CheckCircle2 className="w-7 h-7 text-white fill-blue-400 flex-shrink-0" />
                                                    </div>

                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-5 text-sm mb-4">
                                                        <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
                                                            <Users className="w-4 h-4 text-pink-400" />
                                                            <span className="font-bold text-white">
                                                                {(channel.subscribers?.length || 0).toLocaleString()}
                                                            </span>
                                                            <span className="text-zinc-400">subscribers</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
                                                            <Video className="w-4 h-4 text-purple-400" />
                                                            <span className="font-bold text-white">
                                                                {channelVideos.length}
                                                            </span>
                                                            <span className="text-zinc-400">videos</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
                                                            <TrendingUp className="w-4 h-4 text-orange-400" />
                                                            <span className="font-bold text-white">
                                                                {totalViews.toLocaleString()}
                                                            </span>
                                                            <span className="text-zinc-400">views</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ACTION BUTTONS */}
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                                {user?._id &&
                                                    (channel?.message || channel?._id !== channelId) && (
                                                        <button
                                                            disabled={issubloading}
                                                            onClick={() =>
                                                                toggleSubscription(Channel._id)
                                                            }
                                                            className={`group relative px-8 py-3 rounded-full font-bold transition-all 
                                                            duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 
                                                            ${
                                                                isSubscribed
                                                                    ? "bg-zinc-800 text-white hover:bg-zinc-700"
                                                                    : "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white hover:shadow-purple-500/50"
                                                            }`}
                                                        >
                                                            <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
                                                            <Bell className="w-4 h-4 group-hover:animate-bounce" />
                                                        </button>
                                                    )}

                                                <Share
                                                    url={`${window.location.origin}/channel/${Channel._id}`}
                                                    title={Channel.name}
                                                    text={`Check out ${Channel.name}'s channel!`}
                                                    className="hover:scale-105 border border-zinc-700"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    !isLoading && (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
                                <div className="relative w-32 h-32 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                                    <Video className="w-16 h-16 text-zinc-600" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mt-8 mb-2">Channel not found</h2>
                            <p className="text-zinc-500">
                                The channel you're looking for doesn't exist or has been removed.
                            </p>
                        </div>
                    )
                )}

                {/* VIDEOS */}
                {Channel && (
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-8 mt-12">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-10 bg-gradient-to-b from-pink-500 via-purple-500 to-orange-500 rounded-full"></div>
                                <h2 className="text-3xl font-bold">Latest Videos</h2>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 via-zinc-700 to-transparent"></div>
                        </div>

                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-32">
                                <div className="relative w-20 h-20">
                                    <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <p className="text-zinc-400 mt-6 text-lg">Loading amazing content...</p>
                            </div>
                        )}

                        {!isLoading && channelVideos.length === 0 && (
                            <div className="text-center py-32">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
                                    <div className="relative w-32 h-32 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 mx-auto mb-6">
                                        <Play className="w-16 h-16 text-zinc-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No videos yet</h3>
                                <p className="text-zinc-500">This channel hasn't uploaded any videos. Stay tuned!</p>
                            </div>
                        )}

                        {!isLoading && channelVideos.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-12">
                                {channelVideos.map((video) => (
                                    <div key={video._id} className="group">
                                        <VideoCard video={video} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
