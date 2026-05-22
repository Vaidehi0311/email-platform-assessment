"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteTrigger } from "@/app/(dashboard)/triggers/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Trigger } from "@/lib/types/trigger";

export function DeleteTriggerDialog({ trigger }: { trigger: Trigger }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    const formData = new FormData();
    formData.set("id", trigger.id);

    startTransition(async () => {
      const result = await deleteTrigger(formData);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error ?? "Failed to delete trigger");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete trigger"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete trigger?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes <strong>{trigger.name}</strong>. Existing
            email logs are not deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={handleDelete}
          >
            {pending ? "Deleting…" : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
