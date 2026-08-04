import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { getUserDocuments } from "@/services/documentService";

/**
 * ==========================================================
 * Document Context
 * ==========================================================
 */

const DocumentContext = createContext();

/**
 * ==========================================================
 * Document Provider
 * ==========================================================
 */

export const DocumentProvider = ({ children }) => {

  const { isAuthenticated } = useAuth();
  const [activeDocument, setActiveDocument] = useState(null);

  /**
   * ----------------------------------------------------------
   * States
   * ----------------------------------------------------------
   */

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(false);

  /**
   * ----------------------------------------------------------
   * Fetch Documents
   * ----------------------------------------------------------
   */

  const refreshDocuments = async () => {

    if (!isAuthenticated) {

      setDocuments([]);

      return;

    }

    try {

      setLoading(true);

      const response = await getUserDocuments();

      setDocuments(response.documents || []);

      const docs = response.documents || [];

      setDocuments(docs);

      if (docs.length > 0) {
          setActiveDocument(docs[0]);
      } else {
          setActiveDocument(null);
      }

    } catch (error) {

      console.error("Unable to fetch documents:", error);

      setDocuments([]);

    } finally {

      setLoading(false);

    }

  };

  /**
   * ----------------------------------------------------------
   * Load Documents After Login
   * ----------------------------------------------------------
   */

  useEffect(() => {

    refreshDocuments();

  }, [isAuthenticated]);

  /**
   * ----------------------------------------------------------
   * Add Newly Uploaded Documents
   * ----------------------------------------------------------
   */

  const addDocuments = (newDocuments) => {

    if (!Array.isArray(newDocuments)) return;

    setDocuments((prev) => {

      const existingIds = new Set(
        prev.map((doc) => doc.docId)
      );

      const filtered = newDocuments.filter(
        (doc) => !existingIds.has(doc.docId)
      );

      const updated = [...filtered, ...prev];

      if (!activeDocument && updated.length > 0) {
          setActiveDocument(updated[0]);
      }

      return updated;

    });

  };

  /**
   * ----------------------------------------------------------
   * Remove Document
   * ----------------------------------------------------------
   */

  const removeDocument = (docId) => {

    setDocuments((prev) => {

      const updated = prev.filter(
        (doc) => doc.docId !== docId
      );

      if (activeDocument?.docId === docId) {

        setActiveDocument(
          updated.length ? updated[0] : null
        );

      }

      return updated;

    });

  };

  /**
   * ----------------------------------------------------------
   * Context Values
   * ----------------------------------------------------------
   */

  const value = {

    documents,
    loading,
    activeDocument,
    setActiveDocument,
    refreshDocuments,
    addDocuments,
    removeDocument,

  };

  return (

    <DocumentContext.Provider value={value}>

      {children}

    </DocumentContext.Provider>

  );

};

/**
 * ==========================================================
 * Custom Hook
 * ==========================================================
 */

export const useDocuments = () => {

  return useContext(DocumentContext);

};