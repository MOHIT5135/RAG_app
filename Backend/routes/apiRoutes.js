import express from "express";
import testRoutes from "./test.routes.js";
import documentRoutes from "./documentRoute.js";
import chatRoutes from "./chatRoute.js"; 

const router = express.Router();

router.use("/test", testRoutes);
router.use("/documents", documentRoutes);
router.use("/chat", chatRoutes); 

export default router;