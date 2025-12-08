import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import VideoPlayer from '../pages/videoplayer'
import StreamXChannelPage from '../pages/Mychannnel'
import SearchResults from '../pages/Searchedresults'
import ChannelPage from '../pages/Channelpage'


const AppRoutes = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch" element={<VideoPlayer />} />
          <Route path="/mychannel" element={<StreamXChannelPage/>} />
          <Route path='/videos/:category' element={<Home/>}/>
          <Route path="/search" element={<SearchResults />} />
          <Route path="/channel/:channelId" element={<ChannelPage />} />

        </Routes>
    </div>
  )
}

export default AppRoutes