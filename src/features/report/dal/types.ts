// Re-export Prisma enums for convenience
import type { ReportType, SectionType, BlockType, StockSubsectionType } from "@prisma/client"
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
