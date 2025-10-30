import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import roleRoutes from "./routes/roles";
import permissionRoutes from "./routes/permissions";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
app.use("/api/auth", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/user-management";
    
    // Log connection attempt (mask password for security)
    const maskedURI = mongoURI.replace(/(mongodb\+srv?:\/\/[^:]+:)([^@]+)(@.+)/, '$1***$3');
    console.log(`Attempting to connect to MongoDB: ${maskedURI}`);
    
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB successfully");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.error("\n💡 Troubleshooting tips:");
    console.error("1. Check your MONGODB_URI environment variable");
    console.error("2. Verify MongoDB Atlas credentials are correct");
    console.error("3. Ensure special characters in password are URL-encoded");
    console.error("4. Check network access IP whitelist in MongoDB Atlas");
    console.error("5. Verify the database user has proper permissions\n");
    process.exit(1);
  }
};

connectDB();

export default app;
