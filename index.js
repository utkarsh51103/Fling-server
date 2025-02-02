import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authroute from './routes/AuthRoute.js';
import contactRoutes from './routes/contactRoutes.js';
import messagesRoutes from './routes/MessagesRoutes.js';
import setupsocket from './socket.js';
import channelRoutes from './routes/ChannelRoutes.js';
import connectDB from './mongodb.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    credentials: true,
}))

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use('/uploads/files',express.static('uploads/files'))

app.use(cookieParser())
app.use(express.json());

app.use('/api/auth',authroute)
app.use('/api/contacts',contactRoutes)
app.use('/api/messages',messagesRoutes)
app.use('/api/channel',channelRoutes)

const port = process.env.PORT || 5002;
// const database = process.env.MONGODB_CONNECTION;

connectDB();

const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

setupsocket(server)

// mongoose.connect(database)
// .then(()=>console.log('Connected to database'))
// .catch((err)=>console.log(err))

