import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../contexts/usercontext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginUser } = useUser(); 
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const res = await fetch(`${import.meta.env.VITE_api_base_url}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeResponse.code }),
      });

      const userInfo = await res.json();
      await loginUser({
        ...userInfo,
        googleId: userInfo.googleId || userInfo.sub || userInfo.id || userInfo._id,
      });
      navigate("/");

    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="p-8 bg-gray-900 border border-gray-700 rounded-xl shadow-lg hover:bg-gray-800 transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Sign in to StreamX
        </h2>

        <button
          onClick={() => login()}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
