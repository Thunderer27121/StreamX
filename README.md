StreamX — A Full-Stack Video Streaming Platform

StreamX is a modern, full-stack video streaming application inspired by YouTube.
It allows users to upload videos, manage channels, interact through likes & views, and share content through public video links.

Built with the MERN stack + modern UI libraries to deliver smooth, fast, and beautiful video streaming.


---

🚀 Features

🔐 Authentication

Google OAuth login

User profile & channel sync


📤 Video Uploading

Upload videos directly from the browser

Thumbnail selection

Auto-processing & compression on backend

Framer-motion animated modal


🎬 Video Player

Smooth playback with HTML5 video player

Auto-updates views

Like / unlike system

description display


🎞️ Home Feed

Displays latest videos

Infinite scroll / pagination

Fast React Query caching


🧑‍💼 Channel System

Each user gets to create channel

Channel includes:

Channel picture

Bio

Videos uploaded


Channel homepage with videos


🔍 Search

Search videos by title

Search channels

YouTube-style search results page


📤 Share Feature

Share button copies full video link

Direct links open the video page



---

🏗️ Tech Stack

Frontend

React (Vite)

React Router

Tailwind CSS

Framer Motion

React Query

Lucide Icons

Axios


Backend

Node.js

Express.js

MongoDB + Mongoose

Google OAuth


Deployment

Frontend: Vercel

Backend: Render 

Database: Mongo Atlas



---

🔧 Installation

Clone the Repo

git clone https://github.com/Thunderer27121/StreamX
cd streamx


---

Frontend Setup

cd frontend
npm install
npm run dev

Create .env with:

VITE_BACKEND_URL=https://your-backend-url
VITE_GOOGLE_CLIENT_ID=your_google_client_id


---

Backend Setup

cd backend
npm install
npm run dev

Create .env with:

MONGO_URL=your_mongodb_url
GOOGLE_CLIENT_ID=your_google_client_id


---

🌐 Routing Fix for Sharing

To make shared video links work:

Vercel (Frontend)

Add vercel.json:

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
