import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar, SiteHeader } from "@/features/dashboard";
import { PermissionProvider } from "@/providers/permission-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="[--header-height:calc(--spacing(14))] h-screen overflow-hidden">
      <TooltipProvider>
        <PermissionProvider>
          <SidebarProvider className="flex flex-col h-full overflow-hidden">
            <SiteHeader />
            <div className="flex flex-1 overflow-hidden">
              <AppSidebar />
              <SidebarInset className="flex h-full pt-4 flex-col relative overflow-auto">
                {children}
              </SidebarInset>
            </div>
          </SidebarProvider>
        </PermissionProvider>
      </TooltipProvider>
    </div>
  );
}
