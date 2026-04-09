import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, AlertCircle } from "lucide-react";

interface StockAnalystPhaseDetailsProps {
  // Templated - data structure to be defined
  analysisData?: {
    stocksAnalyzed?: string[];
    recommendations?: Array<{
      ticker: string;
      companyName: string;
      rating: string;
      targetPrice: string;
      rationale: string;
    }>;
  } | null;
}

export function StockAnalystPhaseDetails({
  analysisData,
}: StockAnalystPhaseDetailsProps) {
  return (
    <div className="space-y-4">
      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="size-4 text-purple-500" />
            Stock Analyst - Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Individual stock analysis data structure is being defined.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Stocks Analyzed</p>
              <p className="text-2xl font-bold">
                {analysisData?.stocksAnalyzed?.length ?? "—"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Recommendations</p>
              <p className="text-2xl font-bold">
                {analysisData?.recommendations?.length ?? 0}
              </p>
            </div>
          </div>

          {analysisData?.recommendations &&
            analysisData.recommendations.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Target</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysisData.recommendations.map((rec, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono font-medium">
                        {rec.ticker}
                      </TableCell>
                      <TableCell>{rec.companyName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rec.rating}</Badge>
                      </TableCell>
                      <TableCell>{rec.targetPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <AlertCircle className="size-3" />
        Waiting for pipeline agent to store stock analysis data
      </div>
    </div>
  );
}
