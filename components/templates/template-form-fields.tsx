import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Template } from "@/lib/types/template";

export function TemplateFormFields({
  template,
  idPrefix = "",
}: {
  template?: Template;
  idPrefix?: string;
}) {
  const id = (field: string) => (idPrefix ? `${idPrefix}-${field}` : field);

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor={id("name")}>Name</Label>
        <Input
          id={id("name")}
          name="name"
          defaultValue={template?.name ?? ""}
          placeholder="Welcome email"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={id("subject")}>Subject</Label>
        <Input
          id={id("subject")}
          name="subject"
          defaultValue={template?.subject ?? ""}
          placeholder="Welcome to {{company}}"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={id("body")}>Body</Label>
        <Textarea
          id={id("body")}
          name="body"
          defaultValue={template?.body ?? ""}
          placeholder="Hi {{name}}, ..."
          rows={8}
          required
        />
      </div>
    </div>
  );
}
