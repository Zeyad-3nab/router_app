export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilgpt2", // نموذج مضمون
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: lastUserMessage,
          parameters: { max_new_tokens: 100 },
        }),
      }
    );

    const text = await response.text();

    // تحقق من النص قبل تحويله لـ JSON
    if (!text.startsWith("{") && !text.startsWith("[")) {
      return new Response(
        JSON.stringify({ error: `API did not return JSON: ${text}` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = JSON.parse(text);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error || "Unknown error from HF API" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const generatedText = data?.[0]?.generated_text || "No response from model";

    return new Response(
      JSON.stringify({ reply: { content: generatedText } }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
