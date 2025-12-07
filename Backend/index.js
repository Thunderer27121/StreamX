import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {dbConnect} from "./db/db.js"
import loginroute from "./routes/auth.js"
import channelRoute from "./routes/channel.js";
import uploadroute from "./routes/uploadroute.js";
import videoroute from "./routes/videoroute.js";
import subroute from "./routes/subscriberRoute.js";
import viewRoute from "./routes/viewRoute.js";
import likeroute from "./routes/likesroute.js";
import commentRoute from "./routes/commentRoutes.js";
import channelUpdateRoute from "./routes/channelUpdate.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));


await dbConnect();
app.use((req, res, next) => {
  console.log("➡️ Request received:", req.method, req.url);
  next();
});
app.use("/api/auth", loginroute);
app.use("/api/channel" , channelRoute);
app.use("/api/video", uploadroute );
app.use("/api/dbvideo", videoroute);
app.use("/api/sub", subroute);
app.use("/api/views", viewRoute);
app.use("/api/like" , likeroute);
app.use("/api/dbvideo", videoroute);
app.use("/api/comments", commentRoute);
app.use("/api/channels",channelUpdateRoute);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
