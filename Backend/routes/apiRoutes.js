import express from "express";
import testRoutes from "./test.routes.js";
// In the future we'll also import:
// import authRoutes from "./auth.routes.js";
// import uploadRoutes from "./upload.routes.js";
// import chatRoutes from "./chat.routes.js";

// Create a router instance
const router = express.Router();

// Health check route
router.use("/test", testRoutes);

// Future routes
// router.use("/auth", authRoutes);
// router.use("/upload", uploadRoutes);
// router.use("/chat", chatRoutes);

export default router;