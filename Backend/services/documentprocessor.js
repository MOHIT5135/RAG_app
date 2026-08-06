import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import JSZip from "jszip";
import util from "util";
import libre from "libreoffice-convert";
/**
 * Extracts structured metadata (page numbers, headers) alongside raw text.
 * Returns Array<{ text: string, metadata: { pageNumber?: number, section?: string } }>
 */

// Promisify the libreoffice conversion function
libre.convertAsync = util.promisify(libre.convert);

// Custom pager callback for pdf-parse to separate pages cleanly
function renderPage(pageData) {
    return pageData.getTextContent().then((textContent) => {
        let lastY, text = '';
        for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY) {
                text += item.str;
            } else {
                text += '\n' + item.str;
            }
            lastY = item.transform[5];
        }
        return text;
    });
}

export const extractTextFromFile = async (filePath) => {
    const extension = path.extname(filePath).toLowerCase();

    switch (extension) {

        // ================= PDF (Page-level Extraction) =================
        case ".pdf": {
            const buffer = await fs.readFile(filePath);
            const pageSegments = [];

            // Parse page by page using pdf-parse custom pager callback
            await pdfParse(buffer, {
                pagerender: async (pageData) => {
                    const text = await renderPage(pageData);
                    if (text.trim()) {
                        pageSegments.push({
                            text: text.trim(),
                            metadata: {
                                pageNumber: pageData.pageIndex + 1
                            }
                        });
                    }
                    return text;
                }
            });

            return pageSegments;
        }

        // ================= DOCX ( with Auto-PDF Conversion) =================
        case ".docx": {
            // 1. Read the raw DOCX file
            const docxBuffer = await fs.readFile(filePath);
            
            // 2. Convert it to a PDF buffer in memory behind the scenes
            const pdfBuffer = await libre.convertAsync(docxBuffer, ".pdf", undefined); 

            // 3. Process the newly created PDF buffer using your existing pdf-parse logic
            const pageSegments = [];
            await pdfParse(pdfBuffer, {
                pagerender: async (pageData) => {
                    const text = await renderPage(pageData);
                    if (text.trim()) {
                        pageSegments.push({
                            text: text.trim(),
                            // We now get real page numbers for Word documents!
                            metadata: { pageNumber: pageData.pageIndex + 1 } 
                        });
                    }
                    return text;
                }
            });

            return pageSegments;
        }

        // ================= PPTX (Slide-level Extraction) =================
        case ".pptx": {
            const buffer = await fs.readFile(filePath);
            const zip = await JSZip.loadAsync(buffer);

            const slideFiles = Object.keys(zip.files)
                .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
                .sort((a, b) => {
                    const numA = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
                    const numB = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
                    return numA - numB;
                });

            const slideSegments = [];
            for (let i = 0; i < slideFiles.length; i++) {
                const slideFile = slideFiles[i];
                const xmlContent = await zip.files[slideFile].async("string");
                const matches = [...xmlContent.matchAll(/<a:t>(.*?)<\/a:t>/g)];
                const slideText = matches.map((m) => m[1]).join(" ").trim();

                if (slideText) {
                    slideSegments.push({
                        text: slideText,
                        metadata: {
                            pageNumber: i + 1,
                            sectionHeader: `Slide ${i + 1}`
                        }
                    });
                }
            }

            return slideSegments;
        }

        // ================= TXT =================
        case ".txt": {
            const text = await fs.readFile(filePath, "utf8");
            return [{ text: text.trim(), metadata: { sectionHeader: "Main Text" } }];
        }

        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
};