import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { plans, isPlan, formatBRL, type PlanId } from "@/lib/config";
import CheckoutButton from "./checkout-button";

export default async function AssinarPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const planParam = plan ?? null;
  const planId: PlanId = isPlan(planParam) ? planParam : "devocional";
  const planInfo = plans[planId];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Voltar
        </Link>

        <div className="mt-6 rounded-2xl border border-zinc-200 p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">
            {planInfo.label}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">{planInfo.tagline}</p>

          <div className="mt-6 border-t border-zinc-200 pt-6">
            <p className="text-4xl font-bold">
              {formatBRL(planInfo.price)}
              <span className="text-base font-medium text-zinc-500">/mês</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              {planInfo.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-indigo-600">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <CheckoutButton
              plan={planId}
              price={planInfo.price}
              label={planInfo.label}
            />
          </div>

          <p className="mt-4 text-center text-xs text-zinc-500">
            {user
              ? `Assinando como ${user.email}`
              : "Você será redirecionado para o login antes de assinar."}
          </p>
        </div>
      </div>
    </div>
  );
}