// Re-export Prisma enums for convenience
export type { ReportType, SectionType, BlockType, StockSubsectionType }

// Also export Prisma models
export type {
  Report,
  ReportVersion,
  Section,
  Block,
  StockReport,
  StockSubsection,
  Reference,
} from "@prisma/client"
