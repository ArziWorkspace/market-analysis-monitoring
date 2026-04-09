import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Clock } from "lucide-react"

interface PendingPhaseDetailsProps {
  message?: string
}

export function PendingPhaseDetails({ message = "Phase data not yet connected" }: PendingPhaseDetailsProps) {
  return (
    <Card className="border-yellow-500/30 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <AlertCircle className="size-4" />
          Coming Soon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <Clock className="size-5 text-yellow-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              This phase is not yet configured to display data. The pipeline agent needs to be updated to store phase-specific data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
