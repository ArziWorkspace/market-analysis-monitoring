import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import path from "path"

const SHARED_DATA_PATH = "/root/.openclaw/shared-data"

const PHASE_MAP: Record<string, string> = {
  phase_1: "data_gathering",
  phase_2: "macro_analysis",
  phase_3: "ihsg_analysis",
  phase_4: "sector_analysis",
  phase_5: "stock_screener",
  phase_6: "stock_analyst",
  phase_7: "fundamental_analyst",
  phase_8: "report_generation",
}

async function migrateFromJson() {
  console.log("Starting migration from JSON to database...")

  try {
    // Read current pipeline_tracking.json
    const trackingPath = path.join(SHARED_DATA_PATH, "pipeline_tracking.json")
    const trackingContent = await readFile(trackingPath, "utf-8")
    const tracking = JSON.parse(trackingContent)

    // Check if pipeline already exists
    const existing = await prisma.pipelineRun.findUnique({
      where: { runId: tracking.run_id },
    })

    if (existing) {
      console.log(`Pipeline ${tracking.run_id} already exists, skipping...`)
      return
    }

    // Create pipeline run
    const pipelineRun = await prisma.pipelineRun.create({
      data: {
        runId: tracking.run_id,
        date: tracking.run_id.replace(/(\d{4})(\d{2})(\d{2})(.+)/, "$1-$2-$3"),
        status: tracking.status === "in_progress" ? "RUNNING" : "COMPLETED",
        startedAt: new Date(tracking.created_at),
      },
    })

    console.log(`Created pipeline run: ${pipelineRun.runId}`)

    // Create phases
    const phaseOrder = ["phase_1", "phase_2", "phase_3", "phase_4", "phase_5", "phase_6", "phase_7", "phase_8"]

    for (const phaseKey of phaseOrder) {
      const phaseData = tracking.phases?.[phaseKey]
      const phaseName = PHASE_MAP[phaseKey]

      if (phaseData) {
        await prisma.phase.create({
          data: {
            pipelineId: pipelineRun.id,
            phase: phaseName,
            status: phaseData.status === "complete"
              ? "COMPLETED"
              : phaseData.status === "running"
              ? "RUNNING"
              : phaseData.status === "failed"
              ? "FAILED"
              : "PENDING",
            timestamp: new Date(phaseData.completed_at || phaseData.started_at || tracking.created_at),
            details: {
              output: phaseData.output,
              theme: phaseData.theme,
              stocks: phaseData.stocks,
            },
          },
        })
        console.log(`Created phase: ${phaseName}`)
      }
    }

    console.log("Migration completed successfully!")
  } catch (err) {
    console.error("Migration failed:", err)
    process.exit(1)
  }
}

migrateFromJson()
