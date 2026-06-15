import { NextRequest } from "next/server";
import { runResearch } from "@/lib/agents/runner";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { query, apiKey: clientApiKey } = await req.json();
    if (!query || query.trim() === "") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = clientApiKey || process.env.CONTEXT_API_KEY || "";
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendUpdate = (state: any) => {
          controller.enqueue(encoder.encode(JSON.stringify(state) + "\n"));
        };

        try {
          await runResearch(query, apiKey, sendUpdate);
          controller.close();
        } catch (error: any) {
          console.error("Error in streaming research run:", error);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                error: error.message || "An error occurred during research execution",
              }) + "\n"
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("API route exception:", err);
    return new Response(JSON.stringify({ error: err.message || "Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
