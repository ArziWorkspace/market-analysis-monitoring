"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Activity, FileText, Home, MessageSquare } from "lucide-react";

const NAV_ITEMS = [
  { title: "Home", icon: <Home className="size-5" />, href: "/" },
  {
    title: "Pipeline",
    icon: <Activity className="size-5" />,
    href: "/pipeline",
  },
  { title: "Reports", icon: <FileText className="size-5" />, href: "/reports" },
  {
    title: "Feedback",
    icon: <MessageSquare className="size-5" />,
    href: "/feedback",
  },
];

export function FloatingDockNav() {
  const pathname = usePathname();

  return (
    <FloatingDock
      items={NAV_ITEMS}
      desktopClassName="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      mobileClassName="fixed bottom-4 right-4 z-50"
    />
  );
}
