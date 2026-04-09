import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, BarChart3, AlertCircle } from "lucide-react"

interface IhsgAnalystPhaseDetailsProps {
  // Templated - data structure to be defined
  analysisData?: {
    ihsgPrediction?: string
    supportLevel?: string
    resistanceLevel?: string
    trend?: string
    volume?: string
  } | null
}

export function IhsgAnalystPhaseDetails({ analysisData }: IhsgAnalystPhaseDetailsProps) {
  return (
    <div className="space-y-4">
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="size-4 text-blue-500" />
            IHSG Analysis - Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            IHSG analysis data structure is being defined.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Prediction</p>
              <p className="font-medium">{analysisData?.ihsgPrediction || "—"}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Trend</p>
              <p className="font-medium">{analysisData?.trend || "—"}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Support</p>
              <p className="font-medium">{analysisData?.supportLevel || "—"}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Resistance</p>
              <p className="font-medium">{analysisData?.resistanceLevel || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <AlertCircle className="size-3" />
        Waiting for pipeline agent to store IHSG analysis data
      </div>
    </div>
  )
}
