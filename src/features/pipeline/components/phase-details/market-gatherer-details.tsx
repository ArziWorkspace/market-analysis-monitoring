import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Globe, FileText, Newspaper, TrendingUp, Calendar, CheckCircle2 } from "lucide-react"

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
  }
}

export function MarketGathererDetails({ dataSummary }: MarketGathererDetailsProps) {
  const dataSources = [
    { key: "macro_data", label: "Macro Data", icon: Globe, color: "text-blue-500" },
    { key: "companies_data", label: "Companies", icon: FileText, color: "text-green-500" },
    { key: "commodities_data", label: "Commodities", icon: TrendingUp, color: "text-orange-500" },
    { key: "ihsg_news", label: "IHSG News", icon: Newspaper, color: "text-purple-500" },
    { key: "news_data", label: "General News", icon: Newspaper, color: "text-pink-500" },
    { key: "world_indices", label: "World Indices", icon: Globe, color: "text-cyan-500" },
    { key: "events_data", label: "Events", icon: Calendar, color: "text-yellow-500" },
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

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Records by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dataSources.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <Icon className={`size-4 ${color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{label}</p>
                  <p className="text-lg font-semibold">
                    {(dataSummary.records as any)[key]?.toLocaleString() ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
