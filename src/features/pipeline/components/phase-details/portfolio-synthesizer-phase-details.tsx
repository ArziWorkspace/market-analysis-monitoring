"use client";

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
import {
  PieChart,
  AlertCircle,
  TrendingUp,
  Shield,
  Target,
} from "lucide-react";

interface FundamentalAnalysis {
  id: string;
  overall_market_assessment: string | null;
  theme_recap: string | null;
  portfolio_strategy: string | null;
  risk_factors: unknown | null;
  sector_allocation: unknown | null;
  summary: string | null;
  status: string | null;
  created_at: string | null;
}

interface PortfolioRecommendation {
  id: string;
  ticker: string;
  recommendation_rating: string | null;
  conviction_level: string | null;
  reasoning: string | null;
  allocation_pct: number | null;
  position_size_rationale: string | null;
  entry_price_target: string | null;
  exit_criteria: string | null;
  risk_reward_ratio: string | null;
}

interface PortfolioSynthesizerPhaseDetailsProps {
  fundamentalAnalysis: FundamentalAnalysis | null;
  portfolioRecommendations: PortfolioRecommendation[];
}

function getRatingColor(rating: string | null): string {
  switch (rating?.toUpperCase()) {
    case "BUY":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "HOLD":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "SELL":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
}

function getConvictionColor(level: string | null): string {
  switch (level?.toUpperCase()) {
    case "VERY HIGH":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "HIGH":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "MEDIUM":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "LOW":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
}

export function PortfolioSynthesizerPhaseDetails({
  fundamentalAnalysis,
  portfolioRecommendations,
}: PortfolioSynthesizerPhaseDetailsProps) {
  if (!fundamentalAnalysis && portfolioRecommendations.length === 0) {
    return (
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="size-4" />
            No Portfolio Synthesis Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Portfolio synthesis has not been completed for this pipeline run
            yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {fundamentalAnalysis && (
        <>
          {/* Overall Market Assessment */}
          {fundamentalAnalysis.overall_market_assessment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="size-4 text-blue-500" />
                  Overall Market Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {fundamentalAnalysis.overall_market_assessment}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Theme Recap */}
          {fundamentalAnalysis.theme_recap && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="size-4 text-purple-500" />
                  Theme Recap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {fundamentalAnalysis.theme_recap}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Portfolio Strategy */}
          {fundamentalAnalysis.portfolio_strategy && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <PieChart className="size-4 text-green-500" />
                  Portfolio Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {fundamentalAnalysis.portfolio_strategy}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Risk Factors */}
          {fundamentalAnalysis.risk_factors && (
            <Card className="border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Shield className="size-4" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(fundamentalAnalysis.risk_factors, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Sector Allocation */}
          {fundamentalAnalysis.sector_allocation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <PieChart className="size-4 text-orange-500" />
                  Sector Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(
                    fundamentalAnalysis.sector_allocation,
                    null,
                    2,
                  )}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {fundamentalAnalysis.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {fundamentalAnalysis.summary}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Portfolio Recommendations */}
      {portfolioRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChart className="size-4 text-green-500" />
              Portfolio Recommendations ({portfolioRecommendations.length}{" "}
              stocks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Conviction</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead>Entry Target</TableHead>
                  <TableHead>Risk/Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioRecommendations.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-mono font-bold">
                      {rec.ticker}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getRatingColor(rec.recommendation_rating)}
                      >
                        {rec.recommendation_rating || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getConvictionColor(rec.conviction_level)}
                      >
                        {rec.conviction_level || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rec.allocation_pct ? `${rec.allocation_pct}%` : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {rec.entry_price_target || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {rec.risk_reward_ratio || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Reasoning for each recommendation */}
      {portfolioRecommendations.filter((r) => r.reasoning).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Stock Reasoning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {portfolioRecommendations
              .filter((rec) => rec.reasoning)
              .map((rec) => (
                <div
                  key={rec.id}
                  className="border-b border-border pb-3 last:border-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-green-500">
                      {rec.ticker}
                    </span>
                    <Badge
                      className={getRatingColor(rec.recommendation_rating)}
                    >
                      {rec.recommendation_rating}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rec.reasoning}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
