import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Globe, FileText, CheckCircle2 } from "lucide-react"

interface DataGathererDetailsProps {
  details: {
    sources?: string[]
    recordsCollected?: number
    macroData?: number
    marketData?: number
    newsData?: number
    ihsgData?: number
    commoditiesData?: number
    companiesData?: number
    [key: string]: unknown
  }
}

export function DataGathererDetails({ details }: DataGathererDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="size-4 text-blue-500" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.recordsCollected?.toLocaleString() ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="size-4 text-green-500" />
              Macro Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.macroData?.toLocaleString() ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="size-4 text-orange-500" />
              Market Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.marketData?.toLocaleString() ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="size-4 text-purple-500" />
              News Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.newsData?.toLocaleString() ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {details.sources && details.sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(details.sources as string[]).map((source, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  <CheckCircle2 className="size-3 mr-1 text-green-500" />
                  {source}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
