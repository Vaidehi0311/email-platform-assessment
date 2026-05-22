import {
  listTemplateOptions,
  listTriggers,
} from "@/app/(dashboard)/triggers/actions";
import { PageHeader } from "@/components/dashboard/page-header";
import { TriggersTable } from "@/components/triggers/triggers-table";

export default async function TriggersPage() {
  const [triggersResult, templatesResult] = await Promise.all([
    listTriggers(),
    listTemplateOptions(),
  ]);

  const errors = [triggersResult.error, templatesResult.error].filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Triggers"
        description="Define when and how emails are sent based on events."
      />
      {errors.length > 0 ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.join(" ")}. Check Supabase env vars in{" "}
          <code className="text-xs">.env.local</code>.
        </p>
      ) : null}
      <TriggersTable
        triggers={triggersResult.data}
        templates={templatesResult.data}
      />
    </div>
  );
}
