"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import {
  updateTrigger,
  type TriggerActionState,
} from "@/app/(dashboard)/triggers/actions";
import { TriggerFormFields } from "@/components/triggers/trigger-form-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TemplateOption, Trigger } from "@/lib/types/trigger";

const initialState: TriggerActionState | null = null;

export function EditTriggerDialog({
  trigger,
  templates,
}: {
  trigger: Trigger;
  templates: TemplateOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateTrigger,
    initialState
  );

  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Edit trigger">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit trigger</DialogTitle>
          <DialogDescription>
            Update event mapping, conditions, or template.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} key={trigger.id}>
          <input type="hidden" name="id" value={trigger.id} />
          <TriggerFormFields
            trigger={trigger}
            templates={templates}
            idPrefix="edit"
          />
          {state?.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
