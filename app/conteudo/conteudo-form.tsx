"use client";

import { useState } from "react";

type ConteudoItem = {
  id: string;
  type: string | null;
  output: string;
  created_at: string;
};

const PLATAFORMAS = ["Instagram", "Facebook", "WhatsApp", "TikTok", "YouTube"];
const TIPOS = ["Legenda", "Roteiro de vídeo", "E-mail", "Post e mensagem"];

export default function ConteudoForm({
  initialHistory,
}: {
  initialHistory: ConteudoItem[];
}) {
  const [plataforma, setPlataforma] = useState("Instagram");
  const [tipo, setTipo] = useState("Legenda");
  const [assunto, setAssunto] = useState("");
  const [tom, setTom] = useState("amigável e profissional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ConteudoItem[]>(initialHistory);
  const [copied, setCopied] = useState(false);

  async function gerar(e: React.FormEvent) {
    e.preventDefault();
    if (!assunto.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/conteudo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plataforma, tipo, assunto, tom }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar.");
      const item: ConteudoItem = {
        id: `${Date.now()}`,
        type: tipo,
        output: data.output,
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
        Gere conteúdo na hora
      </h1>
      <form
        onSubmit={gerar}
        className="rounded-2xl border border-zinc-200 p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              Plataforma
            </span>
            <select
              value={plataforma}
              onChange={(e) => setPlataforma(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              {PLATAFORMAS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              Tipo de conteúdo
            </span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2">
            <label
              htmlFor="assunto"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Assunto
            </label>
            <textarea
              id="assunto"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              rows={2}
              placeholder="ex: lançamento do novo curso de marketing para igrejas"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              Tom
            </span>
            <input
              value={tom}
              onChange={(e) => setTom(e.target.value)}
              placeholder="ex: inspirador, direto, divertido"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Gerando conteúdo..." : "Gerar conteúdo"}
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
              {item.type && (
                <span className="mb-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {item.type}
                </span>
              )}
              <p className="whitespace-pre-wrap text-zinc-800">{item.output}</p>
              <button
                type="button"
                onClick={() => copiar(item.output)}
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