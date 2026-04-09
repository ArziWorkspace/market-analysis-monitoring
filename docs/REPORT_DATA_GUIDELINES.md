# Report Data Creation Guidelines

This document defines the data structure for report sections and blocks, aligned with the UI design.

## Overview

Each report consists of:
- **Report** → contains **ReportVersions**
- **ReportVersion** → contains **Sections** (ordered by `order` field)
- **Section** → contains **Blocks**, **StockReports**, or **References**

## Section Types

### 1. EXECUTIVE_SUMMARY
**Purpose:** High-level overview of the entire analysis.

**Content:** Mix of PARAGRAPH and HEADING blocks. Use HEADING for section titles within the summary.

**Example Blocks:**
```json
{
  "type": "PARAGRAPH",
  "content": {
    "text": "This week marked a significant escalation in geopolitical tensions with the Strait of Hormuz crisis. **20% of the world's seaborne oil** passed through this critical chokepoint, creating substantial market uncertainty."
  }
}
```

---

### 2. MACRO_ANALYSIS
**Purpose:** Analysis of macroeconomic themes affecting the market.

**Content:** PARAGRAPH blocks with key insights. Use **bold** for important data points.

**Example:**
```json
{
  "type": "PARAGRAPH",
  "content": {
    "text": "The US-Iran conflict has disrupted **$110 per barrel** oil pricing. **12 million barrels of oil have been lost** due to transit delays and security concerns."
  }
}
```

---

### 3. IHSG_ANALYSIS
**Purpose:** Indonesian Stock Exchange (IHSG) fundamental analysis.

**Content:** PARAGRAPH with TABLE for numeric data.

**Example TABLE:**
```json
{
  "type": "TABLE",
  "content": {
    "headers": ["Metric", "Current", "Previous", "Change"],
    "rows": [
      ["IHSG Price", "7,500", "7,350", "+2.0%"],
      ["Volume", "15.2B", "14.8B", "+2.7%"],
      ["Market Cap", "12.5T", "12.2T", "+2.5%"]
    ]
  }
}
```

---

### 4. SECTOR_MATRIX
**Purpose:** Chain reaction analysis across sectors + sector impact matrix.

**Content:** PARAGRAPH for analysis + TABLE for sector breakdown.

**Example TABLE:**
```json
{
  "type": "TABLE",
  "content": {
    "headers": ["Sector", "Impact", "Outlook", "Key Drivers"],
    "rows": [
      ["Energy", "High", "Positive", "Oil price surge"],
      ["Mining", "Medium", "Neutral", "Commodity volatility"],
      ["Finance", "Low", "Stable", "Interest rate stability"]
    ]
  }
}
```

---

### 5. TOP_PICKS
**Purpose:** Top 10 stock recommendations.

**Content:** PARAGRAPH with LIST or TABLE for stock picks.

**Example TABLE:**
```json
{
  "type": "TABLE",
  "content": {
    "headers": ["Ticker", "Company", "Sector", "Rating", "Target Price"],
    "rows": [
      ["BBCA.JK", "Bank Central Asia", "Finance", "Buy", "Rp 10,500"],
      ["UNTR.JK", "United Tractors", "Mining", "Buy", "Rp 42,000"],
      ["PTBA.JK", "PT Bukit Asam", "Coal", "Hold", "Rp 14,200"]
    ]
  }
}
```

---

### 6. STOCK_DEEP_DIVES
**Purpose:** Detailed analysis of individual stocks.

**Content:** No direct blocks. Instead, contains **StockReports** with **Subsections**.

#### StockReport Structure
```json
{
  "ticker": "ADRO.JK",
  "companyName": "PT Adaro Energy Indonesia Tbk"
}
```

#### Subsections (per StockReport)
Each StockReport contains **StockSubsection** records with these types:

| SubsectionType | Icon | Label | Content Type |
|----------------|------|-------|--------------|
| SEJARAH | 📜 | Sejarah Perusahaan | Company history, establishment |
| BUSINESS_MODEL | 🏢 | Business Model | How the company makes money |
| REVENUE | 💰 | Revenue Breakdown | Revenue streams, segments |
| MOAT | 🛡️ | Moat | Competitive advantages |
| FINANCIAL | 📊 | Financial Analysis | Key financial metrics |
| FUTURE_PLAN | 🔮 | Future Plan | Expansion, projects |
| THEME_CONNECTION | 🎯 | Theme Connection | How it ties to macro themes |
| INVESTMENT_THESIS | 💎 | Investment Thesis | Buy/sell rationale |

#### Subsection Content Format
```json
{
  "type": "SEJARAH",
  "content": {
    "text": "PT Adaro Energy Indonesia Tbk was established in **1990** as a coal mining company. The company operates **40 key energy assets** across Indonesia and has grown to become one of the largest coal producers in Southeast Asia."
  },
  "tableData": null  // Optional, use for financial data tables
}
```

---

### 7. REFERENCES
**Purpose:** Sources and citations.

**Content:** No blocks. Contains **Reference** records.

#### Reference Structure
```json
{
  "authors": "John Smith",
  "year": "2024",
  "title": "Indonesia's Energy Sector Outlook",
  "source": "Bloomberg Research",
  "url": "https://example.com/report"
}
```

---

## Block Types

### PARAGRAPH
```json
{
  "type": "PARAGRAPH",
  "content": {
    "text": "Your paragraph text here. Use **bold** for emphasis on key data points."
  }
}
```

**Guidelines:**
- Use `**text**` for bold (will render as `<strong>`)
- Keep paragraphs focused on one idea
- Include 20-30px margin between paragraphs for readability

---

### HEADING
```json
{
  "type": "HEADING",
  "content": {
    "text": "Section Title Here"
  }
}
```

**Guidelines:**
- Use sparingly within sections
- For subsection titles, use StockSubsection types instead

---

### TABLE
```json
{
  "type": "TABLE",
  "content": {
    "headers": ["Column 1", "Column 2", "Column 3"],
    "rows": [
      ["Data 1", "Data 2", "Data 3"],
      ["Data 4", "Data 5", "Data 6"]
    ]
  }
}
```

**Guidelines:**
- Keep headers short (1-3 words)
- Max 6 columns for readability
- Use meaningful data, not filler

---

### LIST
```json
{
  "type": "LIST",
  "content": {
    "items": ["Item 1", "Item 2", "Item 3"]
  }
}
```

**Guidelines:**
- Use for bullet points or rankings
- Max 10 items per list
- Keep items concise

---

### INSIGHT
```json
{
  "type": "INSIGHT",
  "content": {
    "text": "Key insight or takeaway here."
  }
}
```

**Guidelines:**
- Use sparingly - only for critical insights
- One insight per block
- Make it impactful and actionable

---

## Common Patterns

### Good Paragraph Structure
```json
{
  "type": "PARAGRAPH",
  "content": {
    "text": "The **Strait of Hormuz crisis** has significantly impacted global oil markets. **20% of the world's seaborne oil** flows through this critical chokepoint, representing **$110 per barrel** of crude oil pricing risk."
  }
}
```

### Stock Deep Dive Structure
```json
{
  "sectionType": "STOCK_DEEP_DIVES",
  "stocks": [
    {
      "ticker": "ADRO.JK",
      "companyName": "PT Adaro Energy Indonesia Tbk",
      "subsections": [
        { "type": "SEJARAH", "content": { "text": "..." } },
        { "type": "BUSINESS_MODEL", "content": { "text": "..." } },
        { "type": "REVENUE", "content": { "text": "..." }, "tableData": {...} },
        { "type": "MOAT", "content": { "text": "..." } },
        { "type": "FINANCIAL", "content": { "text": "..." }, "tableData": {...} },
        { "type": "FUTURE_PLAN", "content": { "text": "..." } },
        { "type": "THEME_CONNECTION", "content": { "text": "..." } },
        { "type": "INVESTMENT_THESIS", "content": { "text": "..." } }
      ]
    }
  ]
}
```

---

## Data Validation Checklist

Before creating report data, ensure:

- [ ] All `type` values match the enum definitions
- [ ] PARAGRAPH content has `text` field
- [ ] TABLE content has `headers` and `rows` fields
- [ ] StockSubsection `type` matches allowed values
- [ ] `order` fields are sequential (1, 2, 3...)
- [ ] Bold text uses `**text**` format
- [ ] Tables have meaningful headers (not generic like "Column 1")
- [ ] Stock tickers use `.JK` suffix (Indonesian market)

---

## Raw SQL Insertion (without Prisma)

Use `psql` or any PostgreSQL client to execute these queries.

### 1. Create Report
```sql
INSERT INTO "Report" (id, type, title, "weekDate", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'WEEKLY',
  'Market Analysis Report',
  '2026-04-08',
  NOW(),
  NOW()
)
RETURNING id;
```

### 2. Create ReportVersion
```sql
INSERT INTO "ReportVersion" (id, "reportId", version, "createdAt")
VALUES (
  gen_random_uuid(),
  '<report_id_from_step1>',
  1,
  NOW()
)
RETURNING id;
```

### 3. Create Section
```sql
INSERT INTO "Section" (id, "versionId", type, title, "order")
VALUES (
  gen_random_uuid(),
  '<version_id_from_step2>',
  'EXECUTIVE_SUMMARY',
  'Executive Summary',
  1
);
```

### 4. Create Block (Paragraph)
```sql
INSERT INTO "Block" (id, "sectionId", "order", type, content, "createdAt")
VALUES (
  gen_random_uuid(),
  '<section_id>',
  1,
  'PARAGRAPH',
  '{"text": "This week marked a significant escalation in geopolitical tensions. **20% of global oil** flows through the Strait of Hormuz, creating substantial market uncertainty."}'::jsonb,
  NOW()
);
```

### 5. Create Block (Table)
```sql
INSERT INTO "Block" (id, "sectionId", "order", type, content, "createdAt")
VALUES (
  gen_random_uuid(),
  '<section_id>',
  2,
  'TABLE',
  '{
    "headers": ["Metric", "Current", "Previous", "Change"],
    "rows": [
      ["IHSG Price", "7,500", "7,350", "+2.0%"],
      ["Volume", "15.2B", "14.8B", "+2.7%"]
    ]
  }'::jsonb,
  NOW()
);
```

### 6. Create Stock Deep Dive Section
```sql
-- Create the section first
INSERT INTO "Section" (id, "versionId", type, title, "order")
VALUES (
  gen_random_uuid(),
  '<version_id>',
  'STOCK_DEEP_DIVES',
  'Stock Deep Dives',
  6
)
RETURNING id;
```

### 7. Create StockReport
```sql
INSERT INTO "StockReport" (id, "sectionId", ticker, "companyName", "createdAt")
VALUES (
  gen_random_uuid(),
  '<section_id>',
  'ADRO.JK',
  'PT Adaro Energy Indonesia Tbk',
  NOW()
)
RETURNING id;
```

### 8. Create StockSubsection
```sql
INSERT INTO "StockSubsection" (id, "stockId", type, "order", content, "tableData", "createdAt")
VALUES (
  gen_random_uuid(),
  '<stockreport_id>',
  'SEJARAH',
  1,
  '{"text": "PT Adaro Energy Indonesia Tbk was established in **1990** as a coal mining company. The company operates **40 key energy assets** across Indonesia."}'::jsonb,
  NULL,
  NOW()
);

-- With table data (example for FINANCIAL subsection)
INSERT INTO "StockSubsection" (id, "stockId", type, "order", content, "tableData", "createdAt")
VALUES (
  gen_random_uuid(),
  '<stockreport_id>',
  'FINANCIAL',
  5,
  '{"text": "Key financial metrics for FY2025"}'::jsonb,
  '{
    "headers": ["Metric", "2024", "2025E", "Change"],
    "rows": [
      ["Revenue", "$4.2B", "$4.8B", "+14%"],
      ["EBITDA", "$1.8B", "$2.1B", "+17%"]
    ]
  }'::jsonb,
  NOW()
);
```

### 9. Create Reference
```sql
INSERT INTO "Reference" (id, "sectionId", authors, year, title, source, url)
VALUES (
  gen_random_uuid(),
  '<section_id>',
  'John Smith',
  '2024',
  'Indonesia Energy Sector Outlook',
  'Bloomberg Research',
  'https://example.com/report'
);
```

---

## Order of Operations

1. **Report** → 2. **ReportVersion** → 3. **Section** → 4. **Block/StockReport/Reference**

For **STOCK_DEEP_DIVES**: Section → StockReport → StockSubsection

---

## Important Notes

- Use `gen_random_uuid()` or `uuid_generate_v4()` for IDs
- JSON content must be valid JSON (use `::jsonb` cast in PostgreSQL)
- Order fields should be sequential: 1, 2, 3...
- SectionType enum values: `EXECUTIVE_SUMMARY`, `MACRO_ANALYSIS`, `IHSG_ANALYSIS`, `SECTOR_MATRIX`, `TOP_PICKS`, `STOCK_DEEP_DIVES`, `REFERENCES`
- BlockType enum values: `PARAGRAPH`, `HEADING`, `TABLE`, `LIST`, `INSIGHT`
- StockSubsectionType enum values: `SEJARAH`, `BUSINESS_MODEL`, `REVENUE`, `MOAT`, `FINANCIAL`, `FUTURE_PLAN`, `THEME_CONNECTION`, `INVESTMENT_THESIS`

---

## Contact

For questions about data structure, contact the Dev team.
