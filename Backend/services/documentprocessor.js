import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import JSZip from "jszip";

/**
 * ============================================================
 * Extract text from any supported document.
 *
 * Supported:
 *  - PDF
 *  - DOCX
 *  - TXT
 *  - PPTX
 *
 * Returns:
 *  Clean extracted text
 * ============================================================
 */

// Extracts visible text from all slides in a .pptx file.
// PPTX is a ZIP archive; each slide's text lives inside
// <a:t>...</a:t> tags in ppt/slides/slideN.xml.
const extractTextFromPptx = async (filePath) => {
    const buffer = await fs.readFile(filePath);
    const zip = await JSZip.loadAsync(buffer);

    // Find all slide XML files, sorted numerically (slide1, slide2, ... slide10)
    const slideFiles = Object.keys(zip.files)
        .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
        .sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
            const numB = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
            return numA - numB;
        });

    const slideTexts = [];
    for (const slideFile of slideFiles) {
        const xmlContent = await zip.files[slideFile].async("string");

        // Extract all text runs: <a:t>some text</a:t>
        const matches = [...xmlContent.matchAll(/<a:t>(.*?)<\/a:t>/g)];
        const slideText = matches
            .map((m) => m[1])
            .join(" ")
            .trim();

        if (slideText) {
            slideTexts.push(slideText);
        }
    }

    // Join slides with double newlines so chunking treats them as separate "paragraphs"
    return slideTexts.join("\n\n");
};

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

        // ================= PPT =================
        case ".pptx": {
            return await extractTextFromPptx(filePath);
        }

        // ================= Unsupported =================
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
};