import {
  FileText,
  LayoutDashboard,
  Play,
  ScrollText,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const dashboardNav: DashboardNavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Templates", href: "/templates", icon: FileText },
  { title: "Triggers", href: "/triggers", icon: Zap },
  { title: "Logs", href: "/logs", icon: ScrollText },
  { title: "Event Simulator", href: "/event-simulator", icon: Play },
];

export const dashboardNavByHref = Object.fromEntries(
  dashboardNav.map((item) => [item.href, item])
) as Record<string, DashboardNavItem>;
