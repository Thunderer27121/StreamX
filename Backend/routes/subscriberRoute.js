import express from "express"
import { addsub , removesub} from "../controllers/subscriberController.js";

const router = express.Router();

router.post("/addsub", addsub);
router.post("/removesub", removesub);

export default router;