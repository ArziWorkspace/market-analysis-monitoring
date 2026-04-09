import { prisma } from "@/lib/prisma"
import type {
  Report,
  ReportType,
  SectionType,
  BlockType,
  StockSubsectionType,
} from "./types"

// Report CRUD
export async function getReports() {
  return prisma.report.findMany({
    include: { versions: { include: { sections: true } } },
    orderBy: { weekDate: "desc" },
  })
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: {
      versions: {
        include: {
          sections: {
            include: {
              blocks: { orderBy: { order: "asc" } },
              stockReports: {
                include: { subsections: { orderBy: { order: "asc" } } },
              },
              references: true,
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  })
}

export async function getLatestReport() {
  return prisma.report.findFirst({
    include: {
      versions: {
        include: {
          sections: {
            include: {
              blocks: { orderBy: { order: "asc" } },
              stockReports: {
                include: { subsections: { orderBy: { order: "asc" } } },
              },
              references: true,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { version: "desc" },
        take: 1,
      },
    },
    orderBy: { weekDate: "desc" },
  })
}

export async function createReport(data: {
  type: ReportType
  title: string
  weekDate: Date
}) {
  return prisma.report.create({ data })
}

// ReportVersion CRUD
export async function createReportVersion(data: {
  reportId: string
  version: number
}) {
  return prisma.reportVersion.create({ data })
}

// Section CRUD
export async function createSection(data: {
  versionId: string
  type: SectionType
  title: string
  order: number
}) {
  return prisma.section.create({ data })
}

// Block CRUD
export async function createBlock(data: {
  sectionId: string
  order: number
  type: BlockType
  content: Record<string, unknown>
}) {
  return prisma.block.create({ data })
}

// StockReport CRUD
export async function createStockReport(data: {
  sectionId: string
  ticker: string
  companyName: string
}) {
  return prisma.stockReport.create({ data })
}

// StockSubsection CRUD
export async function createStockSubsection(data: {
  stockId: string
  type: StockSubsectionType
  order: number
  content: Record<string, unknown>
  tableData?: Record<string, unknown>
}) {
  return prisma.stockSubsection.create({ data })
}

// Reference CRUD
export async function createReference(data: {
  sectionId: string
  authors: string
  year: string
  title: string
  source: string
  url?: string
}) {
  return prisma.reference.create({ data })
}
