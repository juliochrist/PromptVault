import { NextResponse } from "next/server";
import { openaiProvider } from "@/services/ai/openai";

const actions: Record<string, keyof typeof openaiProvider> = {
  summarise: "summarise",
  generateBetter: "generateBetter",
};

export async function POST(req: Request) {
  try {
    const { prompt, action, language } = await req.json();

    if (!prompt || !action) {
      return NextResponse.json(
        { error: "Prompt and action are required" },
        { status: 400 },
      );
    }

    if (!actions[action]) {
      return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 },
      );
    }

    let result: string;

    if (action === "translate") {
      result = await openaiProvider.translate(prompt, language ?? "English");
    } else {
      result = await (openaiProvider[actions[action]] as (p: string) => Promise<string>)(prompt);
    }

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI request failed" },
      { status: 500 },
    );
  }
}
