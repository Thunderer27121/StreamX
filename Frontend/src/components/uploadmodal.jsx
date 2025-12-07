import { useState } from "react";
import { Upload, X, Film, FileText, Check, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { useChannel } from "../contexts/channelContext";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/usercontext";

export default function UploadModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [category, setcategory] = useState("");
  const {channel}= useChannel();
  const user = useUser();
  const queryclient = useQueryClient();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!videoFile) return;

  const formData = new FormData();
  formData.append("video", videoFile);
 

  setProgress(0);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_api_base_url}/api/video/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 90) / p.total); 
          setProgress(percent);
        },
      }
    );
    const {public_id , duration , url } = res.data.response;
    console.log(res.data.response);
    const videodata = {
      title : title,
      description: description,
      videoUrl: url,
      publicId : public_id,
      duration : duration > 60 ? `${Math.floor(duration/60)} min ${Math.floor(duration%60)} sec` : `${Math.floor(duration)} sec`,
      uploadedBy : channel._id,
      category: category
    }
    console.log(videodata);
    try {
      setProgress(95)
      const videores = await axios.post(`${import.meta.env.VITE_api_base_url}/api/dbvideo/videoupload`,videodata);
      console.log(videores.data);
    } catch (err) {
      console.log("error in uploading video to database", err.response?.data || err.message);
      setProgress(0);
    }
    await queryclient.invalidateQueries({
        queryKey: ["channel", user?.googleId],
      });
    setProgress(100); 
    
    toast.success("Upload successful!");
    onClose();
  } catch (err) {
    console.error(err);
    toast.error("Upload failed");
    setProgress(0);
  }
};


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 60 * 1024 * 1024) {
      toast.error("Video exceeds 60 MB limit");
      return;
    }

    setVideoFile(file);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-blue-950 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gradient-to-tl from-blue-300 to-blue-100 w-full h-full sm:h-auto sm:w-auto sm:max-h-[90vh] max-w-5xl rounded-none sm:rounded-3xl shadow-2xl relative overflow-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated gradient header */}
        <motion.div
          className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-4 sm:p-6 pb-6 sm:pb-8 relative overflow-hidden sm:sticky sm:top-0 z-10"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-black hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <X size={20} />
          </motion.button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-xl sm:rounded-2xl"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Upload className="" size={24} />
            </motion.div>
            <div>
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl sm:text-2xl font-bold text-white"
              >
                Upload Video
              </motion.h2>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-opacity-90 text-xs sm:text-sm"
              >
                Share your content with the world
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8" encType="multipart/form-data">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Form Fields */}
            <div className="flex-1 space-y-4 sm:space-y-5">
              {/* Title input */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Film size={16} className="text-violet-600" />
                  Video Title
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  placeholder="Enter an engaging title..."
                  className="w-full border-2 border-gray-500 p-2.5 sm:p-3 rounded-xl focus:border-violet-500 focus:outline-none transition-all duration-200 text-sm sm:text-base text-black"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </motion.div>

              {/* Description textarea */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} className="text-violet-600" />
                  Description
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  placeholder="Tell viewers about your video..."
                  className="w-full border-2 border-gray-500 p-2.5 sm:p-3 rounded-xl focus:border-violet-500 focus:outline-none transition-all duration-200 min-h-[80px] lg:min-h-[120px] resize-none text-sm sm:text-base text-black"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </motion.div>

              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-opacity-90">
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Select a Category
                </label>
                <div className="relative">
                  <select onChange={(e)=> setcategory(e.target.value)}
                    id="category" 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 bg-white border-2 border-purple-200 rounded-xl 
                           focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 
                           transition-all duration-300 ease-in-out appearance-none cursor-pointer
                           hover:border-purple-300 shadow-sm font-medium"
                  >
                    <option value="" className="text-gray-400">Choose a category...</option>
                    <option value="Entertainment" className="py-2">🎭 Entertainment</option>
                    <option value="Education" className="py-2">📚 Education</option>
                    <option value="Music" className="py-2">🎵 Music</option>
                    <option value="Gaming" className="py-2">🎮 Gaming</option>
                    <option value="Sports" className="py-2">⚽ Sports</option>
                    <option value="News" className="py-2">📰 News</option>
                    <option value="Others" className="py-2">✨ Others</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 text-purple-500">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">Pick your favorite content category</p>
              </div>
            </div>

            {/* Right Column - File Upload */}
            <div className="flex-1 space-y-4 sm:space-y-5">
              {/* File upload area */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Video size={16} className="text-violet-600" />
                  Video File
                </label>
                
                <motion.div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  animate={{
                    borderColor: isDragging ? "#7c3aed" : "#e5e7eb",
                    backgroundColor: isDragging ? "#f5f3ff" : "#ffffff",
                  }}
                  className="border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-12 text-center cursor-pointer transition-all duration-200 h-full min-h-[250px] lg:min-h-[400px] flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                    name="video"
                    required
                  />
                  {formatFileSize(videoFile?.size)>60?
                  <span className="text-red-500 text-xs sm:text-sm mb-2">file size cannot be larger than 60 mb</span>: <span className="text-green-500 text-xs sm:text-sm mb-2">upload the file</span>}
                  <label htmlFor="video-upload" className="cursor-pointer w-full">
                    <AnimatePresence mode="wait">
                      {videoFile ? (
                        <motion.div
                          key="file-selected"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex flex-col items-center justify-center gap-3 sm:gap-4"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="bg-green-100 p-3 sm:p-4 rounded-full"
                          >
                            {formatFileSize(videoFile?.size)>60?
                            <X className="text-red-600" size={28}/>:
                            <Check className="text-green-600" size={28} />
                          }
                          </motion.div>
                          <div className="text-center w-full px-4">
                            <p className="font-semibold text-gray-800 text-sm sm:text-base break-words">{videoFile.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">{formatFileSize(videoFile.size)+`mb`}</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="no-file"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex flex-col items-center"
                        >
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="inline-block mb-3 sm:mb-4"
                          >
                            <Upload className="text-gray-400 mx-auto" size={40} />
                          </motion.div>
                          <p className="text-gray-600 font-semibold text-base sm:text-lg mb-2">
                            Drag & drop your video here
                          </p>
                          <p className="text-sm sm:text-base text-gray-400 mt-1">or click to browse</p>
                          <p className="text-xs text-gray-400 mt-4">Maximum file size: 60 MB</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </label>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(124, 58, 237, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
          >
          {progress == 0 ? "Upload video": <span>Uploading: {progress}%</span>}
            
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}