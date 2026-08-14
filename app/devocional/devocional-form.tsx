"use client";

import { useState } from "react";

type DevocionalItem = {
  id: string;
  content: string;
  created_at: string;
};

export default function DevocionalForm({
  initialHistory,
}: {
  initialHistory: DevocionalItem[];
}) {
  const [nome, setNome] = useState("");
  const [tema, setTema] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<DevocionalItem[]>(initialHistory);
  const [copied, setCopied] = useState(false);

  async function gerar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/devocional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, tema }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar.");
      const item: DevocionalItem = {
        id: `${Date.now()}`,
        content: data.content,
        created_at: new Date().toISOString(),
      };
      setHistory((h) => [item, ...h]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar.");
    } finally {
      setLoading(false);
    }
  }

  async function copiar(texto: string) {
    await navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Devocional do seu dia
      </h1>
      <form
        onSubmit={gerar}
        className="rounded-2xl border border-zinc-200 p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="nome"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Seu nome
            </label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ana"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label
              htmlFor="tema"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Situação / tema do dia
            </label>
            <input
              id="tema"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="ex: ansiedade no trabalho, gratidão..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Gerando devocional..." : "Gerar devocional"}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Histórico</h2>
            {copied && (
              <span className="text-sm text-emerald-600">Copiado!</span>
            )}
          </div>
          {history.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-zinc-200 p-6"
            >
              <p className="whitespace-pre-wrap text-zinc-800">
                {item.content}
              </p>
              <button
                type="button"
                onClick={() => copiar(item.content)}
                className="mt-4 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Copiar
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
