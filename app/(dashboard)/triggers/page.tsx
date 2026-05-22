import { PageHeader } from "@/components/dashboard/page-header";

export default function TriggersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Triggers"
        description="Define when and how emails are sent based on events."
      />
      <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
        <p className="text-sm font-medium">No triggers configured</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect events to templates to automate outbound email.
        </p>
      </div>
    </div>
  );
}
