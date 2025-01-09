import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'undefined or missing connection string', { })
    console.log("MongoDB connected")
  } catch (error :unknown) {
    console.error("MongoDB connection error:", error)
    process.exit(1) 
  }
};

export default connectDB;
