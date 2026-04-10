import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold">
            StarterKit
          </Link>
          <div className="flex gap-4 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/pipeline"
              className="text-muted-foreground hover:text-foreground"
            >
              Pipeline
            </Link>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
