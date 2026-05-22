"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Mail } from "lucide-react";

import { dashboardNavByHref } from "@/lib/dashboard-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";

function getPageTitle(pathname: string) {
  const item = dashboardNavByHref[pathname];
  if (item) return item.title;
  if (pathname.startsWith("/event-simulator")) return "Event Simulator";
  return "Admin";
}

export function DashboardHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 lg:px-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <AppSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Mail className="size-3.5" />
          </span>
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <h1 className="truncate text-sm font-semibold">{title}</h1>
      </div>

      <div className="hidden lg:block">
        <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Admin
        </span>
        <div
          className="size-8 rounded-full border bg-muted"
          aria-hidden
          title="Account"
        />
      </div>
    </header>
  );
}
