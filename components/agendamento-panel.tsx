"use client";

import { useState } from "react";
import { TEMAS } from "@/lib/temas";

export type AgendamentoRow = {
  ativo: boolean;
  horario: string;
  tema_preferido: string | null;
};

export default function AgendamentoPanel({
  initial,
}: {
  initial: AgendamentoRow;
}) {
  const [ativo, setAtivo] = useState(initial.ativo);
  const [horario, setHorario] = useState(initial.horario);
  const [tema, setTema] = useState(initial.tema_preferido ?? "");
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function salvar(dados: {
    ativo: boolean;
    horario: string;
    tema_preferido: string;
  }) {
    setSalvando(true);
    setMsg(null);
    try {
      const res = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar");
      setMsg("Preferências salvas!");
      setTimeout(() => setMsg(null), 2500);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  }

  function toggleAtivo() {
    const v = !ativo;
    setAtivo(v);
    void salvar({ ativo: v, horario, tema_preferido: tema });
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Agendamento diário</h2>
          <p className="text-sm text-zinc-600">
            Defina o horário em que você quer o devocional do dia.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleAtivo}
          className={`relative h-7 w-12 rounded-full transition ${
            ativo ? "bg-indigo-600" : "bg-zinc-300"
          }`}
          aria-pressed={ativo}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
              ativo ? "left-6" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {ativo && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              Horário diário
            </span>
            <input
              type="time"
              value={horario}
              onChange={(e) => {
                const h = e.target.value;
                setHorario(h);
                void salvar({ ativo, horario: h, tema_preferido: tema });
              }}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              Tema preferido
            </span>
            <select
              value={tema}
              onChange={(e) => {
                const t = e.target.value;
                setTema(t);
                void salvar({ ativo, horario, tema_preferido: t });
              }}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">Seguir minha escolha de cada dia</option>
              {TEMAS.filter((t) => t.prompt).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="mt-3 flex items-center gap-3 text-sm">
        {salvando && <span className="text-zinc-500">Salvando...</span>}
        {msg && (
          <span className="font-medium text-emerald-600">{msg}</span>
        )}
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        O envio automático por e-mail chega em breve. Enquanto isso, esse
        horário fica salvo como o seu lembrete diário.
      </p>
    </div>
  );
}