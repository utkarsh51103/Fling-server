import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messageSchema.js";
import Channel from "./models/channelModel.js";

const setupsocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const sendSocketID = userSocketMap.get(message.sender);
    const recipientSocketID = userSocketMap.get(message.recipient);

    const createdmessage = await Message.create(message);

    const messageData = await Message.findById(createdmessage.id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketID) {
      io.to(recipientSocketID).emit("recieveMessage", messageData);
    }
    if (sendSocketID) {
      io.to(sendSocketID).emit("recieveMessage", messageData);
    }
  };

  const sendChannelmessage = async(message) =>{
     const {channelId,sender,content,messageType,fileURL} = message;

     const createMessage = await Message.create({
      sender,
      recipient:null,
      content,
      messageType,
      timeStamp:new Date(),
      fileURL,
     })

     const messageData = await Message.findById(createMessage._id).populate("sender","id email firstName lastName image color")
     .exec();

     await Channel.findByIdAndUpdate(channelId,{
      $push:{messages:createMessage._id}
     })

     const channel = await Channel.findById(channelId).populate("members")
     
     const finaldata = {...messageData._doc,channelId:channel._id}
     if(channel && channel.members){
      channel.members.forEach(member =>{
        const memberSocketID = userSocketMap.get(member._id.toString());
        if(memberSocketID){
          io.to(memberSocketID).emit('recieve-channel-data',finaldata);
        }
      })
      const adminSocketID = userSocketMap.get(channel.admin._id.toString());
        if(adminSocketID){
          io.to(adminSocketID).emit('recieve-channel-data',finaldata);
        }
     }

  }

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with Socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during Connection");
    }

    socket.on("sendMessage", sendMessage);
    socket.on('send-channel-message',sendChannelmessage);
    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });
};

export default setupsocket;
