import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// 'documents' must match the field key name sent from your front-end form data
router.post('/upload', upload.array('documents', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files were uploaded.' });
    }

    // Capture explicit local disk targets for upcoming processing stages
    const processedFiles = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size
    }));

    // Pass processedFiles to your document processing layer (pdf-parse, mammoth, etc.)
    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully.',
      files: processedFiles
    });
    
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Unified error boundary catching direct Multer limit exceptions cleanly
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

export default router;
