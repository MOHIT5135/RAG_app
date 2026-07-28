import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-tight">
          RAGify
        </h1>

        {/* Navigation */}

        <div className="hidden md:flex gap-8">

          <a href="#">Home</a>

          <a href="#">Features</a>

          <a href="#">How it Works</a>

          <a href="#">Docs</a>

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-4">

          <ThemeToggle />

        </div>

      </nav>

    </header>
  );
}