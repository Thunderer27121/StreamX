import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from './usercontext.jsx';
import { useQuery } from '@tanstack/react-query';


const videocontext = createContext();
export const VideoProvider = ({ children }) => {
    const { user } = useUser();
    const {data , isLoading, isError , error} = useQuery({
        queryKey : ['video', user],
        queryFn : async () => {
        const response = await axios.get("http://localhost:5000/api/dbvideo/getall");
        const videoResponse = response.data.videos;
        const statusResponse = response.data.message;
        console.log(statusResponse);
        return videoResponse;
    },
    refetchInterval : 2000
})
    

    return (
        <videocontext.Provider value={{Videos : data, isLoading, isError , error}}>
            { children}
        </videocontext.Provider>
    )
}

export const useVideo = ()=> useContext(videocontext);