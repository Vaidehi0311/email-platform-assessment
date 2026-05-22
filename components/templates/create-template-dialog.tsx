"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import {
  createTemplate,
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

const initialState: TemplateActionState | null = null;

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createTemplate,
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
          New template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create template</DialogTitle>
          <DialogDescription>
            Add a reusable email template with name, subject, and body.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <TemplateFormFields idPrefix="create" />
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
