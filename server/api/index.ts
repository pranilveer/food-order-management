import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import connectDB from "../src/config/db";
import mongoose from "mongoose";

const connPromise = connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});

import serverless from "serverless-http";
import app from "../src/app";

const handler = async (req: any, res: any) => {
  await connPromise;
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ success: false, error: "Database not connected" });
    return;
  }
  return serverless(app)(req, res);
};

export default handler;
