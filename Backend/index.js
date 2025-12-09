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
import compression from "compression";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: `${process.env.origin}`, 
  credentials: true
}));
app.use(compression());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Max-Age", "86400"); 
  next();
});


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
app.use("/api/comments", commentRoute);
app.use("/api/channels",channelUpdateRoute);



const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
server.keepAliveTimeout = 65000;
