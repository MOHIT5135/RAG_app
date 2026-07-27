import dotenv from 'dotenv';
dotenv.config(); // must be first, before any other local imports
import express from 'express';
import fs from 'fs';
import cors from 'cors'

import apiRoutes from "./routes/apiRoutes.js";
import documentRoutes from './routes/documentRoute.js';
import { connectDB } from './config/db.js';
import { checkHeartbeat } from './config/chroma.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';


if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env file");
}

// Establish core database infrastructure connection
connectDB();
checkHeartbeat();

const app = express();

// Enable CORS so your frontend (e.g., http://localhost:3000) can talk to your backend
app.use(cors({
    origin: 'http://localhost:5173', // Change this to your exact frontend URL
    methods: ['GET', 'POST'],
    credentials: true
}));

// Global Core Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Automatically generate target storage directory if missing locally
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

//------------------------------------------ API ROUTES --------------------------------------------------------

// Register all API routes
app.use("/api", apiRoutes);

//----------------------------------- Existing Document Routes --------------------------------------------------

app.use('/api/v1/documents', documentRoutes);



// ----------------------------------------- 404 Handler --------------------------------------------------------

// Fallback Route for non-existent Endpoints
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Requested resource not found: ${req.originalUrl}`));
});

//---------------------------------------------------------------------------------------------------------------

// Global Error Handler

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server executing smoothly on port ${PORT}`));
