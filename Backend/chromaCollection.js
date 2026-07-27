import express from 'express';
import { ChromaClient } from 'chromadb';

const router = express.Router();
const client = new ChromaClient(); // Connects to localhost:8000

// Endpoint to fetch all documents and metadata
router.get('/', async (req, res) => {
    try {
        // 1. Get your target collection
        const collection = await client.getCollection({
            name: "rag_documents" // Replace with your actual collection name
        });

        // 2. Fetch everything (returns ids, documents, and metadatas by default)
        const response = await collection.get();

        // 3. Send the structured data to your frontend
        res.status(200).json({
            ids: response.ids,
            documents: response.documents,
            metadatas: response.metadatas
        });
    } catch (error) {
        console.error("Error fetching all documents:", error);
        res.status(500).json({ error: "Failed to retrieve documents from ChromaDB" });
    }
});

export default router;
