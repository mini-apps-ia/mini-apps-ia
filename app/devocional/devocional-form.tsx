"use client";

import { useState } from "react";
import { TEMAS, getTema } from "@/lib/temas";
import { baixarCard, renderDevocionalCard } from "@/lib/card-image";
import DevocionalCardView from "@/components/devocional-card-view";

type DevocionalItem = {
  id: string;
  content: string;
  created_at: string;
  imagemDataUrl?: string | null;
};

export default function DevocionalForm({
  initialHistory,
}: {
  initialHistory: DevocionalItem[];
}) {
  const [nome, setNome] = useState("");
  const [temaId, setTemaId] = useState("");
  const [tema, setTema] = useState("");
  const [usarImagem, setUsarImagem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<DevocionalItem[]>(initialHistory);
  const [copied, setCopied] = useState<string | null>(null);
  const [baixando, setBaixando] = useState<string | null>(null);

  function escolherTema(id: string) {
    const t = getTema(id);
    if (!t) return;
    setTemaId(t.id);
    setTema(t.prompt);
  }

  async function gerar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const tAtual = getTema(temaId);
      const res = await fetch("/api/devocional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          tema,
          imagemFundo: usarImagem,
          imagemPrompt: tAtual?.imagemPrompt ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar.");
      const item: DevocionalItem = {
        id: `${Date.now()}`,
        content: data.content,
        created_at: new Date().toISOString(),
        imagemDataUrl: data.imagemDataUrl ?? null,
      };
      setHistory((h) => [item, ...h]);
      setUsarImagem(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar.");
    } finally {
      setLoading(false);
    }
  }

  async function copiar(id: string, texto: string) {
    await navigator.clipboard.writeText(texto);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  async function baixar(item: DevocionalItem) {
    setBaixando(item.id);
    try {
      await baixarCard(item.content, item.imagemDataUrl, "devocional.png");
    } catch {
      setError("Não foi possível gerar a imagem para baixar.");
    } finally {
      setBaixando(null);
    }
  }

  async function compartilhar(item: DevocionalItem) {
    try {
      const blob = await renderDevocionalCard(
        item.content,
        item.imagemDataUrl
      );
      const file = new File([blob], "devocional.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (d?: ShareData) => boolean;
      };
      if (nav.canShare && nav.share && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: "Devocional Diário" });
        return;
      }
    } catch {
      /* segue para o fallback */
    }
    const url = `https://wa.me/?text=${encodeURIComponent(item.content)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Devocional do seu dia
        </h1>
        <p className="mt-1 text-zinc-600">
          No estilo do Pr. Jailson Ferreira · escolha um tema e receba na hora
        </p>
      </div>

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
              onChange={(e) => {
                setTema(e.target.value);
                if (temaId) setTemaId("");
              }}
              placeholder="ex: ansiedade no trabalho, gratidão..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="mt-4">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Ou escolha um tema pronto
          </span>
          <div className="flex flex-wrap gap-2">
            {TEMAS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  t.prompt ? escolherTema(t.id) : document.getElementById("tema")?.focus()
                }
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  temaId === t.id
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-zinc-300 text-zinc-700 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-5 flex items-center gap-2.5 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={usarImagem}
            onChange={(e) => setUsarImagem(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 accent-indigo-600"
          />
          Gerar imagem de fundo com IA (fica mais bonito e demora um pouco)
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading
            ? usarImagem
              ? "Gerando devocional com imagem..."
              : "Gerando devocional..."
            : "Gerar devocional"}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Histórico</h2>
            {copied && (
              <span className="text-sm text-emerald-600">Copiado!</span>
            )}
          </div>
          {history.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-zinc-200 p-4 sm:p-6"
            >
              <DevocionalCardView
                content={item.content}
                imagemDataUrl={item.imagemDataUrl}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => baixar(item)}
                  disabled={baixando === item.id}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {baixando === item.id ? "Baixando..." : "Baixar card"}
                </button>
                <button
                  type="button"
                  onClick={() => compartilhar(item)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Compartilhar
                </button>
                <button
                  type="button"
                  onClick={() => copiar(item.id, item.content)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Copiar texto
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}