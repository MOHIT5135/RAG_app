import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";

import apiRoutes from "./routes/apiRoutes.js";

import { connectDB } from "./config/db.js";

import { requestLogger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import historyRoutes from "./routes/history.routes.js";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is missing");
}

const app = express();

/**
 * ==========================================================
 * CORS Configuration
 * ==========================================================
 */
const allowedOrigins = [
process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

/**
 * ==========================================================
 * Global Middlewares
 * ==========================================================
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

/**
 * ==========================================================
 * Create Upload Directory (If Missing)
 * ==========================================================
 */
if (!fs.existsSync("uploads/documents")) {
  fs.mkdirSync("uploads/documents", {
    recursive: true,
  });
}

/**
 * ==========================================================
 * API Routes
 * ==========================================================
 */
app.use("/api", apiRoutes);
app.use("/api/v1/history", historyRoutes);

/**
 * ==========================================================
 * 404 Route
 * ==========================================================
 */
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Requested resource not found: ${req.originalUrl}`));
});

/**
 * ==========================================================
 * Global Error Handler
 * ==========================================================
 */
app.use(errorHandler);

/**
 * ==========================================================
 * Start Server
 * ==========================================================
 */
/**
 * ==========================================================
 * Start Server
 * ==========================================================
 */

const startServer = async () => {
  try {

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");

    await connectDB();

    // Start Express server
    const PORT = process.env.PORT || 8080;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error(
      `[Startup Error] ${error.message}`
    );

    process.exit(1);
  }
};

startServer();