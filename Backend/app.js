import express from 'express';
import fs from 'fs';
import cors from 'cors'
import documentRoutes from './routes/documentRoute.js';

const app = express();

// Enable CORS so your frontend (e.g., http://localhost:3000) can talk to your backend
app.use(cors({
  origin: 'http://localhost:5000', // Change this to your exact frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));

// Automatically generate target storage directory if missing locally
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use(express.json());

// Bind the router endpoints
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server executing smoothly on port ${PORT}`));
