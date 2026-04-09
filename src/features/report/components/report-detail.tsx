"use client"

import { useQuery } from "@tanstack/react-query"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { reportDetailQuery } from "../queries"
import type { BlockType, StockSubsectionType } from "../dal/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { FileText, Calendar, Hash } from "lucide-react"

interface ReportRendererProps {
  content: Record<string, unknown>
  type: BlockType
}

// Helper component to render markdown text with proper styling
function MarkdownText({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed break-words overflow-wrap-break-word max-w-full">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-foreground break-words">
            {children}
          </strong>
        ),
        h1: ({ children }) => (
          <h1 className="text-xl font-bold mt-4 mb-2 break-words">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold mt-4 mb-2 break-words">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold mt-3 mb-2 break-words">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-3 space-y-1 break-words">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-3 space-y-1 break-words">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-sm text-muted-foreground break-words">{children}</li>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4 rounded-lg border border-slate-500">
            <table className="min-w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted/80">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody>{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-slate-500 hover:bg-muted/30 transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="border border-slate-500 px-4 py-3 text-left font-semibold text-foreground break-words">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border border-slate-500 px-4 py-3 text-muted-foreground break-words">{children}</td>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

function parseMarkdownTable(text: string): { headers: string[], rows: string[][] } {
  const lines = text.trim().split('\n').filter(line => line.trim() && !line.match(/^\|[-| :]+\|$/))
  if (lines.length === 0) return { headers: [], rows: [] }
  
  const parseRow = (line: string) => {
    return line.split('|').slice(1, -1).map(cell => cell.trim().replace(/\*\*/g, ''))
  }
  
  const headers = parseRow(lines[0])
  const rows = lines.slice(1).map(parseRow)
  return { headers, rows }
}

function BlockRenderer({ content, type }: ReportRendererProps) {
  switch (type) {
    case "HEADING":
      return (
        <MarkdownText text={String(content.text || "")} />
      )
    case "PARAGRAPH":
      return (
        <MarkdownText text={String(content.text || "")} />
      )
    case "TABLE":
      const { headers, rows } = parseMarkdownTable(String(content.text || ""))
      return (
        <Table className="mb-4 border border-slate-500 rounded-md overflow-x-auto">
          <TableHeader>
            <TableRow className="bg-muted/80 border border-slate-500 hover:bg-muted/80">
              {headers.map((h, i) => (
                <TableHead key={i} className="border border-slate-500 font-semibold text-foreground">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i} className="border border-slate-500 hover:bg-muted/30">
                {row.map((cell, j) => (
                  <TableCell key={j} className="border border-slate-500 text-muted-foreground">{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    case "LIST":
      return (
        <div className="mb-4">
          <MarkdownText text={(content.items as string[] || []).join("\n")} />
        </div>
      )
    case "INSIGHT":
      return (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 rounded-lg mb-4 border-l-4 border-amber-500">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">💡 Insight</p>
          <MarkdownText text={String(content.text || "")} />
        </div>
      )
    case "CAUSAL_CHAIN":
      const chainItems = (content.items as string[]) || []
      return (
        <div className="flex flex-wrap items-center gap-2 gap-y-3 mb-4 text-sm">
          {chainItems.map((item, i) => (
            <React.Fragment key={i}>
              <span className="bg-muted/80 px-3 py-1.5 rounded-md border border-slate-500 font-medium text-foreground">
                {item}
              </span>
              {i < chainItems.length - 1 && (
                <span className="text-muted-foreground text-xs font-semibold mx-1">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )
    default:
      return null
  }
}

interface SubsectionRendererProps {
  type: StockSubsectionType
  content: Record<string, unknown>
  tableData?: Record<string, unknown> | null
}

function SubsectionRenderer({ type, content, tableData }: SubsectionRendererProps) {
  const subsectionConfig: Record<StockSubsectionType, { icon: string; label: string; color: string; headingSize: string }> = {
    SEJARAH: { icon: "📜", label: "Sejarah Perusahaan", color: "text-emerald-400", headingSize: "text-xl" },
    BUSINESS_MODEL: { icon: "🏢", label: "Business Model", color: "text-blue-400", headingSize: "text-xl" },
    REVENUE: { icon: "💰", label: "Revenue Breakdown", color: "text-green-400", headingSize: "text-xl" },
    MOAT: { icon: "🛡️", label: "Moat", color: "text-purple-400", headingSize: "text-xl" },
    FINANCIAL: { icon: "📊", label: "Financial Analysis", color: "text-cyan-400", headingSize: "text-xl" },
    FUTURE_PLAN: { icon: "🔮", label: "Future Plan", color: "text-pink-400", headingSize: "text-xl" },
    THEME_CONNECTION: { icon: "🎯", label: "Theme Connection", color: "text-orange-400", headingSize: "text-xl" },
    INVESTMENT_THESIS: { icon: "💎", label: "Investment Thesis", color: "text-yellow-400", headingSize: "text-xl" },
  }

  const config = subsectionConfig[type] || { icon: "📄", label: type, color: "text-muted-foreground", headingSize: "text-lg" }


  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{config.icon}</span>
        <h5 className={`${config.headingSize} font-bold ${config.color}`}>
          {config.label}
        </h5>
      </div>
      <div>
        <MarkdownText text={String(content.text || "")} />
        {tableData && (
          <Table className="mt-3 border border-slate-500 rounded-md overflow-x-auto">
            <TableHeader>
              <TableRow className="bg-muted/80 border border-slate-500 hover:bg-muted/80">
                {((tableData as any).headers as string[] || []).map((h: string, i: number) => (
                  <TableHead key={i} className="border border-slate-500 font-semibold text-foreground">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {((tableData as any).rows as string[][] || []).map((row: string[], i: number) => (
                <TableRow key={i} className="border border-slate-500 hover:bg-muted/30">
                  {row.map((cell: string, j: number) => (
                    <TableCell key={j} className="border border-slate-500 text-muted-foreground">{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

function SectionRenderer({ section }: { section: any }) {
  const sectionConfig: Record<string, { icon: string; label: string; gradient: string }> = {
    EXECUTIVE_SUMMARY: { icon: "📋", label: "Executive Summary", gradient: "from-blue-500/10 to-indigo-500/10" },
    MACRO_ANALYSIS: { icon: "🌍", label: "Macro Analysis", gradient: "from-green-500/10 to-emerald-500/10" },
    IHSG_ANALYSIS: { icon: "📈", label: "IHSG Analysis", gradient: "from-cyan-500/10 to-teal-500/10" },
    SECTOR_MATRIX: { icon: "🏭", label: "Sector Matrix", gradient: "from-orange-500/10 to-amber-500/10" },
    TOP_PICKS: { icon: "⭐", label: "Top Picks", gradient: "from-yellow-500/10 to-orange-500/10" },
    STOCK_DEEP_DIVES: { icon: "🔍", label: "Stock Deep Dives", gradient: "from-purple-500/10 to-pink-500/10" },
    REFERENCES: { icon: "📚", label: "References", gradient: "from-slate-500/10 to-gray-500/10" },
  }

  const config = sectionConfig[section.type] || { icon: "📄", label: section.type, gradient: "from-muted/10 to-muted/5" }

  const blocks = section.blocks?.map((block: any) => (
    <BlockRenderer
      key={block.id}
      type={block.type}
      content={block.content as Record<string, unknown>}
    />
  ))

  return (
    <div className="mb-4">
      {/* Desktop: Card with header */}
      <Card className="hidden md:flex flex-col overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${config.gradient} border-b border-border/50`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <CardTitle className="text-base font-semibold">
              {config.label}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1">
          {blocks}

          {/* Render stock deep dives */}
          {section.type === "STOCK_DEEP_DIVES" && section.stockReports?.length > 0 && (
            <div className="mt-6">
              <Separator className="my-4" />
              <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Stocks Analyzed</h4>
              <div className="grid gap-4">
                {section.stockReports.map((stock: any) => (
                  <Card key={stock.id} className="bg-gradient-to-br from-muted/20 to-muted/10 border-border/50 hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold px-3 py-1 text-sm">
                          {stock.ticker}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">{stock.companyName}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 px-4">
                      {stock.subsections?.map((sub: any) => (
                        <SubsectionRenderer
                          key={sub.id}
                          type={sub.type}
                          content={sub.content as Record<string, unknown>}
                          tableData={sub.tableData}
                        />
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Render references */}
          {section.type === "REFERENCES" && section.references?.length > 0 && (
            <div className="mt-6">
              <Separator className="my-4" />
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Sources</h4>
              <ul className="space-y-2">
                {section.references.map((ref: any) => (
                  <li key={ref.id} className="text-xs text-muted-foreground/80 bg-muted/30 p-2 rounded">
                    <span className="font-medium text-foreground">{ref.authors}</span> ({ref.year}) —{" "}
                    <span className="italic">{ref.title}</span>. {ref.source}
                    {ref.url && (
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline">
                        [Link]
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile: Plain content without card */}
      <div className="flex flex-col md:hidden">
        <div className={`bg-gradient-to-r ${config.gradient} px-4 py-3 rounded-t-lg`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <span className="text-base font-semibold text-foreground">
              {config.label}
            </span>
          </div>
        </div>
        <div className="px-0 pt-4">
          {blocks}

          {/* Render stock deep dives */}
          {section.type === "STOCK_DEEP_DIVES" && section.stockReports?.length > 0 && (
            <div className="mt-4">
              <Separator className="my-4" />
              <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Stocks Analyzed</h4>
              <div className="space-y-4">
                {section.stockReports.map((stock: any) => (
                  <div key={stock.id} className="bg-gradient-to-br from-muted/20 to-muted/10 border border-border/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold px-3 py-1 text-sm">
                        {stock.ticker}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">{stock.companyName}</span>
                    </div>
                    {stock.subsections?.map((sub: any) => (
                      <SubsectionRenderer
                        key={sub.id}
                        type={sub.type}
                        content={sub.content as Record<string, unknown>}
                        tableData={sub.tableData}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render references */}
          {section.type === "REFERENCES" && section.references?.length > 0 && (
            <div className="mt-4">
              <Separator className="my-4" />
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Sources</h4>
              <ul className="space-y-2">
                {section.references.map((ref: any) => (
                  <li key={ref.id} className="text-xs text-muted-foreground/80 bg-muted/30 p-2 rounded">
                    <span className="font-medium text-foreground">{ref.authors}</span> ({ref.year}) —{" "}
                    <span className="italic">{ref.title}</span>. {ref.source}
                    {ref.url && (
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline">
                        [Link]
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ReportDetailProps {
  reportId: string
}

export function ReportDetail({ reportId }: ReportDetailProps) {
  const { data: report, isLoading } = useQuery(reportDetailQuery(reportId))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground animate-pulse">Loading report...</div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Report not found</div>
      </div>
    )
  }

  const latestVersion = report.versions?.[0]

  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      {/* Report Header */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {report.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                <Badge className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground font-medium px-3 py-1">
                  {report.type}
                </Badge>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4 text-primary" />
                  Week of {new Date(report.weekDate).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Hash className="size-4 text-primary" />
                  Version {latestVersion?.version ?? 1}
                </span>
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="size-6 text-primary" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Sections */}
      {latestVersion?.sections?.map((section: any) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      {/* Empty state */}
      {(!latestVersion?.sections || latestVersion.sections.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="size-12 mx-auto mb-4 opacity-50" />
            <p>This report has no sections yet.</p>
            <p className="text-sm mt-2">Run the pipeline to generate content.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
