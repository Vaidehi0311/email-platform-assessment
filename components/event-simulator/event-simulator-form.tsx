"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EventSimulatorForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const event_name = String(formData.get("event_name") ?? "").trim();
    const user_id = String(formData.get("user_id") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const payloadRaw = String(formData.get("payload") ?? "").trim();

    let payload: Record<string, unknown> = {};
    if (payloadRaw) {
      try {
        const parsed: unknown = JSON.parse(payloadRaw);
        if (
          typeof parsed !== "object" ||
          parsed === null ||
          Array.isArray(parsed)
        ) {
          toast.error("Payload must be a JSON object");
          return;
        }
        payload = parsed as Record<string, unknown>;
      } catch {
        toast.error("Payload must be valid JSON");
        return;
      }
    }

    setPending(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_name, user_id, email, payload }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        toast.error(data.error ?? "Failed to send event");
        return;
      }

      toast.success(data.message ?? "Event processed successfully");
      form.reset();
    } catch {
      toast.error("Network error — could not reach /api/events");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="event_name">Event name</Label>
          <Input
            id="event_name"
            name="event_name"
            placeholder="user.signup"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="user_id">User ID</Label>
          <Input
            id="user_id"
            name="user_id"
            placeholder="user_123"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            required
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="payload">Payload (JSON)</Label>
          <Textarea
            id="payload"
            name="payload"
            rows={8}
            className="font-mono text-sm"
            placeholder='{"plan": "pro", "name": "Alex"}'
          />
          <p className="text-xs text-muted-foreground">
            Optional. Used to match trigger conditions and template variables.
          </p>
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send event"}
      </Button>
    </form>
  );
}
