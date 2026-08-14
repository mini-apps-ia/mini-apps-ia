import Link from "next/link";
import { plans, formatBRL } from "@/lib/config";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Mini Apps <span className="text-indigo-600">IA</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600">
            <a href="#produtos" className="hover:text-zinc-900">
              Apps
            </a>
            <a href="#precos" className="hover:text-zinc-900">
              Preços
            </a>
            <Link href="/login" className="hover:text-zinc-900">
              Entrar
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-20 text-center">
          <p className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-700">
            Mini aplicativos de assinatura com Inteligência Artificial
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Devocional diário e conteúdo pronto, gerados por IA para você
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
            Dois mini apps práticos por assinatura mensal: um devocional novo
            todos os dias no seu ritmo, e um gerador de legendas, e-mails e
            roteiros para suas redes sociais.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#precos"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Ver planos
            </a>
            <a
              href="#produtos"
              className="rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Conhecer os apps
            </a>
          </div>
        </section>

        <section id="produtos" className="bg-zinc-50 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Dois mini apps, uma assinatura simples
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <article className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <span className="text-sm font-semibold text-indigo-600">
                  App 1
                </span>
                <h3 className="mt-2 text-2xl font-bold">
                  Devocional Diário com IA
                </h3>
                <p className="mt-3 text-zinc-600">
                  Conte sua situação do dia e receba um devocional bíblico com
                  versículo, reflexão e oração — na hora.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-zinc-700">
                  {plans.devocional.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-indigo-600">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/assinar?plan=devocional"
                  className="mt-8 block rounded-lg border border-zinc-300 px-4 py-2.5 text-center font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  Assinar por {formatBRL(plans.devocional.price)}/mês
                </a>
              </article>

              <article className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <span className="text-sm font-semibold text-indigo-600">
                  App 2
                </span>
                <h3 className="mt-2 text-2xl font-bold">
                  Gerador de Conteúdo com IA
                </h3>
                <p className="mt-3 text-zinc-600">
                  Escolha a plataforma, o tipo e o assunto: receba legendas,
                  roteiros e e-mails prontos para publicar.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-zinc-700">
                  {plans.conteudo.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-indigo-600">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/assinar?plan=conteudo"
                  className="mt-8 block rounded-lg bg-indigo-600 px-4 py-2.5 text-center font-semibold text-white hover:bg-indigo-700"
                >
                  Assinar por {formatBRL(plans.conteudo.price)}/mês
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Como funciona
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Crie sua conta",
                d: "Cadastre-se com seu e-mail por um link mágico, sem senha.",
              },
              {
                n: "2",
                t: "Assine por Mercado Pago",
                d: "Pagamento recorrente mensal seguro, direto no cartão de crédito.",
              },
              {
                n: "3",
                t: "Use a IA",
                d: "Receba devocionais e conteúdos ilimitados na hora, com histórico salvo.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-zinc-200 p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-zinc-600">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="precos" className="bg-zinc-50 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Planos
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
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
      </main>

      <footer className="border-t border-zinc-200 py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-zinc-500">
          <p>
            Mini Apps IA — pagamentos processados pelo Mercado Pago. Cancele
            quando quiser.
          </p>
          <p className="mt-2">
            Suporte: contato@miniappsia.com.br
          </p>
        </div>
      </footer>
    </div>
  );
}
