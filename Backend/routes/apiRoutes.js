// Import Express
import express from "express";

// Import feature routes
import testRoutes from "./test.routes.js";
// In the future we'll also import:
// import authRoutes from "./auth.routes.js";
// import uploadRoutes from "./upload.routes.js";
// import chatRoutes from "./chat.routes.js";

// Create a router instance
const router = express.Router();

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All application routes are registered here.
| This keeps app.js clean and makes the project scalable.
|--------------------------------------------------------------------------
*/

// Health check route
router.use("/test", testRoutes);

// Future routes
// router.use("/auth", authRoutes);
// router.use("/upload", uploadRoutes);
// router.use("/chat", chatRoutes);

// Export router
export default router;