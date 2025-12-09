import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer } from 'react-toastify'
import { UserProvider } from './contexts/usercontext.jsx'
import { ChannelProvider } from './contexts/channelContext.jsx'
import { VideoProvider } from './contexts/videocontext.jsx';
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"
const queryclient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_client_id}`}>
      <ToastContainer position='top-center' />
      <UserProvider>
       <QueryClientProvider client={queryclient}>
        <VideoProvider>
          <ChannelProvider>
            <App />
          </ChannelProvider>
        </VideoProvider>
        </QueryClientProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
)
