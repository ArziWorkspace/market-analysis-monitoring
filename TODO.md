# TODO - Market Analysis Monitoring App

## Pipeline Integration

### Phase Details Display (REFACTOR NEEDED)
- [ ] **Each phase has data in separate tables, not JSON in Phase.details**
  - Current approach: Show `Phase.details` JSON ❌ WRONG
  - Correct approach: Query phase-specific tables ✓

#### Phase Data Sources (per phase type)
- **Phase 1 (Market Gatherer)** → `Phase` → `market_data_runs` → related tables:
  - `macro_data`, `companies_data`, `commodities_data`, `ihsg_news`, `news_data`, `world_indices`, `events_data`
  - Show: records collected per source, timestamps

- **Phase 2-7** → Not yet configured. Show "Coming soon" placeholder.

- **Phase 8 (Report Generator)** → Link to `/reports/{reportId}` directly
  - Need to find how Report connects to Pipeline (via `pipeline_run_id`?)
  - Currently Report doesn't have pipeline_run_id — may need to add or find by date match

### Phase Detail API Refactor
- [ ] **Phase 1 API** — Query `market_data_runs` + count records from each related table
- [ ] **Phase 8 API** — Link to report detail page (find report by pipeline run)
- [ ] **Phase 2-7** — Show "No data yet" placeholder

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
- [ ] **Add disclaimer section** - static disclaimer at bottom of report detail page
  - Disclaimer text: "This report is for informational purposes only and does not constitute financial advice. Past performance is not indicative of future results."
  - Small text, muted color, centered

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
