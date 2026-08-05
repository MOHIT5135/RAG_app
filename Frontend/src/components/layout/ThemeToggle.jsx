import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
      >
      <DropdownMenuTrigger
        className="
          inline-flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-border
          hover:bg-muted
          transition-colors
        "
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        
      </DropdownMenuTrigger>
      </Button>

      <DropdownMenuContent align="end">

        <DropdownMenuItem
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}