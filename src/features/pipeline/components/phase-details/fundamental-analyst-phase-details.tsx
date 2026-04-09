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
import { FileText, AlertCircle } from "lucide-react";

interface FundamentalAnalystPhaseDetailsProps {
  // Templated - data structure to be defined
  analysisData?: {
    financialsAnalyzed?: string[];
    keyFindings?: Array<{
      ticker: string;
      companyName: string;
      roe: string;
      debtToEquity: string;
      valuation: string;
    }>;
  } | null;
}

export function FundamentalAnalystPhaseDetails({
  analysisData,
}: FundamentalAnalystPhaseDetailsProps) {
  return (
    <div className="space-y-4">
      <Card className="border-cyan-500/30 bg-cyan-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="size-4 text-cyan-500" />
            Fundamental Analyst - Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Fundamental analysis data structure is being defined.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">
                Financials Analyzed
              </p>
              <p className="text-2xl font-bold">
                {analysisData?.financialsAnalyzed?.length ?? "—"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Key Findings</p>
              <p className="text-2xl font-bold">
                {analysisData?.keyFindings?.length ?? 0}
              </p>
            </div>
          </div>

          {analysisData?.keyFindings && analysisData.keyFindings.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>ROE</TableHead>
                  <TableHead>D/E</TableHead>
                  <TableHead>Valuation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysisData.keyFindings.map((finding, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono font-medium">
                      {finding.ticker}
                    </TableCell>
                    <TableCell>{finding.companyName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{finding.roe}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{finding.debtToEquity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{finding.valuation}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <AlertCircle className="size-3" />
        Waiting for pipeline agent to store fundamental analysis data
      </div>
    </div>
  );
}
