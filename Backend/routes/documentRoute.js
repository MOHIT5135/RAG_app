import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { extractTextFromFile } from "../services/documentProcessor.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| POST /api/v1/documents/upload
|--------------------------------------------------------------------------
| Upload one or more documents.
| Maximum Files : 10
| Maximum Size  : 10 MB per file
| Allowed Types : PDF, DOCX, DOC, TXT
|--------------------------------------------------------------------------
*/

/**
 * ======================================================
 * Upload Documents
 * ======================================================
 */
router.post("/upload", upload.array("documents", 10), async (req, res) => {

    try {

        // Check if files exist
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files were uploaded."
            });
        }

        const processedFiles = [];

        // Loop through every uploaded file
        for (const file of req.files) {

            // Extract text from uploaded file
            const extractedText = await extractTextFromFile(file.path);

            // Print first few characters in terminal
            console.log("\n======================================");
            console.log(`File : ${file.originalname}`);
            console.log("Extracted Text Preview:");
            console.log(extractedText.substring(0, 500));
            console.log("======================================\n");

            processedFiles.push({
                originalName: file.originalname,
                filename: file.filename,
                size: file.size,
                extractedCharacters: extractedText.length,

                // Temporary (only for testing)
                extractedText
            });
        }

        return res.status(200).json({
            success: true,
            message: "Text extracted successfully.",
            totalFiles: processedFiles.length,
            files: processedFiles
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


/**
 * ======================================================
 * Multer Error Handler
 * ======================================================
 */
router.use((err, req, res, next) => {

    if (err instanceof multer.MulterError) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

    if (err) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

    next();

});

export default router;