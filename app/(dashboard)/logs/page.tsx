import { PageHeader } from "@/components/dashboard/page-header";

export default function LogsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Logs"
        description="Delivery history, errors, and webhook responses."
      />
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Event</span>
          <span className="hidden sm:block">Status</span>
          <span className="hidden md:block">Time</span>
        </div>
        <div className="px-4 py-12 text-center text-sm text-muted-foreground">
          No log entries to display.
        </div>
      </div>
    </div>
  );
}
