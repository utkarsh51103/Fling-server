import mongoose from "mongoose";
import { hash,genSalt } from "bcrypt";


const userschema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    firstName:{
        type:String,
        required:false,
        default:null
    },
    lastName:{
        type:String,
        required:false,
        default:null
    },
    color:{
        type:Number,
        required:false,
        default:0
    },
    profilesetup:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
        default:null
    }    
})

userschema.pre("save", async function(next){
    const salt = await genSalt();
    this.password = await hash(this.password,salt);
    next();
})

export default mongoose.model('user',userschema);