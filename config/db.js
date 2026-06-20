import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("Error: MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  // Aggressively strip multiple layers of quotes and whitespace
  // This handles cases like: '"url"', "'url'", '"url', 'url"', etc.
  uri = uri.trim().replace(/^["']+|["']+$/g, '');

  try {
    await mongoose.connect(uri);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
