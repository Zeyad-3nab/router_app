export async function generateAIReply(input: string) {
  const response = await fetch("https://api.vercel.ai/v1/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_AI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      provider: "openai",
      input,
    }),
  });

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data.output_text || "No response from model";
  } catch {
    throw new Error(`Invalid JSON from AI Gateway: ${text}`);
  }
}
