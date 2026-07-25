import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

/**
 * ============================================================
 * Extract text from any supported document.
 *
 * Supported:
 *  - PDF
 *  - DOCX
 *  - TXT
 *
 * Returns:
 *  Clean extracted text
 * ============================================================
 */
export const extractTextFromFile = async (filePath) => {
    // Get file extension (.pdf, .docx, .txt)
    const extension = path.extname(filePath).toLowerCase();

    switch (extension) {

        // ================= PDF =================
        case ".pdf": {
            // Read PDF file as binary buffer
            const buffer = await fs.readFile(filePath);

            // Extract text using pdf-parse
            const data = await pdfParse(buffer);

            return data.text;
        }

        // ================= DOCX =================
        case ".docx": {
            // Mammoth extracts raw text from Word documents
            const result = await mammoth.extractRawText({
                path: filePath
            });

            return result.value;
        }

        // ================= TXT =================
        case ".txt": {
            // Read plain text file
            const text = await fs.readFile(filePath, "utf8");

            return text;
        }

        // ================= Unsupported =================
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
};