import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
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

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `You are a SaaS email copywriter. From the email body below, write exactly 5 short, compelling subject lines for a SaaS marketing email.

Return JSON only: {"subjects":["...","...","...","...","..."]}

Email body:
${body}`;

  try {
    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text()) as {
      subjects?: unknown;
    };

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
