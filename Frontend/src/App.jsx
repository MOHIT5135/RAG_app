// Import useEffect hook
import { useEffect } from "react";

// Import API function
import { checkBackendConnection } from "./services/testService";

function App() {

  // Runs once when component mounts
  useEffect(() => {

    const testConnection = async () => {

      try {

        // Call backend
        const data = await checkBackendConnection();

        console.log("Backend Response:", data);

      } catch (error) {

        console.log("Unable to connect to backend.");

      }

    };

    testConnection();

  }, []);

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <h1 className="text-5xl font-bold text-green-400">

        RAG App Setup Successful 🚀

      </h1>

    </div>

  );

}

export default App;