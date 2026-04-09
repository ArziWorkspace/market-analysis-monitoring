import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle2, ExternalLink } from "lucide-react"

interface ReportGeneratorDetailsProps {
  details: {
    reportId?: string
    reportUrl?: string
    sectionsGenerated?: number
    stocksAnalyzed?: number
    wordCount?: number
    generationTime?: string
    [key: string]: unknown
  }
}

export function ReportGeneratorDetails({ details }: ReportGeneratorDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="size-4 text-blue-500" />
              Report ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono truncate">
              {details.reportId ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.sectionsGenerated ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Stocks Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.stocksAnalyzed ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Word Count</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.wordCount?.toLocaleString() ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {details.reportUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ExternalLink className="size-4" />
              Report Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href={details.reportUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline break-all"
            >
              {details.reportUrl}
            </a>
          </CardContent>
        </Card>
      )}

      {details.generationTime && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-green-500" />
          Report generated in {details.generationTime}
        </div>
      )}
    </div>
  )
}
