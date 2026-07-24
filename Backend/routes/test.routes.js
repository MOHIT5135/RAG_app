import express from "express";

const router = express.Router();

// Health check route
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend Connected Successfully"
    });
});

export default router;