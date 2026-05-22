import { CreateTemplateDialog } from "@/components/templates/create-template-dialog";
import { DeleteTemplateDialog } from "@/components/templates/delete-template-dialog";
import { EditTemplateDialog } from "@/components/templates/edit-template-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Template } from "@/lib/types/template";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TemplatesTable({ templates }: { templates: Template[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateTemplateDialog />
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
          <p className="text-sm font-medium">No templates yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first template to use in triggers and campaigns.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Subject</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell className="hidden max-w-xs truncate text-muted-foreground md:table-cell">
                    {template.subject}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {formatDate(template.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <EditTemplateDialog template={template} />
                      <DeleteTemplateDialog template={template} />
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
