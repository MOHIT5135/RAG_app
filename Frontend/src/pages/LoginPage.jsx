import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {

  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
  } = useAuth();

  /**
   * ==========================================================
   * States
   * ==========================================================
   */

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /**
   * ==========================================================
   * Already Logged In
   * ==========================================================
   */

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  /**
   * ==========================================================
   * Handle Input Change
   * ==========================================================
   */

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  /**
   * ==========================================================
   * Handle Login
   * ==========================================================
   */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      await login(formData);

      navigate("/chat");

    } catch (err) {

      setError(err.message || "Login failed.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">

      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

        {/* Logo */}

        <div className="mb-8 flex flex-col items-center">

          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20">

            <Bot className="h-8 w-8 text-violet-400" />

          </div>

          <h1 className="text-3xl font-bold text-white">

            Welcome Back

          </h1>

          <p className="mt-2 text-sm text-zinc-400">

            Login to continue using RAGify AI

          </p>

        </div>

        {/* Error */}

        {error && (

          <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">

            {error}

          </div>

        )}

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">

              Email

            </label>

            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
              placeholder="Enter your email"
            />

          </div>

          {/* Password */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">

              Password

            </label>

            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
              placeholder="Enter your password"
            />

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >

            {loading ? "Signing In..." : "Login"}

          </button>

        </form>

        {/* Signup */}

        <p className="mt-6 text-center text-sm text-zinc-400">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="font-medium text-violet-400 hover:text-violet-300"
          >

            Sign Up

          </Link>

        </p>

      </div>

    </div>

  );

};

export default LoginPage;