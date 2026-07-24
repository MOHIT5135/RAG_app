import multer from "multer";

export const errorHandler = (err, req, res, next) => {

  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {

      return res.status(400).json({

        success: false,
        message: err.message

      });

  }

  // Handle custom file validation errors
  if (err.message.includes("Invalid file type")) {

      return res.status(400).json({

        success: false,
        message: err.message

      });

  }

  // Default error response
  return res.status(res.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });

};