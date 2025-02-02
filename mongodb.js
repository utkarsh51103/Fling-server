import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    
    await mongoose.connect(
      'mongodb+srv://utkarshsharmabd:1IP1W1Ya6f9mZ44A@chat-app-data.ucgw6.mongodb.net/?retryWrites=true&w=majority&appName=Chat-App-Data',
    );
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;
