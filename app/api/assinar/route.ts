import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPreapproval } from "@/lib/payment";
import { plans, type PlanId, isPlan } from "@/lib/config";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para assinar." }, { status: 401 });
  }

  const body = await request.json();
  const rawPlan = String(body?.plan ?? "");

  if (!isPlan(rawPlan)) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  const plan: PlanId = rawPlan;

  const email = user.email ?? "";
  if (!email) {
    return NextResponse.json(
      { error: "Sua conta não tem e-mail vinculado." },
      { status: 400 }
    );
  }

  await supabase.from("subscriptions").upsert(
    { user_id: user.id, plan, status: "pending", active: false },
    { onConflict: "user_id,plan" }
  );

  let preapprovalId: string | null = null;
  try {
    const preapproval = await createPreapproval({
      price: plans[plan].price,
      reason: plans[plan].label,
      externalReference: `user_${user.id}`,
      payerEmail: email,
    });
    preapprovalId = preapproval?.id ? String(preapproval.id) : null;

    if (preapprovalId) {
      await supabase
        .from("subscriptions")
        .update({ mp_preapproval_id: preapprovalId })
        .eq("user_id", user.id)
        .eq("plan", plan);
    }

    const initPoint = preapproval?.init_point;
    if (initPoint) {
      return NextResponse.json({ initPoint });
    }
    return NextResponse.json(
      { error: "Não foi possível gerar o checkout. Tente novamente." },
      { status: 502 }
    );
  } catch (err) {
    console.error("Erro ao criar assinatura Mercado Pago:", err);
    return NextResponse.json(
      { error: "Falha ao se comunicar com o Mercado Pago." },
      { status: 502 }
    );
  }
}
