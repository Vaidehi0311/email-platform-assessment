import { PageHeader } from "@/components/dashboard/page-header";

export default function EventSimulatorPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Event Simulator"
        description="Send test events to validate triggers without production traffic."
      />
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <label className="text-sm font-medium" htmlFor="event-payload">
          Event payload (JSON)
        </label>
        <textarea
          id="event-payload"
          rows={8}
          readOnly
          placeholder='{"type": "user.signup", "userId": "..."}'
          className="mt-2 w-full resize-y rounded-lg border bg-muted/30 px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Simulator controls will connect to your trigger pipeline here.
        </p>
      </div>
    </div>
  );
}
