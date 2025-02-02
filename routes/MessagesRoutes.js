import { Router } from "express";
import { getMessages, uploadFiles } from "../controllers/messagescontroller.js";
import verifytoken from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const messagesRoutes = Router();
const upload = multer({dest:"uploads/files"});

messagesRoutes.post('/get-messages',verifytoken,getMessages)
messagesRoutes.post('/upload-files',verifytoken,upload.single('file'),uploadFiles)


export default messagesRoutes;