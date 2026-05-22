import { listTemplates } from "@/app/(dashboard)/templates/actions";
import { PageHeader } from "@/components/dashboard/page-header";
import { TemplatesTable } from "@/components/templates/templates-table";

export default async function TemplatesPage() {
  const { data: templates, error } = await listTemplates();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Templates"
        description="Manage reusable email templates for your automations."
      />
      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}. Check that{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set
          in <code className="text-xs">.env.local</code>.
        </p>
      ) : null}
      <TemplatesTable templates={templates} />
    </div>
  );
}
