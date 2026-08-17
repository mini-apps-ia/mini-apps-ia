import { parseDevocional } from "./parse-devocional";

const W = 1080;
const H = 1350;
const MARGEM = 88;
const AREA = W - MARGEM * 2;
const INICIO = 210;
const FIM = H - 96;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao carregar imagem"));
    img.src = src;
  });
}

async function desenharFundo(
  ctx: CanvasRenderingContext2D,
  imagemDataUrl?: string | null
) {
  let temImagem = false;
  if (imagemDataUrl) {
    try {
      const img = await loadImage(imagemDataUrl);
      const scale = Math.max(W / img.width, H / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      temImagem = true;
    } catch {
      temImagem = false;
    }
  }
  const g = ctx.createLinearGradient(0, 0, 0, H);
  if (temImagem) {
    g.addColorStop(0, "rgba(2,6,23,0.72)");
    g.addColorStop(0.5, "rgba(2,6,23,0.78)");
    g.addColorStop(1, "rgba(2,6,23,0.92)");
  } else {
    g.addColorStop(0, "#312e81");
    g.addColorStop(0.5, "#4c1d95");
    g.addColorStop(1, "#1e1b4b");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function sombra(ctx: CanvasRenderingContext2D, on: boolean) {
  if (on) {
    ctx.shadowColor = "rgba(0,0,0,0.75)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 2;
  } else {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const palavras = text.trim().split(/\s+/);
  const linhas: string[] = [];
  let linha = "";
  for (const p of palavras) {
    const teste = linha ? `${linha} ${p}` : p;
    if (linha && ctx.measureText(teste).width > maxWidth) {
      linhas.push(linha);
      linha = p;
    } else {
      linha = teste;
    }
  }
  if (linha) linhas.push(linha);
  return linhas;
}

type Composicao = {
  font: number;
  titulo: string[];
  versiculo: string[];
  corpo: string[][];
  oracao: string[];
  total: number;
};

function compor(ctx: CanvasRenderingContext2D, data: ReturnType<typeof parseDevocional>, font: number): Composicao {
  ctx.font = `bold ${Math.round(font * 1.6)}px Georgia, serif`;
  const titulo = wrapText(ctx, data.titulo || "Devocional", AREA);
  ctx.font = `italic ${Math.round(font * 1.15)}px Georgia, serif`;
  const versiculo = data.versiculo ? wrapText(ctx, data.versiculo, AREA * 0.92) : [];
  ctx.font = `${font}px Arial, sans-serif`;
  const corpo = data.corpo.map((p) => wrapText(ctx, p, AREA));

  ctx.font = `italic ${Math.round(font * 1.05)}px Georgia, serif`;
  const oracao = data.oracao ? wrapText(ctx, data.oracao, AREA) : [];

  const ahTitulo = titulo.length * font * 1.6 * 1.28;
  const ahVersiculo = versiculo.length ? versiculo.length * font * 1.15 * 1.55 + 40 : 0;
  const ahCorpo = corpo.reduce((s, p) => s + p.length * font * 1.5 + font * 0.6, 0);
  const ahOracao = oracao.length ? oracao.length * font * 1.05 * 1.5 + 90 : 0;
  const total = 46 + ahTitulo + 36 + ahVersiculo + 60 + ahCorpo + ahOracao;

  return { font, titulo, versiculo, corpo, oracao, total };
}

export async function renderDevocionalCard(
  content: string,
  imagemDataUrl?: string | null
): Promise<Blob> {
  const data = parseDevocional(content);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");

  const c = document.createElement("canvas");
  c.width = 2;
  c.height = 2;
  const cctx = c.getContext("2d");
  if (!cctx) throw new Error("Canvas indisponível");

  let font = 40;
  let best: Composicao | null = null;
  while (font >= 24 && !best) {
    const com = compor(cctx, data, font);
    if (com.total <= FIM - INICIO) best = com;
    else font -= 2;
  }
  if (!best) best = compor(cctx, data, 24);

  await desenharFundo(ctx, imagemDataUrl);

  ctx.textBaseline = "top";
  let y = INICIO - 40;

  ctx.textAlign = "left";
  sombra(ctx, true);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 24px Arial, sans-serif";
  ctx.fillText("DEVOCIONAL DIÁRIO", MARGEM, y);
  y += 64;

  sombra(ctx, false);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(MARGEM, y, 72, 4);
  y += 30;

  sombra(ctx, true);
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.round(best.font * 1.6)}px Georgia, serif`;
  for (const l of best.titulo) {
    ctx.fillText(l, MARGEM, y);
    y += best.font * 1.6 * 1.28;
  }
  y += 26;

  if (best.versiculo.length) {
    ctx.fillStyle = "#e0e7ff";
    ctx.font = `italic ${Math.round(best.font * 1.15)}px Georgia, serif`;
    for (const l of best.versiculo) {
      ctx.fillText(l, MARGEM, y);
      y += best.font * 1.15 * 1.55;
    }
    y += 30;
  }
  y += 20;

  sombra(ctx, false);
  ctx.fillStyle = "rgba(196,181,253,0.6)";
  ctx.fillRect(MARGEM, y, AREA, 2);
  y += 46;

  sombra(ctx, true);
  ctx.fillStyle = "#f8fafc";
  ctx.font = `${best.font}px Arial, sans-serif`;
  for (const parag of best.corpo) {
    for (const l of parag) {
      ctx.fillText(l, MARGEM, y);
      y += best.font * 1.5;
    }
    y += best.font * 0.6;
  }

  if (best.oracao.length) {
    y += 24;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "600 26px Arial, sans-serif";
    ctx.fillText("O R A Ç Ã O", MARGEM, y);
    y += 44;
    ctx.fillStyle = "#e0e7ff";
    ctx.font = `italic ${Math.round(best.font * 1.05)}px Georgia, serif`;
    for (const l of best.oracao) {
      ctx.fillText(l, MARGEM, y);
      y += best.font * 1.05 * 1.5;
    }
  }

  sombra(ctx, false);

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob falhou"))), "image/png");
  });
}

export async function baixarCard(content: string, imagemDataUrl?: string | null, nome = "devocional.png") {
  const blob = await renderDevocionalCard(content, imagemDataUrl);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return blob;
}