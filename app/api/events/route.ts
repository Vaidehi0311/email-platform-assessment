import { NextResponse } from "next/server";
import { z } from "zod";

import { processEvent } from "@/lib/events/process-event";

const eventSchema = z.object({
  event_name: z.string().trim().min(1, "event_name is required"),
  user_id: z.string().trim().min(1, "user_id is required"),
  email: z.string().trim().email("email must be valid"),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  try {
    const result = await processEvent(parsed.data);
    return NextResponse.json({
      message: `Matched ${result.matched} trigger(s), sent ${result.sent} email(s)`,
      ...result,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to process event",
      },
      { status: 500 }
    );
  }
}
