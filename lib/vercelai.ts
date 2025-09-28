export async function generateAIReply(input: string) {
  const res = await fetch("https://api.vercel.ai/v1/generate", {
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI Gateway returned ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.output_text ?? "No response from model";
}
