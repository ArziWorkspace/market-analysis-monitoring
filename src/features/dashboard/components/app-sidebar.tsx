"use client";

import { ChevronDown, ChevronRight, Terminal, Activity } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "../hooks/use-sidebar";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: MenuItem[];
}

const PIPELINE_MENU: MenuItem[] = [
  {
    label: "Pipeline",
    href: "/pipeline",
    icon: Activity,
  },
];

function MenuItem({ item, isCollapsed, depth = 0 }: { item: MenuItem; isCollapsed: boolean; depth?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href;
  const Icon = item.icon;

  if (hasChildren && !isCollapsed) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children!.map((child) => (
              <MenuItem key={child.href} item={child} isCollapsed={isCollapsed} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
        isActive ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90" : "hover:bg-accent"
      }`}
      title={isCollapsed ? item.label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function AppSidebarClient() {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={`hidden md:flex flex-col border-r bg-background transition-all duration-300 h-screen relative ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!isCollapsed && (
          <Link href="/pipeline" className="flex items-center gap-2 flex-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Terminal className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Market Analyzer</span>
              <span className="truncate text-xs">Pipeline Monitor</span>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/pipeline" className="flex items-center justify-center w-full">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Terminal className="size-4" />
            </div>
          </Link>
        )}
      </div>

      <div className="flex-1 px-2 py-4 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-1">
          {PIPELINE_MENU.map((item) => (
            <MenuItem key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

export function AppSidebar() {
  return <AppSidebarClient />;
}
