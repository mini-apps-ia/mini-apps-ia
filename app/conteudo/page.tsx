import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/app-header";
import ConteudoForm from "./conteudo-form";

export default async function ConteudoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("active, status")
    .eq("user_id", user.id)
    .eq("plan", "conteudo")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const active = sub?.active ?? false;

  const { data: history } = await supabase
    .from("conteudos")
    .select("id, type, output, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen">
      <AppHeader title="Gerador de Conteúdo com IA" />
      <main className="mx-auto max-w-3xl px-4 py-10">
        {active ? (
          <ConteudoForm initialHistory={history ?? []} />
        ) : (
          <div className="rounded-2xl border border-zinc-200 p-8 text-center">
            <h1 className="text-2xl font-bold">
              Assinatura necessária para usar o Gerador de Conteúdo
            </h1>
            <p className="mt-3 text-zinc-600">
              Assine para gerar legendas, roteiros e e-mails com IA.
            </p>
            <Link
              href="/assinar?plan=conteudo"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Assinar Gerador de Conteúdo
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}