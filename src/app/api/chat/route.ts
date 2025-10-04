import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { PENSION_CALCULATOR_PROMPT } from "./system-prompt";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400 }
      );
    }

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const result = streamText({
      model: openrouter("anthropic/claude-sonnet-4.5"),
      system: PENSION_CALCULATOR_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Chat API is running. Use POST to send messages.",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
