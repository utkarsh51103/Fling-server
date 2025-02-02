import { Router } from "express";
import verifytoken from "../middlewares/AuthMiddleware.js";
import { createChannel , getChannel, getChannelMessages} from "../controllers/channelcontroller.js";

const channelRoutes = Router();

channelRoutes.post('/create-Channel',verifytoken,createChannel)
channelRoutes.get('/get-channels',verifytoken,getChannel)
channelRoutes.get('/get-channel-messages/:channelId',verifytoken,getChannelMessages)

export default channelRoutes; 