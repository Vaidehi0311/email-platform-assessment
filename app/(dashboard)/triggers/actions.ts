"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TemplateOption } from "@/lib/types/trigger";
import type { Trigger } from "@/lib/types/trigger";

const triggerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  event_name: z.string().trim().min(1, "Event name is required"),
  conditions: z.record(z.string(), z.unknown()),
  template_id: z.string().uuid().nullable(),
  send_once: z.boolean(),
  active: z.boolean(),
});

export type TriggerActionState = {
  success: boolean;
  error?: string;
};

function parseConditions(raw: FormDataEntryValue | null): {
  ok: true;
  value: Record<string, unknown>;
} | { ok: false; error: string } {
  const text = typeof raw === "string" ? raw.trim() : "";
  if (!text) return { ok: true, value: {} };

  try {
    const parsed: unknown = JSON.parse(text);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return { ok: false, error: "Conditions must be a JSON object" };
    }
    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, error: "Conditions must be valid JSON" };
  }
}

function parseBool(value: FormDataEntryValue | null, fallback: boolean) {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function parseTriggerForm(
  formData: FormData
): { ok: true; data: z.infer<typeof triggerSchema> } | { ok: false; error: string } {
  const conditionsResult = parseConditions(formData.get("conditions"));
  if (!conditionsResult.ok) {
    return { ok: false, error: conditionsResult.error };
  }

  const templateRaw = formData.get("template_id");
  const template_id =
    typeof templateRaw === "string" && templateRaw.length > 0
      ? templateRaw
      : null;

  const parsed = triggerSchema.safeParse({
    name: formData.get("name"),
    event_name: formData.get("event_name"),
    conditions: conditionsResult.value,
    template_id,
    send_once: parseBool(formData.get("send_once"), true),
    active: parseBool(formData.get("active"), true),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  return { ok: true, data: parsed.data };
}

export async function listTriggers(): Promise<{
  data: Trigger[];
  error: string | null;
}> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("triggers")
      .select(
        "id, name, event_name, conditions, template_id, send_once, active, created_at, templates(name)"
      )
      .order("created_at", { ascending: false });

    if (error) return { data: [], error: error.message };

    const triggers = (data ?? []).map((row) => {
      const template = Array.isArray(row.templates)
        ? (row.templates[0] ?? null)
        : row.templates;
      return { ...row, templates: template } as Trigger;
    });

    return { data: triggers, error: null };
  } catch (e) {
    return {
      data: [],
      error: e instanceof Error ? e.message : "Failed to load triggers",
    };
  }
}

export async function listTemplateOptions(): Promise<{
  data: TemplateOption[];
  error: string | null;
}> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("templates")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as TemplateOption[], error: null };
  } catch (e) {
    return {
      data: [],
      error: e instanceof Error ? e.message : "Failed to load templates",
    };
  }
}

export async function createTrigger(
  _prev: TriggerActionState | null,
  formData: FormData
): Promise<TriggerActionState> {
  const parsed = parseTriggerForm(formData);
  if (!parsed.ok) return { success: false, error: parsed.error };

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("triggers").insert(parsed.data);

  if (error) return { success: false, error: error.message };

  revalidatePath("/triggers");
  return { success: true };
}

export async function updateTrigger(
  _prev: TriggerActionState | null,
  formData: FormData
): Promise<TriggerActionState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { success: false, error: "Trigger id is required" };
  }

  const parsed = parseTriggerForm(formData);
  if (!parsed.ok) return { success: false, error: parsed.error };

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("triggers")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/triggers");
  return { success: true };
}

export async function deleteTrigger(
  formData: FormData
): Promise<TriggerActionState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { success: false, error: "Trigger id is required" };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("triggers").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/triggers");
  return { success: true };
}
