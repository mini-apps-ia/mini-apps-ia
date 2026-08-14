import { NextRequest, NextResponse } from "next/server";
import { getPreapproval } from "@/lib/payment";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const type: string = payload?.type ?? "";
  const id: string = payload?.data?.id ? String(payload.data.id) : "";

  if (type === "preapproval" && id) {
    try {
      const pa = await getPreapproval(id);
      const status = pa?.status ?? "pending";
      const active = status === "authorized";
      const now = new Date().toISOString();
      const externalRef = pa?.external_reference ?? "";

      const admin = createAdminClient();
      const base = admin.from("subscriptions");

      if (externalRef.startsWith("user_")) {
        const userId = externalRef.replace("user_", "");
        await base
          .update({
            status,
            active,
            updated_at: now,
            mp_preapproval_id: id,
          })
          .eq("user_id", userId);
      } else {
        await base
          .update({ status, active, updated_at: now })
          .eq("mp_preapproval_id", id);
      }
    } catch (err) {
      console.error("Erro no webhook Mercado Pago:", err);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
