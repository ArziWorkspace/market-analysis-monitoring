import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Globe, MapPin, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react"

interface MacroAnalysis {
  id: string
  theme_name: string | null
  theme_description: string | null
  global_events_analysis: string | null
  local_events_analysis: string | null
  causality_chain: string | null
  investment_implications: string | null
  summary: string | null
  status: string | null
  created_at: string | null
}

interface MacroIndicator {
  id: string
  indicator_name: string
  indicator_value: string | null
  interpretation: string | null
  created_at: string | null
}

interface MacroAnalystPhaseDetailsProps {
  macroAnalysis: MacroAnalysis | null
  macroIndicators: MacroIndicator[]
}

export function MacroAnalystPhaseDetails({ macroAnalysis, macroIndicators }: MacroAnalystPhaseDetailsProps) {
  if (!macroAnalysis && macroIndicators.length === 0) {
    return (
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="size-4" />
            No Macro Analysis Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Macro analysis has not been completed for this pipeline run yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {macroAnalysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="size-4 text-blue-500" />
                Theme Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {macroAnalysis.theme_name && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Theme Name</p>
                  <p className="font-medium">{macroAnalysis.theme_name}</p>
                </div>
              )}
              
              {macroAnalysis.theme_description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{macroAnalysis.theme_description}</p>
                </div>
              )}

              {macroAnalysis.summary && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Summary</p>
                  <p className="text-sm">{macroAnalysis.summary}</p>
                </div>
              )}

              {macroAnalysis.status && (
                <div className="flex items-center gap-2">
                  <Badge className={macroAnalysis.status === "COMPLETE" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}>
                    <CheckCircle2 className="size-3 mr-1" />
                    {macroAnalysis.status}
                  </Badge>
                  {macroAnalysis.created_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(macroAnalysis.created_at).toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {macroAnalysis.global_events_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="size-4 text-green-500" />
                  Global Events Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{macroAnalysis.global_events_analysis}</p>
              </CardContent>
            </Card>
          )}

          {macroAnalysis.local_events_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="size-4 text-orange-500" />
                  Local Events Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{macroAnalysis.local_events_analysis}</p>
              </CardContent>
            </Card>
          )}

          {macroAnalysis.causality_chain && (
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="size-4 text-primary" />
                  Causality Chain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap font-medium">{macroAnalysis.causality_chain}</p>
              </CardContent>
            </Card>
          )}

          {macroAnalysis.investment_implications && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="size-4 text-purple-500" />
                  Investment Implications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{macroAnalysis.investment_implications}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {macroIndicators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="size-4 text-cyan-500" />
              Macro Indicators ({macroIndicators.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Indicator</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Interpretation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {macroIndicators.map((indicator) => (
                  <TableRow key={indicator.id}>
                    <TableCell className="font-medium">{indicator.indicator_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{indicator.indicator_value || "-"}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                      {indicator.interpretation || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
