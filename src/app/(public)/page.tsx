import Link from "next/link";
import { Activity, FileText, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Activity className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">Market Analyzer</h1>

        <p className="text-xl text-muted-foreground">
          Automated Indonesian stock market analysis pipeline
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/pipeline"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Activity className="h-5 w-5" />
            View Pipeline
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/reports"
            className="inline-flex items-center gap-2 px-6 py-3 border border-input bg-background rounded-lg font-medium hover:bg-accent transition-colors"
          >
            <FileText className="h-5 w-5" />
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
