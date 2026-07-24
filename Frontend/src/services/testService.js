// Import the reusable axios instance
import api from "./api";

// Function to test backend connectivity
export const checkBackendConnection = async () => {

    try {

        // Send GET request
        const response = await api.get("/");

        // Return backend response
        return response.data;

    } catch (error) {

        // Print error for debugging
        console.error("Backend Connection Failed:", error);

        // Rethrow the error so components can handle it
        throw error;
    }

};