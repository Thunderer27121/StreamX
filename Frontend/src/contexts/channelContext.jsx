// src/context/ChannelContext.jsx
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "./usercontext.jsx";

const ChannelContext = createContext();

export function ChannelProvider({ children }) {
  const { user } = useUser();

  // React Query for fetching channel
  const {
    data: channel,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["channel", user?.googleId],
    queryFn: async () => {
      const res = await axios.post("http://localhost:5000/api/channel/", {
        googleId: user.googleId,
      });
      return res.data;
      
    },
    enabled: !!user?.googleId, // only runs when user is logged in
  });

  return (
    <ChannelContext.Provider value={{ channel, isLoading,  error }}>
      {children}
    </ChannelContext.Provider>
  );
}

// Custom Hook
export const useChannel = () => useContext(ChannelContext);
