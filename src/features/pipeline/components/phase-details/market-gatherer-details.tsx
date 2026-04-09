"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Globe, FileText, Newspaper, TrendingUp, Calendar, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"

interface MarketGathererDetailsProps {
  dataSummary: {
    run_id: string
    collected_at: string | null
    status: string | null
    records: {
      macro_data: number
      companies_data: number
      commodities_data: number
      ihsg_news: number
      news_data: number
      world_indices: number
      events_data: number
    }
    total_records: number
    samples: {
      macro_data: any[]
      companies_data: any[]
      commodities_data: any[]
      ihsg_news: any[]
      news_data: any[]
      world_indices: any[]
      events_data: any[]
    }
  }
}

function DataSection({ 
  title, 
  icon: Icon, 
  color, 
  count, 
  data,
  columns 
}: { 
  title: string
  icon: React.ElementType
  color: string
  count: number
  data: any[]
  columns: string[]
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon className={`size-4 ${color}`} />
            {title}
            <Badge variant="outline" className="ml-2">{count}</Badge>
          </CardTitle>
          {data.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-500 hover:underline flex items-center gap-1"
            >
              {expanded ? (
                <>
                  Hide <ChevronUp className="size-3" />
                </>
              ) : (
                <>
                  Show <ChevronDown className="size-3" />
                </>
              )}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data</p>
        ) : expanded ? (
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col} className="text-xs">{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 5).map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col} className="text-xs max-w-[150px] truncate">
                        {row[col] !== null && row[col] !== undefined ? String(row[col]) : "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Click "Show" to view sample data</p>
        )}
      </CardContent>
    </Card>
  )
}

export function MarketGathererDetails({ dataSummary }: MarketGathererDetailsProps) {
  const dataSources = [
    { 
      key: "macro_data", 
      label: "Macro Data", 
      icon: Globe, 
      color: "text-blue-500",
      columns: ["id", "indicator", "value", "date"]
    },
    { 
      key: "companies_data", 
      label: "Companies", 
      icon: FileText, 
      color: "text-green-500",
      columns: ["id", "ticker", "name", "sector"]
    },
    { 
      key: "commodities_data", 
      label: "Commodities", 
      icon: TrendingUp, 
      color: "text-orange-500",
      columns: ["id", "commodity", "price", "unit"]
    },
    { 
      key: "ihsg_news", 
      label: "IHSG News", 
      icon: Newspaper, 
      color: "text-purple-500",
      columns: ["id", "title", "source", "date"]
    },
    { 
      key: "news_data", 
      label: "General News", 
      icon: Newspaper, 
      color: "text-pink-500",
      columns: ["id", "title", "source", "published_at"]
    },
    { 
      key: "world_indices", 
      label: "World Indices", 
      icon: Globe, 
      color: "text-cyan-500",
      columns: ["id", "index_name", "value", "change"]
    },
    { 
      key: "events_data", 
      label: "Events", 
      icon: Calendar, 
      color: "text-yellow-500",
      columns: ["id", "event_name", "date", "impact"]
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="size-4 text-blue-500" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {dataSummary.total_records.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Run ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono truncate">{dataSummary.run_id}</p>
          </CardContent>
        </Card>

        {dataSummary.collected_at && (
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Collected At</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {new Date(dataSummary.collected_at).toLocaleString("id-ID")}
              </p>
            </CardContent>
          </Card>
        )}

        {dataSummary.status && (
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={dataSummary.status === "COMPLETE" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}>
                <CheckCircle2 className="size-3 mr-1" />
                {dataSummary.status}
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Data Samples (click to expand)</h3>
        {dataSources.map(({ key, label, icon, color, columns }) => (
          <DataSection
            key={key}
            title={label}
            icon={icon}
            color={color}
            count={(dataSummary.records as any)[key] || 0}
            data={(dataSummary.samples as any)[key] || []}
            columns={columns}
          />
        ))}
      </div>
    </div>
  )
}
