import multer from "multer";
import path from "path";

// Configure how uploaded files are stored
const storage = multer.diskStorage({

    // Folder where uploaded documents will be stored
    destination: (req, file, cb) => {
        cb(null, "uploads/documents/");
    },

    // Generate a unique filename to prevent overwriting
    filename: (req, file, cb) => {

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
        );
    }

});

// Validate uploaded files
const fileFilter = (req, file, cb) => {

    // Allowed extensions
    const allowedExtensions = [
        ".pdf",
        ".docx",
        ".doc",
        ".txt",
        ".pptx",
        ".xlsx"
    ];

    // Allowed MIME types
    const allowedMimeTypes = [
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    const isExtensionValid = allowedExtensions.includes(extension);
    const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);

    if (isExtensionValid && isMimeTypeValid) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `Invalid file type. Only ${allowedExtensions.join(", ")} files are allowed.`
            ),
            false
        );
    }

};

// Export configured multer instance
export const upload = multer({

    storage,

    fileFilter,

    limits: {

        // Maximum size per file = 10 MB
        fileSize: 10 * 1024 * 1024

    }

});