import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import mongoose from "mongoose";
import app from "../src/app";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};
