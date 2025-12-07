import express from "express";
import { getChannel , createchannel} from "../controllers/channelController.js";

const router = express.Router();

router.post("/" , getChannel);
router.post("/create" , createchannel );

export default router;
