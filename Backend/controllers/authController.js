import { redis } from "../db/redis.js";
import { User} from "../models/userModal.js";
import fetch from "node-fetch";
import mongoose from "mongoose";


 export async function loggin(req, res) {
  const { code } = req.body;
  try {
    const params = new URLSearchParams({
      code,
      client_id: process.env.google_client_id,
      client_secret: process.env.google_client_secret,
      redirect_uri: "https://stream-x-mu.vercel.app", 
      grant_type: "authorization_code",
    });

    // Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const tokens = await tokenRes.json();

   const cachedProfile = await redis.get(`google:user:${code}`);
    if (cachedProfile) {
      console.log("Serving user info from Redis cache ");
      return res.json(JSON.parse(cachedProfile));
    }

    // Fetch user info with access token
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const profile = await userRes.json();
    const {email , sub , name , picture} = profile;

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = await User.create({
        googleId: sub,
        name,
        email,
        picture,
      });
    } else {
      // Optional: update profile picture if changed
      if (user.picture !== picture) {
        user.picture = picture;
        await user.save();
      }
    }

    // Step 5: Cache user profile in Redis for 6 hours
    await redis.set(`google:user:${sub}`, JSON.stringify(user), "EX", 3600 * 6);

    console.log("User info cached in Redis ✅");
    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
};



export async function getpfp(req, res) {
  try {
    const { id } = req.params;

const user = await User.findOne(
  mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : { googleId: id }
);
    if (!user || !user.picture) {
      return res.status(404).send("User or picture not found");
    }

    // Fetch the image from Google
    const response = await fetch(user.picture);
    if (!response.ok) {
      return res.status(500).send("Failed to fetch Google image");
    }

    // Convert to buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Set the correct content type
    res.set("Content-Type", "image/jpeg");
    res.send(buffer);

  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).send("Internal Server Error");
  }
}