import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";

import apiRoutes from "./routes/apiRoutes.js";
import chromaCollection from "./chromaCollection.js";

import { connectDB } from "./config/db.js";
import { checkHeartbeat } from "./config/chroma.js";

import { requestLogger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import historyRoutes from "./routes/history.routes.js";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing in .env file");
}

/**
 * ==========================================================
 * Database Connections
 * ==========================================================
 */
connectDB();
checkHeartbeat();

const app = express();

/**
 * ==========================================================
 * CORS Configuration
 * ==========================================================
 */
app.use(
  cors({
    origin: "http://localhost:5173",
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
 * Temporary Route
 * ChromaDB Collection Viewer
 * ==========================================================
 */
app.use("/all-documents", chromaCollection);

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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});