import Redis from "ioredis";
import dotenv from "dotenv";


dotenv.config();
export const redis = new Redis(process.env.Redis_url);

redis.on("connect", ()=>{console.log("redis cloud databse connected")});
redis.on("error", ()=>{console.log("error while connecting to redis cloud database")});
