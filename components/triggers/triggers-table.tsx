import { CreateTriggerDialog } from "@/components/triggers/create-trigger-dialog";
import { DeleteTriggerDialog } from "@/components/triggers/delete-trigger-dialog";
import { EditTriggerDialog } from "@/components/triggers/edit-trigger-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TemplateOption, Trigger } from "@/lib/types/trigger";
import { cn } from "@/lib/utils";

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        active
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function TriggersTable({
  triggers,
  templates,
}: {
  triggers: Trigger[];
  templates: TemplateOption[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateTriggerDialog templates={templates} />
      </div>

      {triggers.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
          <p className="text-sm font-medium">No triggers configured</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect events to templates to automate outbound email.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Event</TableHead>
                <TableHead className="hidden lg:table-cell">Template</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {triggers.map((trigger) => (
                <TableRow key={trigger.id}>
                  <TableCell>
                    <div className="font-medium">{trigger.name}</div>
                    {trigger.send_once ? (
                      <p className="text-xs text-muted-foreground">Send once</p>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                    {trigger.event_name}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {trigger.templates?.name ?? "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <StatusBadge active={trigger.active} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <EditTriggerDialog
                        trigger={trigger}
                        templates={templates}
                      />
                      <DeleteTriggerDialog trigger={trigger} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
