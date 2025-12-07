import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useUser } from "../contexts/usercontext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ sidebarOpen, setSidebarOpen, setRightbarOpen }) {

    const { user } = useUser();
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const handleSearch = () => {
        const q = searchValue.trim();
        if (!q) return;
        console.log("function is running");
        navigate(`/search?q=${encodeURIComponent(q)}`);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="w-full bg-gray-900 border-b border-gray-700 shadow-md fixed top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* Left: Burger + Logo */}
                        <div className="flex items-center space-x-2">
                            <button
                                className="p-2 rounded-md hover:bg-gray-800 hover:text-orange-500 transition-colors"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <FaBars size={20} className="text-white" />
                            </button>
                            <div className="flex items-center space-x-1">
                                <div className="w-6 h-6 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                                    X
                                </div>
                                <span className="font-bold text-lg text-white">StreamX</span>
                            </div>
                        </div>

                        {/* Center: Search */}
                        <div className="flex-1 mx-4">
                            <input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e)=>{e.key === "Enter" && handleSearch()}}
                                type="text"
                                placeholder="Search videos..."
                                className="w-full px-4 py-2 rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            />
                        </div>

                        {/* Right: Account */}
                        <div className="relative">
                            {user?.picture && (
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={`http://localhost:5000/api/auth/profile-pfp/${user._id}`}
                                        alt={user?.name || "User"}
                                        className="rounded-full h-10 w-10 cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                                        onClick={() => setRightbarOpen(true)}
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`;
                                        }}
                                    />
                                </div>
                            )}
                        </div>


                    </div>
                </div>
            </nav>


        </>
    );
}