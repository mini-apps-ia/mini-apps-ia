import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chat } from "@/lib/ai";

export const runtime = "nodejs";

const SYSTEM = `Você é um redator criativo brasileiro especialista em marketing digital e redes sociais.
Sua missão: produzir conteúdo pronto para publicação no formato e tom que o usuário pedir.
Sempre responda em português do Brasil, com CTA natural e hashtags relevantes quando for post de rede social.
Não invente dados ou números sem que o usuário forneça.`;

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
    const output = await chat([
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Plataforma: ${plataforma}\nTipo de conteúdo: ${tipo}\nAssunto: ${assunto}\nTom: ${tom}\n\nGere o conteúdo completo pronto para publicar.`,
      },
    ]);

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
