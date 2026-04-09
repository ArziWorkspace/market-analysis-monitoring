"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Users, Building2, AlertCircle, CheckCircle2 } from "lucide-react"

interface IhsgAnalysis {
  id: string
  outlook: string | null
  fundamentals: Prisma.JsonValue | null
  foreign_flow: Prisma.JsonValue | null
  msci_policy: Prisma.JsonValue | null
  sector_rotation: Prisma.JsonValue | null
  scalar: Prisma.JsonValue | null
  status: string | null
  created_at: string | null
}

interface IhsgComponent {
  id: string
  component_type: string | null
  factor: string | null
  contribution: number | null
  rationale: string | null
  created_at: string | null
}

interface IhsgAnalystPhaseDetailsProps {
  ihsgAnalysis: IhsgAnalysis | null
  ihsgComponents: IhsgComponent[]
}

function getComponentIcon(type: string | null) {
  switch (type) {
    case "GLOBAL_FACTOR":
      return <Globe className="size-4 text-blue-500" />
    case "DOMESTIC_FACTOR":
      return <Building2 className="size-4 text-green-500" />
    case "SECTOR":
      return <TrendingUp className="size-4 text-orange-500" />
    case "STOCK":
      return <Users className="size-4 text-purple-500" />
    default:
      return <TrendingUp className="size-4 text-gray-500" />
  }
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

export function IhsgAnalystPhaseDetails({ ihsgAnalysis, ihsgComponents }: IhsgAnalystPhaseDetailsProps) {
  if (!ihsgAnalysis && ihsgComponents.length === 0) {
    return (
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="size-4" />
            No IHSG Analysis Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            IHSG analysis has not been completed for this pipeline run yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {ihsgAnalysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="size-4 text-blue-500" />
                IHSG Analysis
                {ihsgAnalysis.status && (
                  <Badge className={ihsgAnalysis.status === "COMPLETE" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}>
                    <CheckCircle2 className="size-3 mr-1" />
                    {ihsgAnalysis.status}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ihsgAnalysis.outlook && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Near Term Outlook</p>
                  <p className="font-medium">{ihsgAnalysis.outlook}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {ihsgAnalysis.scalar && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Scalar</p>
                    <p className="text-sm font-medium">{(ihsgAnalysis.scalar as any)?.value ?? ihsgAnalysis.scalar}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {ihsgAnalysis.fundamentals && (
            <JsonCard title="Fundamentals" data={ihsgAnalysis.fundamentals} />
          )}

          {ihsgAnalysis.foreign_flow && (
            <JsonCard title="Foreign Flow" data={ihsgAnalysis.foreign_flow} />
          )}

          {ihsgAnalysis.msci_policy && (
            <JsonCard title="MSCI Policy" data={ihsgAnalysis.msci_policy} />
          )}

          {ihsgAnalysis.sector_rotation && (
            <JsonCard title="Sector Rotation" data={ihsgAnalysis.sector_rotation} />
          )}
        </>
      )}

      {ihsgComponents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="size-4 text-orange-500" />
              IHSG Components ({ihsgComponents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Factor</TableHead>
                  <TableHead>Contribution</TableHead>
                  <TableHead>Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ihsgComponents.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getComponentIcon(comp.component_type)}
                        <Badge variant="outline" className="text-xs">
                          {comp.component_type || "N/A"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{comp.factor || "-"}</TableCell>
                    <TableCell>
                      {comp.contribution !== null ? (
                        <span className={comp.contribution >= 0 ? "text-green-500" : "text-red-500"}>
                          {comp.contribution >= 0 ? "+" : ""}{comp.contribution.toFixed(2)}
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
    </div>
  )
}
