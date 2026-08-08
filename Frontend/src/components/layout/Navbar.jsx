import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * ==========================================================
   * Logout
   * ==========================================================
   */

  const handleLogout = async () => {
    try {
      await logout();

      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * ==========================================================
   * Close Mobile Menu
   * ==========================================================
   */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-background/80 backdrop-blur-md">

      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* ==================================================
            Logo
        =================================================== */}

        <Link
          to="/"
          onClick={closeMenu}
          className="
            shrink-0
            text-2xl
            font-bold
            tracking-tight
            sm:text-2xl
          "
        >
          RAGify
        </Link>

        {/* ==================================================
            Desktop Navigation
        =================================================== */}

        <div className="hidden items-center gap-6 md:flex lg:gap-8">

          <a
            href="#home"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-violet-400"
          >
            Home
          </a>

          <a
            href="#features"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-violet-400"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-violet-400"
          >
            How it Works
          </a>

          <a
            href="#docs"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-violet-400"
          >
            Docs
          </a>

        </div>

        {/* ==================================================
            Desktop Right Side
        =================================================== */}

        <div className="hidden items-center gap-3 md:flex">

          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              {/* Login */}

              <Link
                to="/login"
                className="
                  whitespace-nowrap
                  rounded-lg
                  border
                  border-violet-600
                  px-3
                  py-2
                  text-sm
                  font-medium
                  transition
                  hover:bg-violet-600
                  hover:text-white
                  lg:px-4
                "
              >
                Login
              </Link>

              {/* Signup */}

              <Link
                to="/signup"
                className="
                  whitespace-nowrap
                  rounded-lg
                  bg-violet-600
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-violet-700
                  lg:px-4
                "
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* User */}

              <div
                className="
                  max-w-40
                  truncate
                  rounded-lg
                  border
                  border-zinc-700
                  px-3
                  py-2
                  text-sm
                  font-medium
                  lg:px-4
                "
              >
                👤 {user?.name}
              </div>

              {/* Logout */}

              <button
                onClick={handleLogout}
                className="
                  whitespace-nowrap
                  rounded-lg
                  border
                  border-red-500
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-red-500
                  transition
                  hover:bg-red-500
                  hover:text-white
                  lg:px-4
                "
              >
                Logout
              </button>
            </>
          )}

        </div>

        {/* ==================================================
            Mobile Controls
        =================================================== */}

        <div className="flex items-center gap-2 md:hidden">

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              border
              border-zinc-700
              text-zinc-300
              transition
              hover:border-violet-500
              hover:text-white
            "
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

        </div>

      </nav>

      {/* ====================================================
          Mobile Menu
      ===================================================== */}

      {menuOpen && (
        <div
          className="
            border-t
            border-zinc-800
            bg-background
            px-4
            pb-5
            pt-4
            md:hidden
          "
        >

          {/* Navigation */}

          <div className="flex flex-col gap-1">

            <a
              href="#"
              onClick={closeMenu}
              className="
                rounded-lg
                px-3
                py-3
                text-sm
                font-medium
                transition
                hover:bg-zinc-900
                hover:text-violet-400
              "
            >
              Home
            </a>

            <a
              href="#features"
              onClick={closeMenu}
              className="
                rounded-lg
                px-3
                py-3
                text-sm
                font-medium
                transition
                hover:bg-zinc-900
                hover:text-violet-400
              "
            >
              Features
            </a>

            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="
                rounded-lg
                px-3
                py-3
                text-sm
                font-medium
                transition
                hover:bg-zinc-900
                hover:text-violet-400
              "
            >
              How it Works
            </a>

            <a
              href="#docs"
              onClick={closeMenu}
              className="
                rounded-lg
                px-3
                py-3
                text-sm
                font-medium
                transition
                hover:bg-zinc-900
                hover:text-violet-400
              "
            >
              Docs
            </a>

          </div>

          {/* Divider */}

          <div className="my-3 border-t border-zinc-800" />

          {/* User Actions */}

          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">

              <Link
                to="/login"
                onClick={closeMenu}
                className="
                  w-full
                  rounded-lg
                  border
                  border-violet-600
                  px-4
                  py-2.5
                  text-center
                  text-sm
                  font-medium
                  transition
                  hover:bg-violet-600
                  hover:text-white
                "
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="
                  w-full
                  rounded-lg
                  bg-violet-600
                  px-4
                  py-2.5
                  text-center
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-violet-700
                "
              >
                Sign Up
              </Link>

            </div>
          ) : (
            <div className="flex flex-col gap-2">

              {/* User */}

              <div
                className="
                  rounded-lg
                  border
                  border-zinc-700
                  px-4
                  py-2.5
                  text-center
                  text-sm
                  font-medium
                "
              >
                👤 {user?.name || "User"}
              </div>

              {/* Logout */}

              <button
                onClick={handleLogout}
                className="
                  w-full
                  rounded-lg
                  border
                  border-red-500
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-red-500
                  transition
                  hover:bg-red-500
                  hover:text-white
                "
              >
                Logout
              </button>

            </div>
          )}

        </div>
      )}

    </header>
  );
}