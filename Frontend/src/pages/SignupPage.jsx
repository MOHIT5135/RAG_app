import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const SignupPage = () => {

  const navigate = useNavigate();

  const {
    signup,
    isAuthenticated,
  } = useAuth();

  /**
   * ==========================================================
   * States
   * ==========================================================
   */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
   * Handle Signup
   * ==========================================================
   */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {

      return setError("Passwords do not match.");

    }

    setLoading(true);

    try {

      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/chat");

    } catch (err) {

      setError(err.message || "Signup failed.");

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

            Create Account

          </h1>

          <p className="mt-2 text-sm text-zinc-400">

            Join RAGify AI and start chatting with your documents

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

          {/* Name */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">

              Full Name

            </label>

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />

          </div>

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
              placeholder="Enter your email"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
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
              placeholder="Enter your password"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />

          </div>

          {/* Confirm Password */}

          <div>

            <label className="mb-2 block text-sm text-zinc-300">

              Confirm Password

            </label>

            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >

            {loading ? "Creating Account..." : "Sign Up"}

          </button>

        </form>

        {/* Login Link */}

        <p className="mt-6 text-center text-sm text-zinc-400">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-medium text-violet-400 hover:text-violet-300"
          >

            Login

          </Link>

        </p>

      </div>

    </div>

  );

};

export default SignupPage;