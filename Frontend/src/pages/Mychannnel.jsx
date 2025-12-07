import { useEffect, useState } from 'react';
import { Play, Eye, ThumbsUp, Settings, Users, Video, Edit3, X, Upload, Camera } from 'lucide-react';
import { useChannel } from '../contexts/channelContext';
import { useUser } from '../contexts/usercontext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useDeleteVideo } from '../hooks/useDeleteVideo.JS';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const StreamXChannelPage = () => {
  const queryclient = useQueryClient();
  const { channel} = useChannel();
  const { user } = useUser();
  const navigate = useNavigate();
  const { mutate: deleteVideo, isPending } = useDeleteVideo();
  const [activeTab, setActiveTab] = useState('HOME');
  const [checking, setChecking] = useState(true);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    handle: '',
    description: '',
    profilePicture: null,
    profilePicturePreview: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const totalview = channel?.videos?.reduce((sum, video) => sum + video?.views?.length, 0);
  const tabs = ['HOME', 'VIDEOS', 'ABOUT'];
  const stats = [
    { label: 'Total Views', value: `${totalview}`, icon: Eye },
    { label: 'Subscribers', value: `${channel?.subscribers?.length}`, icon: Users },
    { label: 'Total Videos', value: `${channel?.videos?.length}`, icon: Video },
  ];

  const createdate = `${channel?.createdAt}`.slice(0, 10);

  // Initialize edit form when modal opens
  const openEditModal = () => {
    setEditForm({
      name: channel?.name || '',
      handle: channel?.handle || '',
      description: channel?.description || '',
      profilePicture: null,
      profilePicturePreview: channel?.profilePictureUrl || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setEditForm(prev => ({
        ...prev,
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Handle form submit
  const handleSaveChanges = async () => {
  if (!editForm.name.trim()) {
    toast.error("Channel name is required");
    return;
  }
  if (!editForm.handle.trim()) {
    toast.error("Channel handle is required");
    return;
  }

  setIsSaving(true);
  try {
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("handle", editForm.handle);
    formData.append("description", editForm.description);
    if (editForm.profilePicture) {
      formData.append("profilePicture", editForm.profilePicture);
    }

    const response = await axios.put(
      `http://localhost:5000/api/channels/${channel._id}`,
      formData,
      {
        withCredentials: true, 
      }
    );
    if(response.status == 200){
      queryclient.invalidateQueries("channel");
       toast.success("Channel updated successfully!");
    setIsEditModalOpen(false);
    }
  } catch (error) {
    console.error(error);
    const message =
      error.response?.data?.message || "Failed to update channel";
    toast.error(message);
  } finally {
    setIsSaving(false);
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) return;
      if (!channel) {
        toast.error("Create a channel first");
        navigate("/");
      } else if (channel?.googleId !== user?.googleId) {
        toast.error("Unauthorized access");
        navigate("/");
      }
      setChecking(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [user, channel, navigate]);

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black px-4">
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            S
          </motion.div>
        </motion.div>

        <div className="relative mb-6">
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-700 border-t-orange-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-b-red-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <motion.p
            className="text-white text-base sm:text-lg font-semibold mb-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Checking your channel...
          </motion.p>
          <p className="text-gray-400 text-xs sm:text-sm">Please wait a moment</p>
        </motion.div>

        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full"
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div
          className="w-48 sm:w-64 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (channel &&
    <div className="min-h-screen bg-black text-white">
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-black border-b border-gray-700 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">Edit Channel</h2>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  Profile Picture
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative group:">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700">
                      {editForm.profilePicturePreview ? (
                        <img
                          src={editForm.profilePicturePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Camera className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center cursor-pointer">
                      <Upload className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 text-sm font-medium">
                      <Upload className="w-4 h-4" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG or GIF. Max size 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Channel Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Channel Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter channel name"
                />
              </div>

              {/* Handle */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Handle *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    value={editForm.handle}
                    onChange={(e) => setEditForm(prev => ({ ...prev, handle: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="channelhandle"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors min-h-[120px] resize-none"
                  placeholder="Tell viewers about your channel"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editForm.description.length} characters
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-700 p-6 flex justify-end gap-3 z-10">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Channel Header */}
      <div className="relative">
        <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-r from-orange-500 to-red-500 overflow-hidden rounded-full flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold border-2 sm:border-4 border-black flex-shrink-0">
              <img src={channel?.profilePictureUrl} alt="" className='w-full' />
            </div>
            <div className="flex-1 pb-0 sm:pb-4 text-center sm:text-left w-full">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{channel.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 flex-wrap">
                <span>{channel?.handle}</span>
                <span className="hidden sm:inline">•</span>
                <span>{channel?.subscribers?.length} subscribers</span>
                <span className="hidden sm:inline">•</span>
                <span>{channel?.videos?.length} videos</span>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-3 sm:mb-4 max-w-2xl mx-auto sm:mx-0 line-clamp-2 sm:line-clamp-none">
                {channel.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={openEditModal}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 sm:px-6 py-2 rounded-full font-medium transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Channel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                <div className="flex items-center gap-2 sm:gap-3">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                    <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-700 sticky top-0 bg-black z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 sm:py-4 px-1 sm:px-2 border-b-2 whitespace-nowrap transition-colors text-sm sm:text-base ${activeTab === tab
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-300 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {activeTab === 'HOME' && (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Latest Video
              </h2>
              {channel?.videos?.length > 0 ? (
                (() => {
                  const latestvideo = channel?.videos[channel.videos.length - 1];
                  return (
                    <div key={latestvideo.id} className="bg-gray-900 rounded-xl overflow-hidden w-full sm:max-w-md">
                      <div className="relative">
                        <img
                          src={latestvideo?.thumbnail}
                          alt={latestvideo?.title}
                          className="w-full h-40 sm:h-48 object-cover cursor-pointer"
                          onClick={() => { navigate(`/${encodeURIComponent(latestvideo.publicId)}`); }}
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs sm:text-sm text-white">
                          {latestvideo.duration}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{latestvideo.title}</h3>
                        <div className="text-gray-400 text-xs sm:text-sm flex flex-wrap items-center gap-1 sm:gap-2">
                          <span>{latestvideo.views?.length || 0} views</span>
                          <span>•</span>
                          <span>Category - {latestvideo.category || "General"}</span>
                          <span>•</span>
                          <span>Likes {latestvideo.likes?.length}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteVideo({
                                publicId: latestvideo?.publicId,
                                id: latestvideo._id
                              })
                            }}
                            disabled={isPending}
                            className="mt-2 px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-60"
                          >
                            {isPending ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-gray-400 text-sm sm:text-base">No videos uploaded yet</p>
              )}
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Popular Videos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {channel?.videos?.slice(1, 4).map((video) => (
                  <div key={video?._id} onClick={() => { navigate(`/${encodeURIComponent(video.publicId)}`); }} className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="relative">
                      <img
                        src={video?.thumbnail}
                        alt={video?.title}
                        className="w-full h-40 sm:h-48 object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs sm:text-sm">
                        {video?.duration}
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{video.title}</h3>
                      <div className="text-gray-400 text-xs sm:text-sm">
                        {video.views.length || 0} views • Category - {video?.category || "General"}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteVideo({
                              publicId: video?.publicId,
                              id: video._id
                            })
                          }}
                          disabled={isPending}
                          className="mt-2 px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-60"
                        >
                          {isPending ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'VIDEOS' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
              <h2 className="text-lg sm:text-xl font-bold">Videos</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {channel?.videos?.map((video) => (
                <div key={video?.id} onClick={() => { navigate(`/${encodeURIComponent(video.publicId)}`); }} className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="relative">
                    <img
                      src={video?.thumbnail}
                      alt={video?.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs sm:text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{video?.title}</h3>
                    <div className="text-gray-400 text-xs sm:text-sm mb-2">
                      {video?.views.length} views • {video?.createdAt.slice(0, 10)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVideo({
                            publicId: video?.publicId,
                            id: video._id
                          })
                        }}
                        disabled={isPending}
                        className="mt-2 px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-60"
                      >
                        {isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ABOUT' && (
          <div className="max-w-4xl">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">About</h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Description</h3>
                <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">{channel?.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold mb-3 text-sm sm:text-base">Channel Stats</h3>
                  <div className="space-y-2 text-gray-300 text-xs sm:text-sm">
                    <p>Joined: {createdate}</p>
                    <p>Total views: {totalview}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamXChannelPage;