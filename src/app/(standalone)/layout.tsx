import { FloatingDockNav } from "@/components/floating-dock-nav";

export default async function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative pt-8">
      {children}
      <FloatingDockNav />
    </div>
  );
}
