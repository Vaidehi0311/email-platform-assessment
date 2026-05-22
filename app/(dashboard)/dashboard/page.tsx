import { PageHeader } from "@/components/dashboard/page-header";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of sends, triggers, and recent activity."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Emails sent (24h)", value: "—" },
          { label: "Active triggers", value: "—" },
          { label: "Delivery rate", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-medium">Recent activity</h3>
        <p className="mt-4 text-sm text-muted-foreground">
          No events yet. Use the Event Simulator or configure triggers to get
          started.
        </p>
      </section>
    </div>
  );
}
