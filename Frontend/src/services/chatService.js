import chatConfig from "../data/chatConfig";

console.log("Backend URL:", import.meta.env.VITE_API_BASE_URL);

export const askQuestion = async ({
  query,
  documentId,
  totalChunks,
  chatId,
  // Added callback functions to pass streaming data back to the UI
  onToken,    
  onComplete, 
}) => {
  try {
    // Retrieve the auth token manually since we are bypassing the Axios 'api' instance
    // Note: Change "token" to whatever key you use in localStorage or cookies
    const token = localStorage.getItem("token"); 

    // Replaced api.post with native fetch() to handle the ReadableStream
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${chatConfig.askEndpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "", 
      },
      body: JSON.stringify({
        query,
        documentId,
        totalChunks,
        chatId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Attach a stream reader to process Server-Sent Events chunk-by-chunk
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let isDone = false;

    while (!isDone) {
      const { value, done } = await reader.read();
      isDone = done;

      if (value) {
        const chunkString = decoder.decode(value, { stream: true });
        
        // SSE sends data separated by "\n\n". Split them to process individual events.
        const events = chunkString.split("\n\n");
        
        for (const event of events) {
          if (event.startsWith("data: ")) {
            try {
              const parsedData = JSON.parse(event.replace("data: ", ""));
              
              // Route the parsed data to the appropriate callback
              if (parsedData.type === "token" && onToken) {
                onToken(parsedData.token); // Triggers UI text update
              } else if (parsedData.type === "done" && onComplete) {
                onComplete(parsedData); // Passes final metadata (sources, etc.) to UI
              } else if (parsedData.type === "error") {
                throw new Error(parsedData.message);
              }
            } catch (err) {
              // Note: Silent catch here is intentional. 
              // Sometimes chunks are cut in half over the network. It will parse correctly on the next loop.
            }
          }
        }
      }
    }
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Something went wrong.",
      }
    );
  }
};