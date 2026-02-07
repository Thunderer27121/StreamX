import axios from 'axios';
import { createContext, useContext } from 'react'
import { useUser } from './usercontext.jsx';
import { useQuery } from '@tanstack/react-query';


const videocontext = createContext();
export const VideoProvider = ({ children }) => {
    const { user } = useUser();
    const {data , isLoading, isError , error, refetch} = useQuery({
        queryKey : ['videos', user?._id],
        queryFn : async () => {
        const response = await axios.get(`${import.meta.env.VITE_api_base_url}/api/dbvideo/getall`);
        const videoResponse = response.data.videos;
        const statusResponse = response.data.message;
        console.log(statusResponse);
        return videoResponse;
    },
    refetchOnMount : true,
})
    

    return (
        <videocontext.Provider value={{Videos : data, isLoading, isError , error, refetch}}>
            { children}
        </videocontext.Provider>
    )
}

const useVideo = ()=> useContext(videocontext);

export { useVideo };