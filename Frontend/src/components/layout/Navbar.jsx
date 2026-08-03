import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {

  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  /**
   * ==========================================================
   * Logout
   * ==========================================================
   */
  const handleLogout = async () => {

    try {

      await logout();

      navigate("/");

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold tracking-tight"
        >
          RAGify
        </Link>

        {/* Navigation */}

        <div className="hidden gap-8 md:flex">

          <a href="#">
            Home
          </a>

          <a href="#">
            Features
          </a>

          <a href="#">
            How it Works
          </a>

          <a href="#">
            Docs
          </a>

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-4">

          <ThemeToggle />

          {!isAuthenticated ? (

            <>
              {/* Login */}

              <Link
                to="/login"
                className="rounded-lg border border-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-600 hover:text-white"
              >
                Login
              </Link>

              {/* Signup */}

              <Link
                to="/signup"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Sign Up
              </Link>
            </>

          ) : (

            <>
              {/* User Name */}

              <div className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium">

                👤 {user?.name}

              </div>

              {/* Logout */}

              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>

            </>

          )}

        </div>

      </nav>

    </header>

  );

}