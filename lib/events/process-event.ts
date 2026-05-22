import { Resend } from "resend";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type IncomingEvent = {
  event_name: string;
  user_id: string;
  email: string;
  payload: Record<string, unknown>;
};

type TriggerRow = {
  id: string;
  name: string;
  event_name: string;
  conditions: Record<string, unknown>;
  template_id: string | null;
  send_once: boolean;
  active: boolean;
  templates:
    | { id: string; name: string; subject: string; body: string }
    | { id: string; name: string; subject: string; body: string }[]
    | null;
};

function normalizeTemplate(
  templates: TriggerRow["templates"]
): { id: string; name: string; subject: string; body: string } | null {
  if (!templates) return null;
  return Array.isArray(templates) ? (templates[0] ?? null) : templates;
}

function matchesConditions(
  conditions: Record<string, unknown>,
  payload: Record<string, unknown>
) {
  return Object.entries(conditions).every(([key, expected]) => {
    if (!(key in payload)) return false;
    const actual = payload[key];
    return (
      actual === expected ||
      JSON.stringify(actual) === JSON.stringify(expected)
    );
  });
}

function renderText(
  text: string,
  vars: Record<string, string>
) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

export async function processEvent(event: IncomingEvent) {
  const supabase = createSupabaseServerClient();

  const { data: triggers, error: triggersError } = await supabase
    .from("triggers")
    .select(
      "id, name, event_name, conditions, template_id, send_once, active, templates(id, name, subject, body)"
    )
    .eq("event_name", event.event_name)
    .eq("active", true);

  if (triggersError) {
    throw new Error(triggersError.message);
  }

  const rows = (triggers ?? []) as TriggerRow[];
  const vars: Record<string, string> = {
    user_id: event.user_id,
    email: event.email,
    ...Object.fromEntries(
      Object.entries(event.payload).map(([k, v]) => [k, String(v)])
    ),
  };

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const resend = resendKey ? new Resend(resendKey) : null;

  let matched = 0;
  let sent = 0;
  const results: { trigger: string; status: string; detail?: string }[] = [];

  for (const trigger of rows) {
    if (!matchesConditions(trigger.conditions ?? {}, event.payload)) {
      results.push({ trigger: trigger.name, status: "skipped", detail: "conditions" });
      continue;
    }

    matched++;

    if (trigger.send_once) {
      const { count } = await supabase
        .from("email_logs")
        .select("id", { count: "exact", head: true })
        .eq("trigger_id", trigger.id)
        .eq("user_id", event.user_id)
        .eq("status", "sent");

      if (count && count > 0) {
        await supabase.from("email_logs").insert({
          trigger_id: trigger.id,
          template_id: trigger.template_id,
          user_id: event.user_id,
          email: event.email,
          event_name: event.event_name,
          status: "skipped",
        });
        results.push({ trigger: trigger.name, status: "skipped", detail: "send_once" });
        continue;
      }
    }

    const template = normalizeTemplate(trigger.templates);
    if (!template) {
      await supabase.from("email_logs").insert({
        trigger_id: trigger.id,
        template_id: trigger.template_id,
        user_id: event.user_id,
        email: event.email,
        event_name: event.event_name,
        status: "skipped",
      });
      results.push({ trigger: trigger.name, status: "skipped", detail: "no_template" });
      continue;
    }

    if (!resend) {
      await supabase.from("email_logs").insert({
        trigger_id: trigger.id,
        template_id: template.id,
        user_id: event.user_id,
        email: event.email,
        event_name: event.event_name,
        status: "failed",
      });
      results.push({
        trigger: trigger.name,
        status: "failed",
        detail: "RESEND_API_KEY not configured",
      });
      continue;
    }

    const subject = renderText(template.subject, vars);
    const body = renderText(template.body, vars);

    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: event.email,
      subject,
      html: body.replace(/\n/g, "<br>"),
    });

    if (sendError) {
      await supabase.from("email_logs").insert({
        trigger_id: trigger.id,
        template_id: template.id,
        user_id: event.user_id,
        email: event.email,
        event_name: event.event_name,
        status: "failed",
      });
      results.push({
        trigger: trigger.name,
        status: "failed",
        detail: sendError.message,
      });
      continue;
    }

    await supabase.from("email_logs").insert({
      trigger_id: trigger.id,
      template_id: template.id,
      user_id: event.user_id,
      email: event.email,
      event_name: event.event_name,
      status: "sent",
    });

    sent++;
    results.push({ trigger: trigger.name, status: "sent" });
  }

  return { matched, sent, results };
}
