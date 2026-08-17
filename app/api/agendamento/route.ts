import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export type AgendamentoRow = {
  ativo: boolean;
  horario: string;
  tema_preferido: string | null;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data } = await supabase
    .from("agendamentos")
    .select("ativo, horario, tema_preferido")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    agendamento: data ?? { ativo: false, horario: "07:00", tema_preferido: null },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const ativo = body?.ativo === true;
  const horario = /^\d{2}:\d{2}$/.test(String(body?.horario ?? ""))
    ? String(body.horario)
    : "07:00";
  const tema_preferido = String(body?.tema_preferido ?? "").trim() || null;

  const { data, error } = await supabase
    .from("agendamentos")
    .upsert(
      { user_id: user.id, ativo, horario, tema_preferido },
      { onConflict: "user_id" }
    )
    .select("ativo, horario, tema_preferido")
    .single();

  if (error) {
    console.error("Erro ao salvar agendamento:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar o agendamento. Verifique se a tabela agendamentos foi criada no Supabase." },
      { status: 500 }
    );
  }

  return NextResponse.json({ agendamento: data });
}