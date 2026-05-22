"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import {
  updateTemplate,
  type TemplateActionState,
} from "@/app/(dashboard)/templates/actions";
import { TemplateFormFields } from "@/components/templates/template-form-fields";
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
import type { Template } from "@/lib/types/template";

const initialState: TemplateActionState | null = null;

export function EditTemplateDialog({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateTemplate,
    initialState
  );

  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Edit template">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit template</DialogTitle>
          <DialogDescription>Update name, subject, or body.</DialogDescription>
        </DialogHeader>
        <form action={formAction} key={template.id}>
          <input type="hidden" name="id" value={template.id} />
          <TemplateFormFields template={template} idPrefix="edit" />
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
