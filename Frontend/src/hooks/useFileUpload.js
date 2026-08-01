import { useState } from "react";

import { validateFile } from "@/utils/fileValidation";
import { uploadDocuments } from "@/services/uploadService";
import { uploadConfig } from "@/data/uploadConfig";

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle File Selection
  const handleFileSelection = (files) => {
    if (!files || files.length === 0) return;

    const incomingFiles = Array.from(files);

    const validFiles = [];
    let validationError = "";

    incomingFiles.forEach((file) => {
      const result = validateFile(file);

      if (result.valid) {
        validFiles.push(file);
      } else {
        validationError = result.message;
      }
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    setSelectedFiles((prev) => {
      const updatedFiles = [...prev];

      validFiles.forEach((file) => {
        const alreadyExists = updatedFiles.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size
        );

        if (!alreadyExists) {
          updatedFiles.push(file);
        }
      });

      if (updatedFiles.length > uploadConfig.maxFiles) {
        setError(
          `You can upload a maximum of ${uploadConfig.maxFiles} files.`
        );
      }

      return updatedFiles.slice(0, uploadConfig.maxFiles);
    });
  };

  // Remove Single File
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear Selected Files
  const clearFiles = () => {
    setSelectedFiles([]);
    setError("");
  };

  // Upload Files
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setLoading(true);
      setError("");

      const response = await uploadDocuments(selectedFiles);

      // Append newly uploaded documents
      setUploadedDocuments((prevDocuments) => [
        ...prevDocuments,
        ...response.documents,
      ]);

      clearFiles();

      return response;
    } catch (err) {
      setError(err.message || "Upload failed.");

      return {
        success: false,
        message: err.message || "Upload failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedFiles,
    uploadedDocuments,
    loading,
    error,

    handleFileSelection,
    removeFile,
    clearFiles,
    uploadFiles,
  };
};