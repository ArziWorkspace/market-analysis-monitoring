# Pipeline Dashboard MVP

## Overview
Simple dashboard to monitor the market analysis pipeline — show run history and current pipeline status.

## User Story
As a user, I want to see:
1. Whether a pipeline run is currently in progress (and which phase)
2. Historical runs with their status and timestamps
3. Key output files per run (links to reports)

## Data Sources

### Pipeline Tracker
`~/.openclaw/shared-data/pipeline_tracker.json`
- Array of runs, each with run_id, date, started_at, phases[]

### Pipeline Tracking (active)
`~/.openclaw/shared-data/pipeline_tracking.json`
- Current active run info (if any)

### Run Counter
`~/.openclaw/shared-data/run_counter.txt`
- Simple integer, current run number

## Pages

### `/pipeline` (Dashboard)
**Layout:**
- Header: "Market Analysis Pipeline"
- Current Status card (if run in progress)
- Latest Run summary card
- Run History timeline (table)

**Current Status Card:**
- Run ID, phase, status (running/completed/failed), started_at
- Phase progress indicator

**Latest Run Card:**
- Run ID, date, duration
- Each phase with status (completed/running/failed)
- Link to report HTML

**History Table:**
- Columns: Run ID, Date, Phases Summary, Status, Report Link
- Sort by date descending
- Pagination if needed

## Data Model

```typescript
interface Phase {
  phase: string
  status: "pending" | "running" | "completed" | "failed"
  timestamp: string
  details?: Record<string, unknown>
}

interface PipelineRun {
  run_id: string
  date: string
  started_at: string
  completed_at?: string
  phases: Phase[]
}

interface CurrentPipeline {
  run_id: string
  phase: string
  status: "running" | "paused"
  started_at: string
}
```

## API Endpoints (Server Actions)

- `getPipelineHistory()` — returns all historical runs
- `getCurrentPipeline()` — returns active run if any
- `getLatestRun()` — returns most recent completed run

## Technical Approach

- Feature-based: `src/features/pipeline/`
- DAL reads JSON files from `~/.openclaw/shared-data/`
- Server Component fetches via DAL → HydrationBoundary pattern
- Dark theme matches existing template

## Out of Scope (Phase 2+)
- Triggering manual runs
- Live WebSocket updates
- Detailed phase logs viewer
- Report preview embedded in page
