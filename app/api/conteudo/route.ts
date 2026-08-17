import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chat } from "@/lib/ai";

export const runtime = "nodejs";

const BASE = `Você é um criador de conteúdo brasileiro e especialista em marketing digital, conhecido por textos curtos e potentes que convertem.

REGRAS GERAIS:
- Responda APENAS com o conteúdo final, pronto para publicar. Sem "aqui está", sem explicações, sem comentários antes ou depois.
- Português do Brasil.
- Quebre linhas para leitura fácil no celular.
- IMPORTANTE: NUNCA invente estatísticas, números, depoimentos ou marcas. Se não foram fornecidos pelo usuário, omita — prefira perguntas e afirmações a dados falsos.
- Respeite o tom indicado pelo usuário (ex.: amigável, direto, inspirador, divertido).`;

const FORMATO_LEGENDA = `FORMATO LEGENDA PARA REDES SOCIAIS:
1. Gancho: 1 a 2 frases iniciais que param o dedo (pergunta, dor, curiosidade ou afirmação ousada). Em plataformas com "mais", corte a primeira linha com "..." para puxar a leitura.
2. Desenvolvimento: 3 a 6 linhas curtas com valor prático e benefícios claros.
3. CTA: um único pedido de ação (seguir, salvar, comentar, curtir).
4. Hashtags: linha separada com até 15 hashtags relevantes, do maior para o menor alcance.`;

const FORMATO_ROTEIRO = `FORMATO ROTEIRO DE VÍDEO:
1. Título do vídeo (máx. 60 caracteres).
2. Gancho (0-10s): frase ou cena que prende nos primeiros segundos.
3. Cenas numeradas com tempo aproximado e o que falar/mostrar em cada uma.
4. CTA para interação (salvar, comentar, compartilhar).
5. Duração total estimada.`;

const FORMATO_EMAIL = `FORMATO E-MAIL:
1. Linha "Assunto:" com gatilho de curiosidade ou benefício (máx. 60 caracteres).
2. Corpo: saudação, gancho, mensagem em tópicos curtos e CTA único e claro.
3. Despedida e assinatura simples, sem inventar nome de pessoa (use uma assinatura genérica).`;

const FORMATO_POST = `FORMATO POST OU MENSAGEM CURTA (status, listas de transmissão):
- Mensagem de até 200 caracteres de rosto, dividida em até 3 blocos quando precisar.
- Tom próximo e direto, com emoji leve quando fizer sentido.
- Termine com um CTA simples (responder, tocar no link, ou pedir confirmação).`;

function sistemaPorTipo(tipo: string): string {
  const t = tipo.trim().toLowerCase();
  if (t.startsWith("roteiro")) return `${BASE}\n\n${FORMATO_ROTEIRO}`;
  if (t.startsWith("e-mail") || t.startsWith("email")) return `${BASE}\n\n${FORMATO_EMAIL}`;
  if (t.startsWith("post")) return `${BASE}\n\n${FORMATO_POST}`;
  return `${BASE}\n\n${FORMATO_LEGENDA}`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: sub, error: subError } = await supabase
    .from("subscriptions")
    .select("active")
    .eq("user_id", user.id)
    .eq("plan", "conteudo")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subError || !sub?.active) {
    return NextResponse.json(
      { error: "Assinatura do Gerador de Conteúdo inativa. Assine para continuar." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const plataforma = String(body?.plataforma ?? "Instagram").trim();
  const tipo = String(body?.tipo ?? "legenda").trim();
  const assunto = String(body?.assunto ?? "").trim();
  const tom = String(body?.tom ?? "amigável e profissional").trim();

  if (!assunto) {
    return NextResponse.json({ error: "Informe o assunto." }, { status: 400 });
  }

  try {
    const output = await chat(
      [
        { role: "system", content: sistemaPorTipo(tipo) },
        {
          role: "user",
          content: `Plataforma: ${plataforma}\nTipo de conteúdo: ${tipo}\nAssunto: ${assunto}\nTom: ${tom}\n\nGere o conteúdo completo pronto para publicar, seguindo o formato indicado.`,
        },
      ],
      { maxTokens: 2200, temperature: 0.8 }
    );

    await supabase
      .from("conteudos")
      .insert({
        user_id: user.id,
        type: tipo,
        input: { plataforma, tipo, assunto, tom },
        output,
      })
      .then((r) => r.error && console.error("Erro ao salvar conteúdo:", r.error));

    return NextResponse.json({ output });
  } catch (err) {
    console.error("Erro IA conteúdo:", err);
    return NextResponse.json(
      { error: "Falha ao gerar o conteúdo. Tente novamente." },
      { status: 502 }
    );
  }
}
