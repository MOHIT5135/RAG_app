import express from "express";
import fs from "fs/promises";
import path from "path";
import multer from "multer"; 
import { v4 as uuidv4 } from "uuid";
import { upload } from "../middlewares/uploadMiddleware.js";
import { extractTextFromFile } from "../services/documentprocessor.js";
import { chunkFiles } from "../services/chunkService.js";
import { embedChunkedFiles } from "../services/embeddingService.js";
import { storeVectors } from "../services/vectorService.js";
import Document from "../models/Document.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { deleteDocumentVectors } from "../config/vectorStore.js";
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
            // Returns Array<{ text: string, metadata: { pageNumber?, sectionHeader? } }>
            const segments = await extractTextFromFile(file.path);

            if (!Array.isArray(segments) || segments.length === 0) {
                return res.status(422).json({
                    success: false,
                    message: `No readable text could be extracted from "${file.originalname}". The PDF may be scanned/image-based or contain no selectable text.`,
                    fileName: file.originalname
                });
            }

            // Calculate total extracted character length across all segments
            const totalChars = segments.reduce((sum, seg) => sum + (seg.text?.length || 0), 0);

            processedFiles.push({
                originalName: file.originalname,
                filename: file.filename,
                size: file.size,
                extractedCharacters: totalChars,
                extractedSegments: segments // Passed as array of segments
            });
        }
        // Step 1: Chunk
        const chunkedResults = await chunkFiles(
            processedFiles.map(f => ({ originalName: f.originalName, extractedSegments: f.extractedSegments })),
            { chunkSize: 1250, chunkOverlap: 150 }
        );

        for (const file of chunkedResults) {
            if (!file.chunks || file.chunks.length === 0) {
                return res.status(422).json({
                    success: false,
                    message: `No valid text chunks were generated for "${file.originalName}".`,
                    fileName: file.originalName
                });
            }
        }

         // Step 2: Embed
        const embeddedResults = await embedChunkedFiles(chunkedResults);
    
        // Step 3 : Store vectors + create a MongoDB record PER FILE
        // (each file gets its own docId, since each is independently searchable)
        const uploadedDocs = [];

        for (const file of embeddedResults) {
            const docId = uuidv4();
            const chunkTexts = file.chunks.map((c) => c.text);
            const chunkEmbeddings = file.chunks.map((c) => c.embedding);

            // Map chunk metadata array for Chroma vector store
            const chunkMetadatas = file.chunks.map((c) => ({
                fileName: file.originalName,
                pageNumber: c.pageNumber || null,
                sectionHeader: c.sectionHeader || null,
                chunkIndex: c.chunkIndex
            }));

            await storeVectors(chunkTexts, chunkEmbeddings, file.originalName, docId, req.user._id, chunkMetadatas) ;

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