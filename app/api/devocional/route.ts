import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chat } from "@/lib/ai";

export const runtime = "nodejs";

const SYSTEM = `Você é um pastor e escritor de devocionais evangélicos brasileiros.
Sua missão: gerar um devocional bíblico novo e edificante.
Formato obrigatório:
- Primeira linha: "# Título do devocional"
- Depois: "Versículo base:" seguido da referência bíblica correta
- Depois um texto de 3 a 4 parágrafos com reflexão prática, acolhedora e com base bíblica sólida
- Termine com "Oração:" e uma oração curta e sincera
Linguagem: português do Brasil, tom próximo e pastoral, sem heresia, sem teologia da prosperidade, sempre apontando para Cristo e para a graça de Deus. Nada de textos genéricos; aplique a mensagem à vida diária do leitor.`;

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
    .eq("plan", "devocional")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subError || !sub?.active) {
    return NextResponse.json(
      { error: "Assinatura do Devocional inativa. Assine para continuar." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const nome = String(body?.nome ?? "").trim();
  const tema = String(body?.tema ?? "gratidão e presença de Deus no dia de hoje").trim();

  try {
    const content = await chat([
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Escreva um devocional para ${nome || "um filho de Deus"}. Tema ou situação do dia: ${tema}. Seja específico e aplicável.`,
      },
    ]);

    await supabase
      .from("devocionais")
      .insert({ user_id: user.id, content })
      .then((r) => r.error && console.error("Erro ao salvar devocional:", r.error));

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Erro IA devocional:", err);
    return NextResponse.json(
      { error: "Falha ao gerar o devocional. Tente novamente." },
      { status: 502 }
    );
  }
}
