import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Filter, Search, AlertCircle } from "lucide-react"

interface StockScreenerPhaseDetailsProps {
  // Templated - data structure to be defined
  screeningData?: {
    criteria?: string[]
    stocks Screened?: number
    candidates?: Array<{
      ticker: string
      name: string
      score: number
      reason: string
    }>
  } | null
}

export function StockScreenerPhaseDetails({ screeningData }: StockScreenerPhaseDetailsProps) {
  return (
    <div className="space-y-4">
      <Card className="border-green-500/30 bg-green-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Search className="size-4 text-green-500" />
            Stock Screener - Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Stock screening data structure is being defined.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Stocks Screened</p>
              <p className="text-2xl font-bold">{screeningData?.stocksScreened ?? "—"}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Candidates</p>
              <p className="text-2xl font-bold">{screeningData?.candidates?.length ?? 0}</p>
            </div>
          </div>

          {screeningData?.criteria && screeningData.criteria.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Screening Criteria</p>
              <div className="flex flex-wrap gap-2">
                {screeningData.criteria.map((criteria, i) => (
                  <Badge key={i} variant="outline">
                    <Filter className="size-3 mr-1" />
                    {criteria}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {screeningData?.candidates && screeningData.candidates.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {screeningData.candidates.map((candidate, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono font-medium">{candidate.ticker}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{candidate.score}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{candidate.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <AlertCircle className="size-3" />
        Waiting for pipeline agent to store stock screening data
      </div>
    </div>
  )
}
