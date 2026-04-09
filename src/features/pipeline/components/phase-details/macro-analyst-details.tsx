import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Globe } from "lucide-react"

interface MacroAnalystDetailsProps {
  details: {
    themesIdentified?: number
    keyThemes?: string[]
    sectorsAnalyzed?: number
    outlook?: string
    [key: string]: unknown
  }
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend.toLowerCase().includes("positive") || trend.toLowerCase().includes("bullish")) {
    return <TrendingUp className="size-4 text-green-500" />
  }
  if (trend.toLowerCase().includes("negative") || trend.toLowerCase().includes("bearish")) {
    return <TrendingDown className="size-4 text-red-500" />
  }
  return <Minus className="size-4 text-yellow-500" />
}

export function MacroAnalystDetails({ details }: MacroAnalystDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="size-4 text-blue-500" />
              Themes Identified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.themesIdentified ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="size-4 text-green-500" />
              Sectors Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {details.sectorsAnalyzed ?? "—"}
            </p>
          </CardContent>
        </Card>

        {details.outlook && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Market Outlook</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="flex w-fit gap-1">
                <TrendIcon trend={details.outlook as string} />
                {details.outlook}
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>

      {details.keyThemes && details.keyThemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Key Macro Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(details.keyThemes as string[]).map((theme, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground">•</span>
                  <span>{theme}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
