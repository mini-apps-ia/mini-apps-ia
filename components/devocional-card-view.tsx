"use client";

import { parseDevocional } from "@/lib/parse-devocional";

export default function DevocionalCardView({
  content,
  imagemDataUrl,
}: {
  content: string;
  imagemDataUrl?: string | null;
}) {
  const d = parseDevocional(content);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl text-white shadow-lg"
      style={
        imagemDataUrl
          ? {
              backgroundImage: `url(${imagemDataUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="relative grid aspect-[4/5] grid-rows-[auto_1fr] gap-4 p-6">
        {!imagemDataUrl && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-900 via-violet-900 to-zinc-950" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/65 to-black/80" />

        <div className="space-y-3 pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
            Devocional diário · Mini Apps IA
          </p>
          <div className="h-0.5 w-10 bg-indigo-300/60" />
          <h3 className="font-serif text-3xl font-bold leading-snug">
            {d.titulo}
          </h3>
          {d.versiculo && (
            <p className="text-sm italic text-indigo-200">{d.versiculo}</p>
          )}
        </div>

        <div className="overflow-hidden">
          <div className="mb-3 h-px w-full bg-white/20" />
          <div className="space-y-3">
            {d.corpo.map((p, i) => (
              <p
                key={i}
                className="text-[13px] leading-relaxed text-zinc-100 line-clamp-[6]"
              >
                {p}
              </p>
            ))}
          </div>
          {d.oracao && (
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                Oração
              </p>
              <p className="mt-1 text-[13px] italic leading-relaxed text-indigo-100 line-clamp-4">
                {d.oracao}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}