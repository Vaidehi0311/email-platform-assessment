"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TemplateOption } from "@/lib/types/trigger";
import type { Trigger } from "@/lib/types/trigger";

const NONE = "__none__";

export function TriggerFormFields({
  trigger,
  templates,
  idPrefix = "",
}: {
  trigger?: Trigger;
  templates: TemplateOption[];
  idPrefix?: string;
}) {
  const id = (field: string) => (idPrefix ? `${idPrefix}-${field}` : field);

  const [templateId, setTemplateId] = useState(trigger?.template_id ?? "");
  const [sendOnce, setSendOnce] = useState(trigger?.send_once ?? true);
  const [active, setActive] = useState(trigger?.active ?? true);

  const conditionsDefault = JSON.stringify(
    trigger?.conditions ?? {},
    null,
    2
  );

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor={id("name")}>Name</Label>
        <Input
          id={id("name")}
          name="name"
          defaultValue={trigger?.name ?? ""}
          placeholder="Signup welcome"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={id("event_name")}>Event name</Label>
        <Input
          id={id("event_name")}
          name="event_name"
          defaultValue={trigger?.event_name ?? ""}
          placeholder="user.signup"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={id("conditions")}>Conditions (JSON)</Label>
        <Textarea
          id={id("conditions")}
          name="conditions"
          defaultValue={conditionsDefault}
          placeholder='{"plan": "pro"}'
          rows={5}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Optional object. All keys must match event payload fields.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor={id("template")}>Template</Label>
        <input type="hidden" name="template_id" value={templateId} />
        <Select
          value={templateId || NONE}
          onValueChange={(value) =>
            setTemplateId(value === NONE ? "" : value)
          }
        >
          <SelectTrigger id={id("template")} className="w-full">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>No template</SelectItem>
            {templates.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
        <div className="space-y-0.5">
          <Label htmlFor={id("send_once")}>Send once</Label>
          <p className="text-xs text-muted-foreground">
            Only send the first time this trigger matches a user.
          </p>
        </div>
        <input type="hidden" name="send_once" value={sendOnce ? "true" : "false"} />
        <Switch
          id={id("send_once")}
          checked={sendOnce}
          onCheckedChange={setSendOnce}
        />
      </div>
      <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
        <div className="space-y-0.5">
          <Label htmlFor={id("active")}>Active</Label>
          <p className="text-xs text-muted-foreground">
            Inactive triggers will not send emails.
          </p>
        </div>
        <input type="hidden" name="active" value={active ? "true" : "false"} />
        <Switch id={id("active")} checked={active} onCheckedChange={setActive} />
      </div>
    </div>
  );
}
