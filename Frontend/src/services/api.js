// Import axios to make HTTP requests
import axios from "axios";

console.log(import.meta.env.VITE_API_BASE_URL);

// Create a reusable axios instance
const api = axios.create({

  // Base URL is read from the .env file
  // Example: http://localhost:8080/api
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // Allows cookies to be sent with requests
  // Useful later when using JWT authentication with cookies
  withCredentials: true,

  // Request timeout (10 seconds)
  timeout: 60000,
});

// Export the axios instance
export default api;