import { PageHeader } from "@/components/dashboard/page-header";
import { EventSimulatorForm } from "@/components/event-simulator/event-simulator-form";

export default function EventSimulatorPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Event Simulator"
        description="Send test events to validate triggers without production traffic."
      />
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <EventSimulatorForm />
      </div>
    </div>
  );
}
