"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"

interface StockScreener {
  id: string
  summary: string | null
  why_these_stocks: string | null
  stock_picks: Prisma.JsonValue | null
  eliminated_stocks: Prisma.JsonValue | null
  status: string | null
  created_at: string | null
}

interface StockPick {
  id: string
  rank: number | null
  ticker: string | null
  company_name: string | null
  sector: string | null
  rationale: string | null
  expected_performance: string | null
  theme_alignment: string | null
  created_at: string | null
}

interface StockScreenerPhaseDetailsProps {
  stockScreener: StockScreener | null
  stockPicks: StockPick[]
}

function JsonCard({ title, data }: { title: string; data: Prisma.JsonValue | null }) {
  if (!data) return null
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-40">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}

export function StockScreenerPhaseDetails({ stockScreener, stockPicks }: StockScreenerPhaseDetailsProps) {
  if (!stockScreener && stockPicks.length === 0) {
    return (
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="size-4" />
            No Stock Screener Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Stock screening has not been completed for this pipeline run yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {stockScreener && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="size-4 text-green-500" />
                Stock Screener
                {stockScreener.status && (
                  <Badge className={stockScreener.status === "COMPLETE" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}>
                    <CheckCircle2 className="size-3 mr-1" />
                    {stockScreener.status}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stockScreener.summary && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Summary</p>
                  <p className="text-sm whitespace-pre-wrap">{stockScreener.summary}</p>
                </div>
              )}

              {stockScreener.why_these_stocks && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Why These Stocks</p>
                  <p className="text-sm whitespace-pre-wrap">{stockScreener.why_these_stocks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {stockScreener.stock_picks && (
            <JsonCard title="Stock Picks (JSON)" data={stockScreener.stock_picks} />
          )}

          {stockScreener.eliminated_stocks && (
            <JsonCard title="Eliminated Stocks" data={stockScreener.eliminated_stocks} />
          )}
        </>
      )}

      {stockPicks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="size-4 text-green-500" />
              Stock Picks ({stockPicks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Expected Perf</TableHead>
                  <TableHead>Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockPicks.map((pick) => (
                  <TableRow key={pick.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-bold">
                        #{pick.rank ?? "?"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-green-500">
                      {pick.ticker || "-"}
                    </TableCell>
                    <TableCell className="text-sm">{pick.company_name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {pick.sector || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pick.expected_performance ? (
                        <span className="text-green-500 font-medium">
                          {pick.expected_performance}
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {pick.rationale || "-"}
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
