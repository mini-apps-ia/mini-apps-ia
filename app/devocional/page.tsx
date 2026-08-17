import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/app-header";
import AgendamentoPanel, {
  type AgendamentoRow,
} from "@/components/agendamento-panel";
import DevocionalForm from "./devocional-form";

export default async function DevocionalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("active, status")
    .eq("user_id", user.id)
    .eq("plan", "devocional")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const active = sub?.active ?? false;

  const { data: history } = await supabase
    .from("devocionais")
    .select("id, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: agend } = await supabase
    .from("agendamentos")
    .select("ativo, horario, tema_preferido")
    .eq("user_id", user.id)
    .maybeSingle();

  const agendamento: AgendamentoRow = agend ?? {
    ativo: false,
    horario: "07:00",
    tema_preferido: null,
  };

  return (
    <div className="min-h-screen">
      <AppHeader title="Devocional Diário com IA" />
      <main className="mx-auto max-w-3xl px-4 py-10">
        {active ? (
          <div className="space-y-6">
            <AgendamentoPanel initial={agendamento} />
            <DevocionalForm initialHistory={history ?? []} />
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 p-8 text-center">
            <h1 className="text-2xl font-bold">
              Assinatura necessária para usar o Devocional
            </h1>
            <p className="mt-3 text-zinc-600">
              Assine para receber devocionais diários personalizados com IA.
            </p>
            <Link
              href="/assinar?plan=devocional"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Assinar Devocional
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
