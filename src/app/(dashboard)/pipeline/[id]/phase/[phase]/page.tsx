import PhaseDetailClient from "./phase-detail-client";

export default async function PhaseDetailPage({
  params,
}: {
  params: Promise<{ id: string; phase: string }>;
}) {
  const { id, phase } = await params;
  return <PhaseDetailClient runId={id} phase={phase} />;
}
