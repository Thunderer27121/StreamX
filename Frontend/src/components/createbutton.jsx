import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Video } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../contexts/usercontext.jsx";
import { useChannel } from "../contexts/channelContext.jsx";
import UploadModal from "./uploadmodal.jsx";

export default function CreateButton() {
  const { user } = useUser();
  const { channel } = useChannel();
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCreateClick = () => {
    if (user.googleId != channel?.googleId) {
      toast.error("Create a channel first");
      return;
    }
    setShowMenu(!showMenu);
  };

  const handleUploadClick = () => {
    setOpen(true);
    setShowMenu(false);
  };

  return (
    <>
      {/* Main Create Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="absolute bottom-16 right-0 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden mb-2"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 min-w-[200px]">
                <motion.button
                  onClick={handleUploadClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-colors text-left"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Video size={20} />
                  <span className="font-medium">Upload Video</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleCreateClick}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center gap-2 font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: showMenu
              ? "0 0 30px rgba(249, 115, 22, 0.6)"
              : "0 10px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          <motion.div
            animate={{ rotate: showMenu ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus size={24} />
          </motion.div>
          <span>Create</span>
        </motion.button>
      </div>

      {/* Upload Modal Placeholder */}
      {open && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div 
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Upload Video</h3>
            <p className="text-gray-400 mb-4">Replace this with your UploadModal component</p>
            <button
              onClick={() => setOpen(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
      {open && <UploadModal onClose={() => setOpen(false)} />}
     
    </>
  );
}
