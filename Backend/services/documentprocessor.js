import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import JSZip from "jszip";
import util from "util";
/**
 * Extracts structured metadata (page numbers, headers) alongside raw text.
 * Returns Array<{ text: string, metadata: { pageNumber?: number, section?: string } }>
 */

// Custom pager callback for pdf-parse to separate pages cleanly
function renderPage(pageData) {
    return pageData.getTextContent().then((textContent) => {
         let lastY, text = '';
        const lines = []; // { text, fontSize }

        let currentLine = '';
        let currentFontSize = null;
        for (let item of textContent.items) {
            const fontSize = Math.abs(item.transform[0]); // approximate font scale

            if (lastY == item.transform[5] || !lastY) {
                text += item.str;
                currentLine += item.str;
                currentFontSize = fontSize;
            } else {
                text += '\n' + item.str;
                if (currentLine.trim()) lines.push({ text: currentLine.trim(), fontSize: currentFontSize });
                currentLine = item.str;
                currentFontSize = fontSize;
            }
            lastY = item.transform[5];
        }
        if (currentLine.trim()) lines.push({ text: currentLine.trim(), fontSize: currentFontSize });

        // Heading heuristic: short line, noticeably larger font than the page's typical (median) size
        const sizes = lines.map(l => l.fontSize).filter(Boolean).sort((a, b) => a - b);
        const medianSize = sizes[Math.floor(sizes.length / 2)] || 0;

        const heading = lines.find(
            (l) => l.fontSize > medianSize * 1.25 && l.text.length < 80 && !/[.,;:]$/.test(l.text)
        );

        return { text, sectionHeader: heading?.text || null };
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
                    const { text, sectionHeader } = await renderPage(pageData);
                    if (text.trim()) {
                        pageSegments.push({
                            text: text.trim(),
                            metadata: {
                                pageNumber: pageData.pageIndex + 1,
                                sectionHeader, // now actually populated
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
            const docxBuffer = await fs.readFile(filePath);

            // Convert headings into a marker we can split on, preserving structure
            const result = await mammoth.convertToHtml(
                { buffer: docxBuffer },
                { styleMap: ["p[style-name='Heading 1'] => h1", "p[style-name='Heading 2'] => h2"] }
            );

            const html = result.value;
            const sections = html.split(/(?=<h[12]>)/);

            const segments = sections
                .map((section) => {
                    const headingMatch = section.match(/<h[12]>(.*?)<\/h[12]>/s); // added 's' flag for multi-line safety

                    let sectionHeader = null;
                    if (headingMatch) {
                        sectionHeader = headingMatch[1]
                            .replace(/<[^>]+>/g, "")   // strip any nested tags (the <a id="..."> anchors)
                            .replace(/&amp;/g, "&")     // decode common HTML entities mammoth may produce
                            .replace(/&quot;/g, '"')
                            .replace(/\s+/g, " ")
                            .trim();
                    }

                    const text = section.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
                    return text ? { text, metadata: { sectionHeader: sectionHeader || null, pageNumber: null } } : null;
                })
                .filter(Boolean);
            return segments;
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