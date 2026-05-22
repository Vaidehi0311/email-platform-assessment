import Link from "next/link";
import { Mail } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { NavLinks } from "@/components/dashboard/nav-links";

export function AppSidebar() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold tracking-tight text-sidebar-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Mail className="size-4" />
          </span>
          <span className="text-sm">Email Platform</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <p className="mb-2 px-6 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
          Admin
        </p>
        <NavLinks />
      </div>
      <Separator className="bg-sidebar-border" />
      <div className="p-4">
        <p className="text-xs text-sidebar-foreground/60">Automation workspace</p>
      </div>
    </div>
  );
}
