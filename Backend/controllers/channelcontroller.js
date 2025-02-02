import { populate } from "dotenv";
import Channel from "../models/channelModel.js";
import User from "../models/userschema.js";
import mongoose from "mongoose";
import Message from "../models/messageSchema.js";

const createChannel = async(req,res,next)=>{
    try {
        const {name, members} = req.body;
     const userid = req.userid;
     
     const admin = await User.findById(userid);

     if(!admin){
        return res.status(400).json({
            message:"Admin not found"
        })
     }

     const validMembers = await User.find({
        _id: {$in: members}
     })

     if(validMembers.length !== members.length){
        return res.status(400).json({
            message:"Invalid Members"
        })
     }
     
     const newChannel = await Channel({
        name,
        members,
        admin: userid
     })

     await newChannel.save();
     return res.status(201).json({channel: newChannel})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getChannel = async(req,res,next)=>{
    try {
        const userid = new mongoose.Types.ObjectId(req.userid);
        const channel =  await Channel.find({
            $or:[{admin:userid},{members:userid}]
        }).sort({UpdatedAt:-1});

        return res.status(200).json({channel: channel});

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getChannelMessages = async(req,res,next)=>{
    try {
        const {channelId} = req.params;
        
        const channel = await Channel.findById(channelId).populate({
            path:"messages",populate:{
                path:'sender',select:"firstName lastName email _id image color"
            }
        })

        if(!channel){
            return res.status(404).json({message:"Channel not found"})
        }   
        const messages = channel.messages;
        return res.status(200).json({messages})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export { createChannel, getChannel, getChannelMessages }