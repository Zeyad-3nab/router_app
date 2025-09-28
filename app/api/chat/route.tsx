export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content || "";

  try {
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

    const text = await response.text(); // جرب نص الرسالة قبل تحويلها JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON from AI Gateway", raw: text }), { status: 500 });
    }

    const reply = data.output_text || "No response from model";

    return new Response(JSON.stringify({ reply: { content: reply } }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
