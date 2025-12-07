import axios from "axios";

export function useViews(video, userId) {
  const handleView = async (currentTime) => {
    if (currentTime > 5) {
      await axios.get("http://localhost:5000/api/views/", {
        params: { userId, videoId: video?._id }
      });
    }
  };

  return { handleView };
}
