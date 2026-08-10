import express from "express";
import client from "./config/chroma.js";
const router = express.Router();

/**
 * ==========================================================
 * Get All Documents / ChromaDB Data
 * ==========================================================
 */

router.get("/", async (req, res) => {

  try {

    const collection = await client.getCollection({
      name: "rag_documents",
    });

    const response = await collection.get();

    return res.status(200).json({

      ids: response.ids,

      documents: response.documents,

      metadatas: response.metadatas,

    });

  } catch (error) {

    console.error(
      "Error fetching all documents:",
      error
    );

    return res.status(500).json({

      error:
        "Failed to retrieve documents from ChromaDB",

    });

  }

});

export default router;