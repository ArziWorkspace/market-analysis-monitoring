import { WithAuth } from "@/components/global/authorization/withPermissions";
import { PipelineDashboard } from "@/features/pipeline/components/pipeline-dashboard";

export default WithAuth(function PipelinePage() {
  return <PipelineDashboard />;
}, { permission: "dashboard.view" });
