import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { PENSION_CALCULATOR_PROMPT } from "./system-prompt";

export async function POST(request: Request) {
  try {
    const { messages, beforeInput, afterInput, beforeOutput } =
      await request.json();

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const result = streamText({
      model: openrouter("anthropic/claude-sonnet-4.5"),
      messages: [
        {
          role: "user",
          content: PENSION_CALCULATOR_PROMPT(
            beforeInput,
            afterInput,
            beforeOutput
          ),
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in regenerate API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Regenerate API is running. Use POST to send messages.",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
