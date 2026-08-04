import express from "express";
import fs from "fs/promises";
import path from "path";
import multer from "multer"; 
import { v4 as uuidv4 } from "uuid";
import { upload } from "../middlewares/uploadMiddleware.js";
import { extractTextFromFile } from "../services/documentProcessor.js";
import { chunkFiles } from "../services/chunkService.js";
import { embedChunkedFiles } from "../services/embeddingService.js";
import { storeVectors } from "../services/vectorService.js";
import Document from "../models/Document.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { deleteDocumentVectors } from "../config/chroma.js";
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
router.post(
  "/upload",
  authenticateUser,
  upload.array("documents", 10),
  async (req, res) => {

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

            processedFiles.push({
                originalName: file.originalname,
                filename: file.filename,
                size: file.size,
                extractedCharacters: extractedText.length,

                // Temporary (only for testing)
                extractedText
            });
        }
        // Step 1: Chunk
        const chunkedResults = await chunkFiles(
            processedFiles.map(f => ({ originalName: f.originalName, extractedText: f.extractedText })),
            { chunkSize: 1000, chunkOverlap: 200 }
        );

         // Step 2: Embed
        const embeddedResults = await embedChunkedFiles(chunkedResults);
    
        // Step 3 : Store vectors + create a MongoDB record PER FILE
        // (each file gets its own docId, since each is independently searchable)
        const uploadedDocs = [];

        for (const file of embeddedResults) {
            const docId = uuidv4();
            const chunkTexts = file.chunks.map((c) => c.text);
            const chunkEmbeddings = file.chunks.map((c) => c.embedding);

            await storeVectors(chunkTexts, chunkEmbeddings, file.originalName, docId);

            const savedDoc = await Document.create({
                userId: req.user._id,
                docId,
                fileName: file.originalName,
                totalChunks: file.totalChunks,
            });

            uploadedDocs.push(savedDoc);
        }

        return res.status(200).json({
            success: true,
            message: "Text extracted and chunked successfully.",
            totalFiles: processedFiles.length,
            documents : uploadedDocs,
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
 * Get Logged-in User Documents
 * ======================================================
 * Returns all documents uploaded by the authenticated user.
 */
router.get("/", authenticateUser, async (req, res) => {

    try {

        const documents = await Document.find({
            userId: req.user._id
        })
        .select("docId fileName totalChunks uploadedAt")
        .sort({ uploadedAt: -1 });

        return res.status(200).json({
            success: true,
            totalDocuments: documents.length,
            documents,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

});

/**
 * ======================================================
 * Delete Document
 * ======================================================
 */

router.delete(
  "/:docId",
  authenticateUser,
  async (req, res) => {

    try {

      const { docId } = req.params;

      const document = await Document.findOne({
        docId,
        userId: req.user._id,
      });

      if (!document) {

        return res.status(404).json({
          success: false,
          message: "Document not found.",
        });

      }

      // Delete vectors from Chroma
      await deleteDocumentVectors(docId);

      // Delete Mongo document
      await Document.deleteOne({
        docId,
      });

      return res.status(200).json({
        success: true,
        message: "Document deleted successfully.",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  }
);


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