import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-14 w-full items-center gap-4 px-4">
        <Link href="/" className="font-bold">
          Market Analyzer
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/pipeline" className="text-muted-foreground hover:text-foreground">
            Pipeline
          </Link>
          <Link href="/reports" className="text-muted-foreground hover:text-foreground">
            Reports
          </Link>
        </nav>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
