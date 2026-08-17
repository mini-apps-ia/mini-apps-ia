export type TemaDevocional = {
  id: string;
  label: string;
  prompt: string;
  imagemPrompt: string;
};

export const TEMAS: TemaDevocional[] = [
  {
    id: "ansiedade",
    label: "Ansiedade e medo",
    prompt: "ansiedade, medo e a paz que excede todo entendimento",
    imagemPrompt:
      "céu calmo ao amanhecer com nuvens suaves, sensação de paz, tons claros e serenos",
  },
  {
    id: "gratidao",
    label: "Gratidão",
    prompt: "gratidão e a presença de Deus no dia de hoje",
    imagemPrompt:
      "luz dourada do fim de tarde sobre campo tranquilo, calor e gratidão",
  },
  {
    id: "forca",
    label: "Força e cansaço",
    prompt: "força para dias difíceis e descanso em Deus",
    imagemPrompt:
      "montanha sólida iluminada ao nascer do sol, força e firmeza",
  },
  {
    id: "perdao",
    label: "Perdão e restauração",
    prompt: "perdão, recomeço e restauração em Cristo",
    imagemPrompt:
      "folhas verdes brotando após a chuva, renovação e esperança",
  },
  {
    id: "identidade",
    label: "Identidade em Cristo",
    prompt: "nova identidade em Cristo: filho, justo, santo e herdeiro",
    imagemPrompt:
      "luz atravessando a janela de um ambiente acolhedor, pertencimento",
  },
  {
    id: "esperanca",
    label: "Esperança",
    prompt: "esperança que não decepciona",
    imagemPrompt:
      "horizonte brilhante ao amanhecer, promessa de um novo dia",
  },
  {
    id: "familia",
    label: "Família",
    prompt: "família, relacionamentos e amor ao próximo",
    imagemPrompt:
      "mãos unidas em clima quente e acolhedor, unidade e amor",
  },
  {
    id: "trabalho",
    label: "Trabalho e propósito",
    prompt: "trabalho, propósito e confiança na provisão de Deus",
    imagemPrompt:
      "ambiente simples e bem iluminado, foco e propósito",
  },
  {
    id: "luto",
    label: "Luto e consolo",
    prompt: "luto, consolo e a presença de Deus na dor",
    imagemPrompt:
      "luz suave em céu nublado e tranquilo, conforto e paz",
  },
  {
    id: "livre",
    label: "Outro tema",
    prompt: "",
    imagemPrompt:
      "paisagem serena e acolhedora em tons suaves de índigo e violeta",
  },
];

export function getTema(id: string | null | undefined): TemaDevocional | null {
  if (!id) return null;
  return TEMAS.find((t) => t.id === id) ?? null;
}