import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
   name:{
    type: 'string',
    required: true
   },
   members:[{type:mongoose.Schema.ObjectId, ref:"user",required:true
   }]
   ,
   admin:{
    type:mongoose.Schema.ObjectId, ref:"user",required:true
   },
   messages:[{
    type:mongoose.Schema.ObjectId, ref:"Messages",required:false
   }],
   createdAt:{
    type:Date,
    default: Date.now(),
   },
   UpdatedAt:{
    type:Date,
    default: Date.now(),
   },
})

channelSchema.pre('save',function(next){
    this.UpdatedAt = Date.now();
    next();
});

channelSchema.pre('findOneAndUpdate',function(next){
    this.set({UpdatedAt:Date.now()})
    next();
});

const Channel = new mongoose.model("Channel",channelSchema);
export default Channel;
