import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useChannel } from "../contexts/channelContext";
import { useUser } from "../contexts/usercontext";

export default function CreateChannelModal({ isOpen, setisOpen}) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [description, setDescription] = useState("");
  const {user} = useUser();
  const {googleId, email , picture} = user;
  const {getChannel} = useChannel();

  const oncreate = async () => {
  try {
    if( !name || !handle || !description){
      toast.error("Fill all fields to create the channel");
      return;
    }
    const data = { googleId, name, handle, description, picture ,email};
    const response = await axios.post(`${import.meta.env.VITE_api_base_url}/api/channel/create`, data);

    if (response.data.error) {
      toast.error(response.data.error);
    } else {
      toast.success("Channel created successfully");
      navigate("/mychannel");
      setisOpen(false);
      getChannel();
    }
  } catch (error) {
    console.error(error);
    toast.error("Error while creating the channel");
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    oncreate();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-4">Create Your Channel</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Channel Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                required 
              />
              <input 
                type="text" 
                placeholder="@handle" 
                value={handle} 
                onChange={(e) => setHandle(e.target.value)} 
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                required 
              />
              <textarea 
                placeholder="Channel Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              />
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={()=>{setisOpen(false)}} 
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
