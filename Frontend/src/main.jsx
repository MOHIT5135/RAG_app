import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { DocumentProvider } from "@/context/DocumentContext";
import { ChatHistoryProvider } from "@/context/ChatHistoryContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <BrowserRouter>

      <ThemeProvider>

        <AuthProvider>

          <DocumentProvider>

            <ChatHistoryProvider>

              <App />

            </ChatHistoryProvider>

          </DocumentProvider>

        </AuthProvider>

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>
);