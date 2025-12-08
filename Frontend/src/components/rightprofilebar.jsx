import { motion, AnimatePresence } from "framer-motion";
import { X, User, UserCheck, LogOut, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/usercontext.jsx";
import { useChannel } from "../contexts/channelContext.jsx";
import { useState } from "react";

export default function ProfileSidebar({
  rightbarOpen,
  setRightbarOpen,
  setisOpen,
}) {
  const navigate = useNavigate();
  const { user, savedAccounts, switchAccount, logout } = useUser();
  const { channel } = useChannel();
  const [showAccountList, setShowAccountList] = useState(false);

  useEffect(() => {
  }, [channel])
  
  const Logout = () => {
    logout();
    setRightbarOpen(false);
  };

  const totalviews =
    channel?.videos?.reduce(
      (sum, video) => sum + (video?.views?.length || 0),
      0
    ) || 0;

  const handleSwitchAccountClick = () => {
    setShowAccountList((prev) => !prev);
  };

  const handleSelectAccount = (acc) => {
    const id = acc.googleId || acc._id || acc.id || acc.sub;
    if (!id) return;
    switchAccount(id);
    navigate("/");
    setRightbarOpen(false);
    setShowAccountList(false);
  };

  const otherAccounts =
    savedAccounts?.filter(
      (acc) =>
        (acc.googleId || acc._id || acc.id || acc.sub) !==
        (user?.googleId || user?._id || user?.id || user?.sub)
    ) || [];

  const menuItems = [
    {
      icon: User,
      label: `${channel?.message ? "Create channel" : "My channel"}`,
      action: () => {
        if (channel.message === "channel not found") {
          setisOpen(true);
        } else {
          navigate("/mychannel");
        }
        setRightbarOpen(false);
      },
      color:
         "hover:text-orange-500 hover:bg-gray-800"
        },

    {
      icon: UserCheck,
      label: "Switch Account",
      action: handleSwitchAccountClick,
      color: 
         "hover:text-blue-400 hover:bg-gray-800"
    },
    {
      icon: LogOut,
      label: "Sign Out",
      action: Logout,
      color: "hover:text-red-400 hover:bg-red-900/20",
    },
  ];

  if (!user) return null;

  return (
    <AnimatePresence>
      {rightbarOpen && (
        <>
          {/* Sidebar */}
          <motion.div
            className={`fixed top-0 right-0 h-full w-80 border-l shadow-2xl z-50 flex flex-col transition-colors duration-300 ${
                 "bg-gray-900 border-gray-700 text-white"
            }`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div
              className={`p-6 border-b flex items-center gap-2 relative bg-gradient-to-r transition-colors duration-300 ${
                   "from-gray-800 to-gray-900 border-gray-700"
              }`}
            >
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_api_base_url}/api/auth/profile-pfp/${user._id}`}
                  alt=""
                  className="h-16 min-w-16 rounded-full ring-2 ring-orange-500/50"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{user?.name}</p>
                <p className="text-sm opacity-80">{user?.email}</p>
                <div className="mt-1">
                  {!channel?.message && (
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                      Creator
                    </span>
                  )}
                </div>
              </div>
              <button
                className="p-2 hover:bg-gray-800/40 rounded-full transition-colors text-gray-400 hover:text-white absolute top-2.5 right-2.5"
                onClick={() => setRightbarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Stats Section */}
            {!channel?.message && (
              <div className="p-4 border-b border-gray-700/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div
                    className={`rounded-lg p-3 ${
                       "bg-gray-800" 
                    }`}
                  >
                    <div className="text-lg font-bold">
                      {channel?.videos?.length || 0}
                    </div>
                    <div className="text-xs opacity-70">Videos</div>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                       "bg-gray-800"
                    }`}
                  >
                    <div className="text-lg font-bold">
                      {channel?.subscribers?.length || 0}
                    </div>
                    <div className="text-xs opacity-70">Subscribers</div>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                       "bg-gray-800" 
                    }`}
                  >
                    <div className="text-lg font-bold">{totalviews}</div>
                    <div className="text-xs opacity-70">Views</div>
                  </div>
                </div>
              </div>
            )}

            {/* Menu */}
            <div className="flex-1 p-4">
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                       "text-white" 
                    } ${item.color}`}
                    onClick={item.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Switch Account list */}
              {showAccountList && (
                <div className="mt-4 border-t border-gray-700 pt-3">
                  <p className="text-xs opacity-70 mb-2">
                    Switch to another account
                  </p>

                  <div className="space-y-1 max-h-40 overflow-y-auto" style={{scrollbarWidth :"none"}}>
                    {otherAccounts.map((acc) => (
                      <button
                        key={acc.googleId || acc._id || acc.id || acc.sub}
                        onClick={() => handleSelectAccount(acc)}
                        className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left ${
                           "hover:bg-gray-800"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                          {acc.avatar || acc.profilePictureUrl ? (
                            <img
                              src={acc.avatar || acc.profilePictureUrl}
                              alt={acc.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm text-gray-300">
                              {acc.name?.[0]?.toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm">{acc.name}</span>
                          {acc.email && (
                            <span className="text-xs opacity-70">
                              {acc.email}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}

                    {/* Add another account */}
                    <button
                      onClick={() => {
                        logout();
                        setRightbarOpen(false);
                      }}
                      className="w-full text-xs text-orange-400 hover:bg-gray-800 rounded-lg px-2 py-2 mt-1 text-left"
                    >
                      + Add another account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className={`p-4 border-t bg-gray-800/50 text-center text-xs ${
                "border-gray-700 text-gray-500" 
              }`}
            >
              StreamX Creator Studio
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
