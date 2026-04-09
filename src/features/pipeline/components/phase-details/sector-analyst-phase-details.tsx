"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2 } from "lucide-react"

interface SectorAnalysis {
  id: string
  winning_sectors: Prisma.JsonValue | null
  losing_sectors: Prisma.JsonValue | null
  markdown_summary: string | null
  status: string | null
  created_at: string | null
}

interface SectorComponent {
  id: string
  sector_name: string | null
  verdict: string | null
  performance: string | null
  rationale: string | null
  created_at: string | null
}

interface SectorAnalystPhaseDetailsProps {
  sectorAnalysis: SectorAnalysis | null
  sectorComponents: SectorComponent[]
}

function getVerdictIcon(verdict: string | null) {
  switch (verdict) {
    case "WINNER":
      return <TrendingUp className="size-4 text-green-500" />
    case "LOSER":
      return <TrendingDown className="size-4 text-red-500" />
    case "NEUTRAL":
      return <Minus className="size-4 text-yellow-500" />
    default:
      return <Minus className="size-4 text-gray-500" />
  }
}

function getVerdictColor(verdict: string | null) {
  switch (verdict) {
    case "WINNER":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "LOSER":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "NEUTRAL":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

function JsonList({ title, data }: { title: string; data: Prisma.JsonValue | null }) {
  if (!data) return null
  
  const items = Array.isArray(data) ? data : []
  
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <div className="space-y-1">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-green-500">•</span>
            <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectorAnalystPhaseDetails({ sectorAnalysis, sectorComponents }: SectorAnalystPhaseDetailsProps) {
  if (!sectorAnalysis && sectorComponents.length === 0) {
    return (
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="size-4" />
            No Sector Analysis Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sector analysis has not been completed for this pipeline run yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  const winners = sectorComponents.filter(c => c.verdict === "WINNER")
  const losers = sectorComponents.filter(c => c.verdict === "LOSER")
  const neutrals = sectorComponents.filter(c => c.verdict === "NEUTRAL")

  return (
    <div className="space-y-4">
      {sectorAnalysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="size-4 text-orange-500" />
                Sector Analysis
                {sectorAnalysis.status && (
                  <Badge className={sectorAnalysis.status === "COMPLETE" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}>
                    <CheckCircle2 className="size-3 mr-1" />
                    {sectorAnalysis.status}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sectorAnalysis.markdown_summary && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Summary</p>
                  <p className="text-sm whitespace-pre-wrap">{sectorAnalysis.markdown_summary}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {sectorAnalysis.winning_sectors && (
                  <JsonList title="Winning Sectors" data={sectorAnalysis.winning_sectors} />
                )}
                {sectorAnalysis.losing_sectors && (
                  <JsonList title="Losing Sectors" data={sectorAnalysis.losing_sectors} />
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {sectorComponents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="size-4 text-orange-500" />
              Sector Components ({sectorComponents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Verdict</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectorComponents.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell>
                      <Badge className={getVerdictColor(comp.verdict)}>
                        <span className="mr-1">{getVerdictIcon(comp.verdict)}</span>
                        {comp.verdict || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{comp.sector_name || "-"}</TableCell>
                    <TableCell>
                      {comp.performance ? (
                        <span className={comp.performance.includes("+") ? "text-green-500" : comp.performance.includes("-") ? "text-red-500" : ""}>
                          {comp.performance}
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {comp.rationale || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {winners.length > 0 && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-green-600 dark:text-green-400">
              <TrendingUp className="size-4" />
              Winners ({winners.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {winners.map((w) => (
                <Badge key={w.id} className="bg-green-500/10 text-green-500 border-green-500/20">
                  {w.sector_name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {losers.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-red-600 dark:text-red-400">
              <TrendingDown className="size-4" />
              Losers ({losers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {losers.map((l) => (
                <Badge key={l.id} className="bg-red-500/10 text-red-500 border-red-500/20">
                  {l.sector_name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
