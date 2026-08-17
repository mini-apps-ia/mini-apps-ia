export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function chat(
  messages: ChatMessage[],
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY não configurada no .env");
  }

  const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";
  const maxTokens = options.maxTokens ?? 1400;
  const temperature =
    options.temperature ?? Number(process.env.OPENROUTER_TEMPERATURE ?? 0.8);

  let resposta: Response | null = null;
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (res.status !== 429) {
      resposta = res;
      break;
    }

    if (tentativa === 3) {
      const text = await res.text();
      throw new Error(`A IA falhou (${res.status}): ${text.slice(0, 300)}`);
    }

    console.warn(`IA em limite de requisições (429) — tentativa ${tentativa}/3`);
    await new Promise((r) => setTimeout(r, 3000 * tentativa));
  }

  if (!resposta) {
    throw new Error("Falha ao contactar a IA.");
  }

  if (!resposta.ok) {
    const text = await resposta.text();
    throw new Error(`A IA falhou (${resposta.status}): ${text.slice(0, 300)}`);
  }

  const data = await resposta.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("A IA retornou vazio.");
  }
  return content.trim();
}

export async function gerarImagem(
  prompt: string,
  maxTokens = 1024
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const model =
    process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-2.5-flash-image";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        modalities: ["image", "text"],
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return typeof url === "string" && url.startsWith("data:image") ? url : null;
  } catch {
    return null;
  }
}