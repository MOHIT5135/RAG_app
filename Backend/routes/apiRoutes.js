import express from "express";
import documentRoutes from "./documentRoute.js";
import chatRoutes from "./chatRoute.js"; 

const router = express.Router();

router.use("/documents", documentRoutes);
router.use("/chat", chatRoutes); 

export default router;