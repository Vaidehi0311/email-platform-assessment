"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import {
  createTrigger,
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
import type { TemplateOption } from "@/lib/types/trigger";

const initialState: TriggerActionState | null = null;

export function CreateTriggerDialog({
  templates,
}: {
  templates: TemplateOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createTrigger,
    initialState
  );

  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          New trigger
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create trigger</DialogTitle>
          <DialogDescription>
            Map an event to a template with optional JSON conditions.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <TriggerFormFields templates={templates} idPrefix="create" />
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
              {pending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
