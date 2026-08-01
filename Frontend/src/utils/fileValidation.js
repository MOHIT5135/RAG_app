import { uploadConfig } from "@/data/uploadConfig";

export const validateFile = (file) => {
  if (!file) {
    return {
      valid: false,
      message: "Please select a file.",
    };
  }

  // Validate file size
  if (file.size > uploadConfig.maxFileSize) {
    return {
      valid: false,
      message: `File size must be less than ${uploadConfig.maxFileSizeLabel}.`,
    };
  }

  // Validate MIME type
  if (
    !uploadConfig.acceptedMimeTypes.includes(file.type)
  ) {
    return {
      valid: false,
      message:
        "Unsupported file type. Please upload a PDF, DOC, DOCX, PPT, PPTX, or TXT file.",
    };
  }

  return {
    valid: true,
    message: "File is valid.",
  };
};