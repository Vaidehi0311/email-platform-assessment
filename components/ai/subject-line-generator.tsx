"use client";

import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SubjectLineGenerator({
  onSelect,
}: {
  onSelect?: (subject: string) => void;
}) {
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);

  async function handleGenerate() {
    const trimmed = body.trim();
    if (!trimmed) {
      toast.error("Enter an email body first");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/ai/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
      });

      const data = (await res.json()) as {
        subjects?: string[];
        error?: string;
      };

      if (!res.ok) {
        toast.error(data.error ?? "Failed to generate subject lines");
        return;
      }

      if (!data.subjects?.length) {
        toast.error("No subject lines returned");
        return;
      }

      setSubjects(data.subjects);
      setResultsOpen(true);
    } catch {
      toast.error("Network error — could not reach /api/ai/subjects");
    } finally {
      setPending(false);
    }
  }

  function copySubject(subject: string) {
    navigator.clipboard.writeText(subject);
    toast.success("Copied to clipboard");
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="ai-email-body">Email body</Label>
          <Textarea
            id="ai-email-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Paste your email body here…"
            className="font-mono text-sm"
          />
        </div>
        <Button onClick={handleGenerate} disabled={pending}>
          <Sparkles className="size-4" />
          {pending ? "Generating…" : "Generate subject lines"}
        </Button>
      </div>

      <Dialog open={resultsOpen} onOpenChange={setResultsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suggested subject lines</DialogTitle>
            <DialogDescription>
              Five SaaS-style options generated with OpenAI. Copy or apply one.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2">
            {subjects.map((subject, index) => (
              <li
                key={index}
                className="flex items-start gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
              >
                <span className="flex-1 leading-snug">{subject}</span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Copy subject line"
                    onClick={() => copySubject(subject)}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                  {onSelect ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        onSelect(subject);
                        setResultsOpen(false);
                        toast.success("Subject applied");
                      }}
                    >
                      Use
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
