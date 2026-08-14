export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const plans = {
  devocional: {
    price: Number(process.env.PLAN_DEVOCIONAL_PRICE || 19.9),
    label: "Devocional Diário com IA",
    tagline: "Um devocional novo todos os dias, baseado na sua vida",
    features: [
      "Devocional diário personalizado",
      "Versículo + reflexão + oração",
      "Histórico salvo para rever a qualquer hora",
    ],
  },
  conteudo: {
    price: Number(process.env.PLAN_CONTEUDO_PRICE || 29.9),
    label: "Gerador de Conteúdo com IA",
    tagline: "Legendas, e-mails e roteiros prontos em segundos",
    features: [
      "Legendas para Instagram, Facebook e WhatsApp",
      "Roteiros de vídeo e e-mails",
      "Estilo do seu jeito (tom, nicho, plataforma)",
    ],
  },
} as const;

export type PlanId = keyof typeof plans;

export function isPlan(value: string | null): value is PlanId {
  return value === "devocional" || value === "conteudo";
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
