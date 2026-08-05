import express from "express";

import { askQuestion } from "../controllers/chat.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, askQuestion);

export default router;