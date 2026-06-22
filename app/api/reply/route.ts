import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  const baseUrl = process.env.OPENROUTER_BASE_URL;

  if (!apiKey || !model || !baseUrl) {
    return NextResponse.json(
      { error: "Missing OpenRouter env configuration" },
      { status: 500 }
    );
  }

  const { message } = await req.json().catch(() => ({ message: "" }));

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://openrouter.ai",
      "X-Title": "Duolingo Video Call - Lily",
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "You are a friendly Spanish conversation tutor. Reply in short, encouraging sentences.",
        },
        { role: "user", content: message || "¡Hola! ¿Cómo estás?" },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `OpenRouter responded ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content ?? "";

  return NextResponse.json({ reply });
}
