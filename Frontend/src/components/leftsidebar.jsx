import { Link } from "react-router-dom"

const Leftsidebar = ({sidebarOpen, setSidebarOpen}) => {
  return (
          <div
        className={`fixed top-0 left-0 w-50 h-full p-2 bg-gray-900 border-r border-gray-700 shadow-lg z-10 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col mt-16 px-4 space-y-3 relative">
          <button onClick={()=>{setSidebarOpen(false)}} className="text-white p-1 rounded hover:bg-gray-500 absolute top-1 right-1">❌</button>
          <Link
            to={"/"}
            className="text-white text-center w-20 font-semibold  py-2 px-2 rounded hover:bg-gray-800 hover:text-orange-500 transition-colors"
          >
            Home
          </Link>
          <Link
            to={"/videos/trending"}
            className="text-white text-center w-20 font-semibold py-2 px-2 rounded hover:bg-gray-800 hover:text-orange-500 transition-colors"
          >
            Trending
          </Link>
          <Link
            to={"/videos/music"}
            className="text-white text-center w-20 font-semibold py-2 px-2 rounded hover:bg-gray-800 hover:text-orange-500 transition-colors"
          >
            Music
          </Link>
          <Link
            to={"/videos/gaming"}
            className="text-white text-center w-20 font-semibold py-2 px-2 rounded hover:bg-gray-800 hover:text-orange-500 transition-colors"
          >
            Gaming
          </Link>
        </div>
      </div>
  )
}

export default Leftsidebar