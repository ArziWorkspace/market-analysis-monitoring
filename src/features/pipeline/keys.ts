export const pipelineKeys = {
  all: ["pipeline"] as const,
  history: () => [...pipelineKeys.all, "history"] as const,
  current: () => [...pipelineKeys.all, "current"] as const,
  latest: () => [...pipelineKeys.all, "latest"] as const,
}
