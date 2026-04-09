# TODO - Market Analysis Monitoring App

## Pipeline Integration

### Phase Details Storage
- [ ] **Pipeline agent must store JSON details for each phase**
  - Currently all phases return `details: null`
  - When each phase completes, store structured JSON in `Phase.details` field
  - Suggested structure per phase:

#### Data Gathering Phase
```json
{
  "sources": ["macro_data", "ihsg_news", "world_indices"],
  "recordsCollected": 15000,
  "macroData": 500,
  "marketData": 1200,
  "newsData": 8000,
  "ihsgData": 250,
  "commoditiesData": 180,
  "companiesData": 120
}
```

#### Macro Analyst Phase
```json
{
  "themesIdentified": 5,
  "keyThemes": ["US-Iran tensions", "Coal demand surge", "BI rate hold"],
  "sectorsAnalyzed": 9,
  "outlook": "Positive for energy sector"
}
```

#### Stock Screener Phase
```json
{
  "stocksScreened": 750,
  "filtersApplied": ["Market Cap > 1T", "Volume > 1M", "ROE > 15%"],
  "topCandidates": [
    { "ticker": "ADRO.JK", "companyName": "PT Adaro", "score": 85, "reasons": ["Coal exporter", "Strong volume"] }
  ]
}
```

#### Report Generator Phase
```json
{
  "reportId": "uuid-here",
  "reportUrl": "/reports/uuid-here",
  "sectionsGenerated": 7,
  "stocksAnalyzed": 10,
  "wordCount": 8500,
  "generationTime": "2m 30s"
}
```

### Pipeline Trigger
- [ ] **Auto-trigger pipeline on schedule** (daily/weekly)
- [ ] **Manual trigger button** on dashboard
- [ ] **Pipeline status webhook** to update UI in real-time

---

## Report System

### Report Title
- [ ] **Display report title at top of page**
  - Title is stored in `Report.title` field in DB
  - API `/api/report/[id]` doesn't return title yet — needs update
  - Add title to API response, display in `<h1>` at top of report detail

### CAUSAL_CHAIN Block
- [x] Schema updated with `CAUSAL_CHAIN` BlockType
- [x] UI renderer created (horizontal chain with arrows)
- [ ] **Populate existing reports with CAUSAL_CHAIN data**
- [ ] **Update report agent to generate CAUSAL_CHAIN blocks**

### Report Content
- [ ] **Populate pipeline-generated data into report sections**
- [ ] **Add more stock deep dives** (currently limited data)
- [ ] **Add references/citations** to reports

---

## UI Improvements Needed

### Pipeline Dashboard
- [ ] Add "Run Pipeline" button
- [ ] Add real-time status updates (polling or WebSocket)
- [ ] Show phase progress with animations

### Report Detail
- [ ] **Add max-width container** - paragraphs too long on large screens
  - Add `max-w-4xl` or `max-w-6xl` to constrain content width
  - Improve readability with proper line length (60-75 characters)
- [ ] Add print/export functionality
- [ ] Add share button
- [ ] Mobile optimization for complex tables

---

## Data & Analytics

### Database
- [ ] Set up proper indexes for query performance
- [ ] Add data retention policy
- [ ] Backup automation

### Monitoring
- [ ] Add error tracking (Sentry)
- [ ] Add analytics for pipeline success rate
- [ ] Add dashboard metrics

---

## Authentication & Authorization

### Auth Flow
- [ ] Implement proper RBAC (already has Role/Permission tables)
- [ ] Add role-based page access
- [ ] Add API key for external pipeline triggers

---

## Testing

- [ ] Unit tests for phase detail renderers
- [ ] Integration tests for pipeline API
- [ ] E2E tests with Playwright

---

## Documentation

- [x] REPORT_DATA_GUIDELINES.md - created
- [ ] Pipeline agent documentation
- [ ] API documentation (Swagger/OpenAPI)

---

## Priority Order

1. **Pipeline phase details storage** - Without this, phase detail page shows empty
2. **Report population** - Reports need data to be useful
3. **Pipeline trigger** - Automated pipeline runs
4. **UI polish** - Based on user feedback
