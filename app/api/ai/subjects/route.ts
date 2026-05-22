import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const body =
    typeof payload === "object" &&
    payload !== null &&
    "body" in payload &&
    typeof (payload as { body: unknown }).body === "string"
      ? (payload as { body: string }).body.trim()
      : "";

  if (!body) {
    return NextResponse.json(
      { error: "body is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You are a SaaS email copywriter. Return JSON only: {"subjects":["...","...","...","...","..."]} with exactly 5 short, compelling subject lines.',
        },
        {
          role: "user",
          content: `Write 5 SaaS-style email subject lines for this body:\n\n${body}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: "Empty response from OpenAI" },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(text) as { subjects?: unknown };
    const subjects = parsed.subjects;

    if (
      !Array.isArray(subjects) ||
      subjects.length !== 5 ||
      !subjects.every((s) => typeof s === "string" && s.length > 0)
    ) {
      return NextResponse.json(
        { error: "Invalid response from AI" },
        { status: 502 }
      );
    }

    return NextResponse.json({ subjects });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate subject lines" },
      { status: 500 }
    );
  }
}
