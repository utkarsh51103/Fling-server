import mongoose from "mongoose";
import User from "../models/userschema.js";
import Messages from "../models/messageSchema.js";


const searchcontact = async(req,res,next)=>{
try {
    const {searchTerm} = req.body;
    if(searchTerm === undefined || searchTerm === null){
        console.log(searchTerm)
        return res.status(404).json({
            message: "Search Term is Required",
        })
    }

    const cleansearchterm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,"\\$&"
    )

    const regex = new RegExp(cleansearchterm,"i")

    const contact = await User.find({
        $and : [{ _id: {$ne: req.userid } },
          {  
        $or: [{firstName:regex},{lastName:regex},{email:regex}],
     },
    ],
    })
    return res.status(200).json({contact})

} catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
}
}

const getContactsForDmList = async(req,res,next)=>{
    try {
       let {userid} = req;
       userid = new mongoose.Types.ObjectId(userid); 
    
       const contacts = await Messages.aggregate([
        {$match:{
            $or:[
                {sender:userid},{recipient:userid},
            ],
        },
    } ,   {
        $sort:{timeStamp:-1},
    },
    {$group:{
        _id:{
            $cond:{
                if:{$eq:["$sender",userid]},
                then:"$recipient",
                else:"$sender"
            }
        },
        lastMessageTime: {$first: "$timeStamp"},
    },},
      {$lookup:{
        from:"users",
        localField:"_id",
        foreignField:"_id",
        as:"contactInfo",
      },},
      {
        $unwind: "$contactInfo",  
      },
      {
        $project:{
            _id: 1,
            lastMessageTime:1,
            email:"$contactInfo.email",
            firstName:"$contactInfo.firstName",
            lastName:"$contactInfo.lastName",
            image:"$contactInfo.image",
            color: "$contactInfo.color",
        }
      }
       ])
       res.status(200).json({contacts});
    
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
    }

    const getAllcontact = async(req,res,next)=>{
        try {
  
            const users = await User.find({_id: {$ne: req.userid}},
                "firstName lastName _id"
            )
            
            const contact = users.map((user)=>{
                label:user.firstName ? `${user.firstName} ${user.lastName}` : user.email;
            })
            
            return res.status(200).json({contact})
        
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"Internal Server Error"})
        }
        }

export {searchcontact, getContactsForDmList, getAllcontact}