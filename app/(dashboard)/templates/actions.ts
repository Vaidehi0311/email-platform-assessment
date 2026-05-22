"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Template } from "@/lib/types/template";

const templateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  body: z.string().trim().min(1, "Body is required"),
});

export type TemplateActionState = {
  success: boolean;
  error?: string;
};

function parseTemplateForm(formData: FormData) {
  return templateSchema.safeParse({
    name: formData.get("name"),
    subject: formData.get("subject"),
    body: formData.get("body"),
  });
}

export async function listTemplates(): Promise<{
  data: Template[];
  error: string | null;
}> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("templates")
      .select("id, name, subject, body, created_at")
      .order("created_at", { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as Template[], error: null };
  } catch (e) {
    return {
      data: [],
      error: e instanceof Error ? e.message : "Failed to load templates",
    };
  }
}

export async function createTemplate(
  _prev: TemplateActionState | null,
  formData: FormData
): Promise<TemplateActionState> {
  const parsed = parseTemplateForm(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("templates").insert(parsed.data);

  if (error) return { success: false, error: error.message };

  revalidatePath("/templates");
  return { success: true };
}

export async function updateTemplate(
  _prev: TemplateActionState | null,
  formData: FormData
): Promise<TemplateActionState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { success: false, error: "Template id is required" };
  }

  const parsed = parseTemplateForm(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("templates")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/templates");
  return { success: true };
}

export async function deleteTemplate(
  formData: FormData
): Promise<TemplateActionState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { success: false, error: "Template id is required" };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("templates").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/templates");
  return { success: true };
}
