import axios from "axios";

import { uploadConfig } from "@/data/uploadConfig";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const uploadDocuments = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("documents", file);
  });

  try {
    const response = await api.post(
      uploadConfig.uploadEndpoint,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong while uploading the documents.",
      }
    );
  }
};