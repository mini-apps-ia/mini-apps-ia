export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function chat(
  messages: ChatMessage[],
  maxTokens = 1400
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY não configurada no .env");
  }

  const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`A IA falhou (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("A IA retornou vazio.");
  }
  return content.trim();
}