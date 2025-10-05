import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { DASHBOARD_CHAT_PROMPT } from "./system-prompt";

export async function POST(request: Request) {
  console.log("🚀 Dashboard chat API called");
  
  try {
    console.log("📥 Parsing request body...");
    const body = await request.json();
    console.log("📦 Request body:", JSON.stringify(body, null, 2));
    
    const { messages, userData } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error("❌ Messages validation failed:", { messages, isArray: Array.isArray(messages) });
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400 }
      );
    }

    console.log("✅ Messages validated successfully, count:", messages.length);
    console.log("📊 User data provided:", !!userData);

    console.log("🔑 Checking OpenRouter API key...");
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("🔑 API key exists:", !!apiKey);
    console.log("🔑 API key length:", apiKey?.length || 0);

    const openrouter = createOpenRouter({
      apiKey: apiKey,
    });
    console.log("🔧 OpenRouter client created");

    console.log("🤖 Preparing to call streamText...");
    
    // If we have userData, modify the system prompt to include it
    let systemPrompt = DASHBOARD_CHAT_PROMPT;
    if (userData) {
      systemPrompt = `${DASHBOARD_CHAT_PROMPT}

## DANE UŻYTKOWNIKA
Oto aktualne dane emerytalne użytkownika, na które możesz się powoływać w odpowiedziach:

${JSON.stringify(userData, null, 2)}

Używaj tych danych do udzielania spersonalizowanych odpowiedzi o emeryturze użytkownika.`;
      console.log("📊 Added user data to system prompt");
    }
    
    const streamConfig = {
      model: openrouter("anthropic/claude-sonnet-4.5"),
      system: systemPrompt,
      messages,
    };
    console.log("⚙️ Stream config:", JSON.stringify({
      model: "anthropic/claude-sonnet-4.5",
      systemPromptLength: systemPrompt.length,
      messagesCount: messages.length,
      hasUserData: !!userData
    }, null, 2));

    const result = streamText(streamConfig);
    console.log("✅ streamText called successfully");

    const response = result.toTextStreamResponse();
    console.log("📤 Response prepared, sending...");
    
    return response;
  } catch (error) {
    console.error("💥 Error in dashboard chat API:");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      details: error?.message || "Unknown error"
    }), {
      status: 500,
    });
  }
}

export async function GET() {
  console.log("📡 Dashboard chat API GET endpoint called");
  console.log("🔑 API key check:", !!process.env.OPENROUTER_API_KEY);
  
  return new Response(
    JSON.stringify({
      message: "Dashboard Chat API is running. Use POST to send messages.",
      timestamp: new Date().toISOString(),
      apiKeyConfigured: !!process.env.OPENROUTER_API_KEY
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}