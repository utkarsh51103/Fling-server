import Messages from "../models/messageSchema.js";
import {mkdir, mkdirSync, renameSync} from 'fs'

const getMessages = async(req,res,next)=>{
     try {

        const user1 = req.userid;
        const user2 = req.body.id;

        if(!user1 || !user2){
            return res.status(400).json({
                message: "Both Users are required"
            })
        }

        const messages = await Messages.find({
            $or:[
                {sender:user1,recipient:user2},
                {sender:user2,recipient:user1}
            ]
        }).sort({timeStamp:1})
        return res.status(200).json({messages})
        
     } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
     }
}

const uploadFiles = async(req,res,next)=>{
    try {
          if(!req.file){
            return res.status(400).json({
                message: "File not found"
            })
          }
          const date = Date.now();
          let filedir = `uploads/files/${date}`
          let filename = `${filedir}/${req.file.originalname}`

          mkdirSync(filedir,{recursive:true});
          renameSync(req.file.path,filename)

          return res.status(200).json({filePath: filename});
    } catch (error) {
       console.log(error);
       return res.status(500).json({ message: "Internal Server Error" });
    }
}

export {getMessages, uploadFiles}