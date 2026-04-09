import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Filter, CheckCircle2 } from "lucide-react"

interface StockScreenerDetailsProps {
  details: {
    stocksScreened?: number
    filtersApplied?: string[]
    criteria?: Record<string, unknown>
    topCandidates?: Array<{
      ticker: string
      companyName: string
      score: number
      reasons: string[]
    }>
    [key: string]: unknown
  }
}

export function StockScreenerDetails({ details }: StockScreenerDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="size-4 text-blue-500" />
              Stocks Screened
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.stocksScreened?.toLocaleString() ?? "—"}
            </p>
          </CardContent>
        </Card>

        {details.topCandidates && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {Array.isArray(details.topCandidates) ? details.topCandidates.length : 0}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {details.filtersApplied && details.filtersApplied.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Filters Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(details.filtersApplied as string[]).map((filter, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {filter}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {details.topCandidates && details.topCandidates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Stock Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Reasons</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(details.topCandidates as Array<{ ticker: string; companyName: string; score: number; reasons: string[] }>).map((stock, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono font-medium">{stock.ticker}</TableCell>
                    <TableCell className="text-sm">{stock.companyName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{stock.score}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {stock.reasons?.join(", ")}
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
