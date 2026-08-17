import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chat, gerarImagem } from "@/lib/ai";
import { getPerfil } from "@/lib/perfil";

export const runtime = "nodejs";
export const maxDuration = 120;

function SYSTEM(perfilInstrucoes: string) {
  return `Você é um escritor de devocionais evangélicos brasileiros.

AUTOR QUE VOCÊ REPRESENTA:
${perfilInstrucoes}

TAREFA: escrever um devocional novo e edificante para o dia de hoje, assumindo completamente a identidade, as ênfases e o estilo do autor acima.

FORMATO OBRIGATÓRIO (nesta ordem, sem nada antes nem depois):
1. "# Título" — título curto (3 a 6 palavras), envolvente e específico, em português correto; proibido usar ":" dentro do título, hífens desnecessários, palavras estranhas ou malformadas.
2. "Versículo base:" — exatamente esse rótulo na LINHA PRÓPRIA, seguido da referência bíblica real e correta (ex.: "Versículo base: João 1:12"). Obrigatório sempre escrever o rótulo "Versículo base:" antes da referência.
3. De 3 a 4 parágrafos de reflexão (250 a 400 palavras no total), com este arco:
   - 1º conecta o versículo à situação ou ao tema apontado pelo leitor, de forma acolhedora;
   - 2º traz ensino bíblico sólido, fiel às ênfases do autor representado;
   - 3º aplica o ensino de forma prática e concreta para a vida real de hoje;
   - 4º (opcional) encerra com encorajamento e esperança firmada em Cristo.
4. "Oração:" — um parágrafo de oração com 2 a 4 frases, pessoal e sincera.

REGRAS:
- Português do Brasil, tom próximo e pastoral, com CONCORDÂNCIA e gramática corretas — revise cada frase antes de responder (ex.: "do próprio Deus", nunca "da própria Deus"; memória correta de gênero e número).
- Sempre aponte para Cristo e para a graça de Deus.
- Proibido: teologia da prosperidade, legalismo, julgamento do leitor, clichês vazios e textos genéricos.
- Nomes dos livros bíblicos sempre em português correto (ex.: Hebreus, não "Hebrewos"; Romanos, não "Romanos 10:17" fora do contexto claro).
- Não use caracteres de marcação (**, *, _, #, ###) em nenhum lugar do texto.
- Se o tema envolver dor, medo ou pecado, trate com graça e restauração.
- Faça cada devocional único em ângulo e aplicação, sem repetir a estrutura de textos anteriores.`;
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
  const perfil = getPerfil(String(body?.perfil ?? ""));
  const querImagem = body?.imagemFundo === true || body?.imagemFundo === "true";
  const imagemPrompt = String(body?.imagemPrompt ?? "")
    .trim()
    .slice(0, 300);

  try {
    const content = await chat(
      [
        { role: "system", content: SYSTEM(perfil.instrucoes) },
        {
          role: "user",
          content: `Escreva o devocional de hoje.\nNome do leitor: ${nome || "um filho de Deus"}\nSituação ou tema do dia: ${tema}\n\nAplique o tema de forma concreta e pessoal à vida do leitor, com a identidade, as ênfases e o estilo de ${perfil.nome}.`,
        },
      ],
      { maxTokens: 1600, temperature: 0.9 }
    );

    let imagemDataUrl: string | null = null;
    if (querImagem) {
      const descricao =
        imagemPrompt ||
        `${tema} — cenário sereno e acolhedor, tons suaves de índigo e violeta`;
      imagemDataUrl = await gerarImagem(
        `Imagem de fundo devocional cristão, SEM texto, proporção 4:5, suave e acolhedora: ${descricao}`
      );
    }

    await supabase
      .from("devocionais")
      .insert({ user_id: user.id, content })
      .then((r) => r.error && console.error("Erro ao salvar devocional:", r.error));

    return NextResponse.json({ content, imagemDataUrl });
  } catch (err) {
    console.error("Erro IA devocional:", err);
    return NextResponse.json(
      { error: "Falha ao gerar o devocional. Tente novamente." },
      { status: 502 }
    );
  }
}
