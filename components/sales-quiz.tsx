"use client";

import Link from "next/link";
import { useState } from "react";
import { plans, formatBRL } from "@/lib/config";

type Option = {
  label: string;
  desc?: string;
  devocional?: number;
  conteudo?: number;
};

const QUESTIONS: { title: string; options: Option[] }[] = [
  {
    title: "Qual é o seu maior desafio hoje?",
    options: [
      {
        label: "Manter uma vida espiritual constante",
        desc: "Quero um momento com Deus todo dia, mesmo com a correria",
        devocional: 2,
      },
      {
        label: "Postar conteúdo de qualidade nas redes",
        desc: "Quero legendas, roteiros e e-mails prontos em minutos",
        conteudo: 2,
      },
      {
        label: "Os dois: crescer em Deus e produzir",
        desc: "Quero equilíbrio entre fé e conteúdo",
        devocional: 1,
        conteudo: 1,
      },
    ],
  },
  {
    title: "O que você faria com 5 minutos livres agora?",
    options: [
      {
        label: "Ler um devocional e orar",
        desc: "Um texto curto, profundo e na hora certa",
        devocional: 2,
      },
      {
        label: "Gerar conteúdo pronto para publicar",
        desc: "Ganhar tempo no que você já faz todo dia",
        conteudo: 2,
      },
      {
        label: "Consistência é tudo para mim",
        desc: "Quero hábitos que se sustentam com pouco tempo",
        devocional: 1,
        conteudo: 1,
      },
    ],
  },
];

function Resultado({
  dev,
  conc,
  onReset,
}: {
  dev: number;
  conc: number;
  onReset: () => void;
}) {
  const combo = dev === conc;
  const foco: "devocional" | "conteudo" | "combo" = combo
    ? "combo"
    : dev > conc
      ? "devocional"
      : "conteudo";

  const title =
    foco === "devocional"
      ? "Seu mini app é o Devocional Diário"
      : foco === "conteudo"
        ? "Seu mini app é o Gerador de Conteúdo"
        : "Você é do time completo";

  const text =
    foco === "devocional"
      ? "Um devocional novo todos os dias, no estilo do Pr. Jailson Ferreira, aplicado à sua situação real."
      : foco === "conteudo"
        ? "Legendas, roteiros e e-mails prontos para publicar, no tom e plataforma que você escolher."
        : "Para quem não abre mão da fé nem da produtividade: os dois apps por assinaturas que cabem no bolso.";

  return (
    <div className="rounded-3xl border border-indigo-200 bg-gradient-to-b from-indigo-50 to-white p-8 text-center">
      <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
        Recomendação para você
      </span>
      <h3 className="mt-2 text-2xl font-bold text-zinc-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-zinc-600">{text}</p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {foco !== "conteudo" && (
          <Link
            href="/assinar?plan=devocional"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Assinar Devocional · {formatBRL(plans.devocional.price)}/mês
          </Link>
        )}
        {foco !== "devocional" && (
          <Link
            href="/assinar?plan=conteudo"
            className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
          >
            Assinar Conteúdo · {formatBRL(plans.conteudo.price)}/mês
          </Link>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-medium text-zinc-500 underline hover:text-zinc-700"
      >
        Refazer o teste
      </button>
    </div>
  );
}

export default function SalesQuiz() {
  const [step, setStep] = useState(0);
  const [dev, setDev] = useState(0);
  const [conc, setConc] = useState(0);

  const total = QUESTIONS.length;

  function escolher(o: Option) {
    setDev((v) => v + (o.devocional ?? 0));
    setConc((v) => v + (o.conteudo ?? 0));
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setStep(total); // resultado
    }
  }

  if (step === total) {
    return (
      <Resultado
        dev={dev}
        conc={conc}
        onReset={() => {
          setDev(0);
          setConc(0);
          setStep(0);
        }}
      />
    );
  }

  const q = QUESTIONS[step];

  return (
    <div className="rounded-3xl border border-indigo-200 bg-white p-8 shadow-xl shadow-indigo-100">
      <div className="mb-6 flex items-center gap-2">
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i <= step ? "bg-indigo-600" : "bg-zinc-200"
            }`}
          />
        ))}
      </div>

      <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
        Pergunta {step + 1} de {total}
      </span>
      <h3 className="mt-2 text-2xl font-bold text-zinc-900">{q.title}</h3>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {q.options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => escolher(o)}
            className="rounded-xl border border-zinc-200 p-5 text-left transition hover:border-indigo-400 hover:bg-indigo-50/50"
          >
            <span className="font-semibold text-zinc-900">{o.label}</span>
            {o.desc && (
              <span className="mt-1 block text-sm text-zinc-500">{o.desc}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
