export async function POST(req: Request) {
  try {
    const body = await req.json() as { messages: { role: string; content: string }[] };
    const lastMessage = body.messages[body.messages.length - 1]?.content || "";

    const response = await fetch("https://api.vercel.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_AI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", 
        provider: "openai",
        input: lastMessage,
      }),
    });

    const text = await response.text();
    console.log("Raw AI Gateway response:", text);

    type AIResponse = { output_text?: string; [key: string]: unknown };
    let data: AIResponse;

    try {
      data = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON from AI Gateway", raw: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const reply = data.output_text ?? "No response from model";

    return new Response(
      JSON.stringify({ reply: { content: reply } }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
