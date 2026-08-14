"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/config";

export default function CheckoutButton({
  plan,
  price,
  label,
}: {
  plan: string;
  price: number;
  label: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao iniciar a assinatura.");
      }
      window.location.href = data.initPoint;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao assinar.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={onSubscribe}
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading
          ? "Abrindo Mercado Pago..."
          : `Assinar ${label} por ${formatBRL(price)}/mês`}
      </button>
      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}