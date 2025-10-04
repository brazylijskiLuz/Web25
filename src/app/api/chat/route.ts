import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { PENSION_CALCULATOR_PROMPT } from "./system-prompt";

/**
 * Extracts and parses JSON from AI response that might be wrapped in markdown code blocks
 * Handles formats like: ```json\n{...}\n``` or just {...}
 */
function parseAIResponse(text: string): any {
  try {
    // Remove markdown code blocks if present
    let cleanedText = text.trim();

    // Check for ```json ... ``` pattern
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = cleanedText.match(jsonBlockRegex);

    if (match) {
      cleanedText = match[1].trim();
    } else {
      // Check for generic ``` ... ``` pattern
      const genericBlockRegex = /```\s*([\s\S]*?)\s*```/;
      const genericMatch = cleanedText.match(genericBlockRegex);
      if (genericMatch) {
        cleanedText = genericMatch[1].trim();
      }
    }

    // Parse the JSON
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Invalid JSON in AI response");
  }
}

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

    const result = await streamText({
      model: openrouter("anthropic/claude-sonnet-4.5"),
      system: PENSION_CALCULATOR_PROMPT,
      messages,
    });

    // Collect the full text from the stream
    const fullText = await result.text;

    // Parse the JSON from the AI response
    const parsedData = parseAIResponse(fullText);

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
