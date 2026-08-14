import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { plans, type PlanId } from "@/lib/config";
import type { SubscriptionRow } from "@/lib/types";
import SignOutButton from "./sign-out-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const byPlan = new Map<string, SubscriptionRow>();
  for (const s of subs ?? []) {
    if (!byPlan.has(s.plan)) byPlan.set(s.plan, s);
  }

  const cards: { plan: PlanId; active: boolean; status: string }[] = (
    Object.keys(plans) as PlanId[]
  ).map((plan) => {
    const sub = byPlan.get(plan);
    return {
      plan,
      active: sub?.active ?? false,
      status: sub?.status ?? "none",
    };
  });

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Mini Apps <span className="text-indigo-600">IA</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Meus mini apps</h1>
        <p className="mt-2 text-zinc-600">
          Acesse seus aplicativos e acompanhe suas assinaturas.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {cards.map(({ plan, active, status }) => (
            <div
              key={plan}
              className="flex flex-col rounded-2xl border border-zinc-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{plans[plan].label}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {active
                    ? "Ativa"
                    : status === "pending"
                      ? "Aguardando pagamento"
                      : "Inativa"}
                </span>
              </div>
              <p className="mt-2 flex-1 text-sm text-zinc-600">
                {plans[plan].tagline}
              </p>
              <div className="mt-6">
                {active ? (
                  <Link
                    href={plan === "devocional" ? "/devocional" : "/conteudo"}
                    className="block rounded-lg bg-indigo-600 px-4 py-2.5 text-center font-semibold text-white hover:bg-indigo-700"
                  >
                    Abrir app
                  </Link>
                ) : (
                  <Link
                    href={`/assinar?plan=${plan}`}
                    className="block rounded-lg border border-zinc-300 px-4 py-2.5 text-center font-semibold text-zinc-800 hover:bg-zinc-50"
                  >
                    Assinar
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
