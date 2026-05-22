import { PageHeader } from "@/components/dashboard/page-header";

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Templates"
        description="Manage reusable email templates for your automations."
      />
      <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
        <p className="text-sm font-medium">No templates yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first template to use in triggers and campaigns.
        </p>
      </div>
    </div>
  );
}
