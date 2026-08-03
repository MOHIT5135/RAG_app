import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  signup as signupService,
  login as loginService,
  logout as logoutService,
  getCurrentUser,
} from "../services/authService";

/**
 * ==========================================================
 * Authentication Context
 * ==========================================================
 */

const AuthContext = createContext();

/**
 * ==========================================================
 * Authentication Provider
 * ==========================================================
 */

export const AuthProvider = ({ children }) => {

  /**
   * ----------------------------------------------------------
   * States
   * ----------------------------------------------------------
   */

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  /**
   * ----------------------------------------------------------
   * Check Logged-in User
   * Runs once when app starts
   * ----------------------------------------------------------
   */

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const response = await getCurrentUser();

        setUser(response.user);

      } catch (error) {

        setUser(null);

      } finally {

        setLoading(false);

      }

    };

    checkAuth();

  }, []);

  /**
   * ----------------------------------------------------------
   * Signup
   * ----------------------------------------------------------
   */

  const signup = async (userData) => {

    const response = await signupService(userData);

    setUser(response.user);

    return response;

  };

  /**
   * ----------------------------------------------------------
   * Login
   * ----------------------------------------------------------
   */

  const login = async (credentials) => {

    const response = await loginService(credentials);

    setUser(response.user);

    return response;

  };

  /**
   * ----------------------------------------------------------
   * Logout
   * ----------------------------------------------------------
   */

  const logout = async () => {

    await logoutService();

    setUser(null);

  };

  /**
   * ----------------------------------------------------------
   * Context Values
   * ----------------------------------------------------------
   */

  const value = {

    user,

    loading,

    login,

    signup,

    logout,

    isAuthenticated: !!user,

  };

  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );

};

/**
 * ==========================================================
 * Custom Hook
 * ==========================================================
 */

export const useAuth = () => {

  return useContext(AuthContext);

};