import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface SectorAnalystPhaseDetailsProps {
  // Templated - data structure to be defined
  analysisData?: {
    sectorsAnalyzed?: string[];
    topSectors?: Array<{ name: string; performance: string; outlook: string }>;
    worstSectors?: Array<{
      name: string;
      performance: string;
      outlook: string;
    }>;
  } | null;
}

export function SectorAnalystPhaseDetails({
  analysisData,
}: SectorAnalystPhaseDetailsProps) {
  return (
    <div className="space-y-4">
      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Building2 className="size-4 text-orange-500" />
            Sector Analysis - Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Sector analysis data structure is being defined.
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Top Performing Sectors
              </p>
              <div className="space-y-2">
                {analysisData?.topSectors?.map((sector, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded bg-muted/50"
                  >
                    <span className="font-medium">{sector.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-500">
                        <TrendingUp className="size-3 mr-1" />
                        {sector.performance}
                      </Badge>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">No data yet</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <AlertCircle className="size-3" />
        Waiting for pipeline agent to store sector analysis data
      </div>
    </div>
  );
}
