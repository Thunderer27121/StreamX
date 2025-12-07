import mongoose from "mongoose";
import dotenv from "dotenv";
let isconnect = false;

dotenv.config();
export const dbConnect = async()=> {
    try {
        await mongoose.connect(`${process.env.db_url}`);
        isconnect = true;
        console.log("database connected");
    }
    catch(err){
    console.log("databse connection error",err);
    throw err;
    }

}
