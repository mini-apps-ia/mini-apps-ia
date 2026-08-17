import Link from "next/link";
import { plans, formatBRL } from "@/lib/config";
import SalesQuiz from "@/components/sales-quiz";

const APP_CARDS = [
  {
    id: "devocional" as const,
    badge: "App 1 · Novo estilo",
    title: "Devocional Diário com IA",
    subtitle: "No estilo do Pr. Jailson Ferreira",
    desc: "Conte sua situação do dia e receba um devocional bíblico com versículo, reflexão e oração. Graça, justificação e identidade em Cristo, aplicados à sua vida real.",
    cta: "Assinar Devocional",
  },
  {
    id: "conteudo" as const,
    badge: "App 2 · Produção na hora",
    title: "Gerador de Conteúdo com IA",
    subtitle: "Legendas, e-mails e roteiros prontos",
    desc: "Escolha plataforma, tipo e tom: receba conteúdo pronto para publicar em segundos, com gancho, CTA e hashtags — sem precisar contratar redator.",
    cta: "Assinar Conteúdo",
  },
];

const STEPS = [
  {
    n: "1",
    t: "Faça o teste",
    d: "Responda 2 perguntas rápidas e descubra qual mini app combina com você.",
  },
  {
    n: "2",
    t: "Assine pelo Mercado Pago",
    d: "Pagamento recorrente mensal seguro no cartão de crédito. Sem fidelidade.",
  },
  {
    n: "3",
    t: "Use a IA todo dia",
    d: "Devocionais e conteúdos na hora, com histórico salvo. Cancele quando quiser.",
  },
];

const FAQS = [
  {
    q: "Como funciona a assinatura?",
    a: "Você escolhe um ou os dois mini apps, paga por mês pelo Mercado Pago e acessa tudo que é gerado. Pode cancelar quando quiser, sem multa.",
  },
  {
    q: "Preciso saber programar ou usar IA?",
    a: "Não. Tudo é pronto: você digita o assunto ou a situação do dia e recebe o resultado na hora.",
  },
  {
    q: "O devocional é baseado na Bíblia?",
    a: "Sim. Os devocionais são gerados com base bíblica sólida, no estilo do Pr. Jailson Ferreira, sempre apontando para Cristo e para a graça de Deus.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. A qualquer momento, direto pelo painel ou pelo Mercado Pago. Sem burocracia.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">
            Mini Apps <span className="text-indigo-400">IA</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-zinc-300">
            <a href="#apps" className="hidden hover:text-white sm:block">
              Apps
            </a>
            <a href="#como-funciona" className="hidden hover:text-white sm:block">
              Como funciona
            </a>
            <a href="#planos" className="hidden hover:text-white sm:block">
              Planos
            </a>
            <Link href="/login" className="hover:text-white">
              Entrar
            </Link>
            <a
              href="#quiz"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
            >
              Fazer o teste
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-zinc-950 via-indigo-950 to-zinc-950 py-24 text-center text-white">
          <div className="mx-auto max-w-4xl px-4">
            <p className="mb-5 inline-block rounded-full border border-indigo-400/40 bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-300">
              Mini aplicativos de assinatura com Inteligência Artificial
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Devocional diário e conteúdo pronto,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                gerados por IA para você
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
              Dois mini apps práticos por assinatura mensal: um devocional no
              estilo do Pr. Jailson Ferreira e um gerador de legendas, e-mails e
              roteiros para suas redes. Tudo na hora, direto no seu celular.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#quiz"
                className="rounded-lg bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
              >
                Descobrir meu mini app
              </a>
              <a
                href="#planos"
                className="rounded-lg border border-white/20 px-7 py-3.5 font-semibold text-white hover:bg-white/10"
              >
                Ver planos
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400">
              <span>Pagamento seguro via Mercado Pago</span>
              <span>Sem fidelidade</span>
              <span>Cancele quando quiser</span>
              <span>Novo: estilo Pr. Jailson Ferreira</span>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-white py-16">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:grid-cols-3">
            {[
              { t: "Sua vida espiritual não espera", d: "Você sente que precisa de um momento com Deus, mas a rotina não ajuda." },
              { t: "Postar todo dia cansa", d: "Faltam ideias, tempo e palavras para criar conteúdo bom com constância." },
              { t: "Conteúdo genérico não funciona", d: "Mensagens prontas e sem alma não falam com ninguém — nem com você." },
            ].map((p) => (
              <div key={p.t} className="rounded-2xl border border-zinc-200 p-6">
                <h3 className="font-bold text-zinc-900">{p.t}</h3>
                <p className="mt-2 text-sm text-zinc-600">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="apps" className="bg-zinc-50 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Dois mini apps, uma assinatura simples
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600">
              Cada app é pago, personalizado e feito para o seu dia a dia — não
              é um PDF parado, é uma ferramenta que trabalha por você.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {APP_CARDS.map((app, i) => {
                const plan = plans[app.id];
                return (
                  <article
                    key={app.id}
                    className={`flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm ${
                      i === 0 ? "ring-2 ring-indigo-200" : ""
                    }`}
                  >
                    <span className="text-sm font-semibold text-indigo-600">
                      {app.badge}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold">{app.title}</h3>
                    <p className="text-sm font-medium text-violet-600">
                      {app.subtitle}
                    </p>
                    <p className="mt-4 text-zinc-600">{app.desc}</p>
                    <ul className="mt-6 flex-1 space-y-2 text-sm text-zinc-700">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span className="mt-0.5 text-indigo-600">•</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex items-center justify-between">
                      <p className="text-2xl font-bold">
                        {formatBRL(plan.price)}
                        <span className="text-sm font-medium text-zinc-500">
                          /mês
                        </span>
                      </p>
                      <Link
                        href={`/assinar?plan=${app.id}`}
                        className={`rounded-lg px-5 py-2.5 font-semibold text-white ${
                          i === 0
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-violet-600 hover:bg-violet-700"
                        }`}
                      >
                        {app.cta}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Como funciona
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="rounded-2xl border border-zinc-200 p-6 text-center"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm text-zinc-600">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="quiz"
          className="bg-gradient-to-b from-zinc-950 via-indigo-950 to-zinc-950 py-20"
        >
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight text-white">
              Qual mini app combina com você?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-zinc-300">
              Responda 2 perguntas rápidas e receba a recomendação certa para a
              sua rotina.
            </p>
            <div className="mt-10">
              <SalesQuiz />
            </div>
          </div>
        </section>

        <section id="planos" className="bg-zinc-50 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Planos
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600">
              Assine o app ideal ou combine os dois. Pagamento recorrente,
              seguro e cancelável a qualquer momento.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {Object.entries(plans).map(([id, plan]) => (
                <div
                  key={id}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                  <h3 className="text-xl font-bold">{plan.label}</h3>
                  <p className="mt-2 text-sm text-zinc-600">{plan.tagline}</p>
                  <p className="mt-6 text-4xl font-bold">
                    {formatBRL(plan.price)}
                    <span className="text-base font-medium text-zinc-500">
                      /mês
                    </span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm text-zinc-700">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-0.5 text-indigo-600">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/assinar?plan=${id}`}
                    className="mt-8 block rounded-lg bg-indigo-600 px-4 py-2.5 text-center font-semibold text-white hover:bg-indigo-700"
                  >
                    Assinar agora
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Perguntas frequentes
            </h2>
            <div className="mt-10 space-y-3">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-zinc-200 p-5"
                >
                  <summary className="cursor-pointer font-semibold text-zinc-900">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm text-zinc-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-indigo-950 to-zinc-950 py-20 text-center text-white">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comece hoje, na mesma hora
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-300">
              Sem fila, sem burocracia. Faça o teste, assine e receba o
              primeiro devocional ou conteúdo em segundos.
            </p>
            <a
              href="#quiz"
              className="mt-8 inline-block rounded-lg bg-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
            >
              Descobrir meu mini app
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-zinc-950 py-8 text-zinc-400">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm">
          <p>
            Mini Apps IA — pagamentos processados pelo Mercado Pago. Cancele
            quando quiser.
          </p>
          <p className="mt-2">Suporte: contato@miniappsia.com.br</p>
        </div>
      </footer>
    </div>
  );
}
