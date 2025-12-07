import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/Routes";
import SplashScreen from "./components/splashscreen";
import Login from "./components/Login";
import ProfileSidebar from "./components/rightprofilebar";
import Leftsidebar from "./components/leftsidebar";
import CreateChannelModal from "./components/ChannelModal";
import { useUser } from "./contexts/usercontext";
import CreateButton from "./components/createbutton";
import { useNavigate } from "react-router-dom";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [rightbarOpen, setRightbarOpen] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const hassplashed = sessionStorage.getItem("splash");
    if (!hassplashed) {
      setLoading(true);
      sessionStorage.setItem("splash", "true");
    }
  }, []);


  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div
      className={"min-h-screen transition-colors duration-300 bg-black text-white"}
    >

      {/* Navbar */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setRightbarOpen={setRightbarOpen}
      />

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-50" : "ml-0"
        } pt-16`}
      >
        <AppRoutes />
      </div>

      {/* Left Sidebar */}
      <Leftsidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Right side profile bar */}
      {rightbarOpen && (
        <ProfileSidebar
          setRightbarOpen={setRightbarOpen}
          rightbarOpen={rightbarOpen}
          setisOpen={setisOpen}
        />
      )}

      {/* Create channel modal */}
      {isOpen && (
        <CreateChannelModal isOpen={isOpen} setisOpen={setisOpen} />
      )}

      <CreateButton />
    </div>
  );
}

export default App;
