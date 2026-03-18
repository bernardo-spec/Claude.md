"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Table,
} from "lucide-react";

const navItems = [
  { href: "/pipeline", label: "Pipeline", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Table },
];

const adminItems = [
  { href: "/settings/users", label: "Configurações", icon: Settings },
];

export function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/pipeline" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">Coders</span>
          <span className="text-muted-foreground text-sm font-normal">CRM</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <p className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {userRole === "admin" && (
          <>
            <p className="mb-2 mt-6 px-2 text-xs font-semibold uppercase text-muted-foreground">
              Admin
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center gap-2 rounded-md px-3 py-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
        </div>
      </div>
    </aside>
  );
}
