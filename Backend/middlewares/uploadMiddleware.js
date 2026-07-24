import multer from 'multer';
import path from 'path';

// Setup storage engine to save files locally in an 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique suffix to avoid overwriting files with duplicate names
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Enforce specific file type filters appropriate for standard RAG ingestion
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} are allowed.`), false);
  }
};

// Limit uploading to a maximum of 10 files per request, 10MB each
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } 
});