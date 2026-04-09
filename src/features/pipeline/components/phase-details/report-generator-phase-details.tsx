import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, ExternalLink, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ReportGeneratorPhaseDetailsProps {
  reportLink: {
    report_id: string
    report_title: string
    version: number
    version_id: string
    url: string
  }
}

export function ReportGeneratorPhaseDetails({ reportLink }: ReportGeneratorPhaseDetailsProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            Report Generated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Report Title</p>
            <p className="text-lg font-semibold">{reportLink.report_title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Report ID</p>
              <p className="text-sm font-mono truncate">{reportLink.report_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Version</p>
              <Badge variant="outline">v{reportLink.version}</Badge>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={reportLink.url}
              className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              View Report
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="size-4 text-green-500" />
        Report successfully generated and available in the system.
      </div>
    </div>
  )
}
