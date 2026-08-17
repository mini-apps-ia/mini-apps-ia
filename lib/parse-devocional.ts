export type DevocionalParsed = {
  titulo: string;
  versiculo: string;
  oracao: string;
  corpo: string[];
};

function limpar(texto: string): string {
  return texto
    .replace(/\*\*/g, "")
    .replace(/_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseDevocional(content: string): DevocionalParsed {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let titulo = "";
  let versiculo = "";
  let oracao = "";
  let emOracao = false;
  const corpo: string[] = [];

  for (const ln of lines) {
    const marcador = ln.replace(/^[*\s]+/, "");
    if (marcador.startsWith("#")) {
      titulo = limpar(marcador.replace(/^#+/, ""));
      continue;
    }
    const baseMarker = /^vers[ií]culo\s*base:?/i.exec(marcador);
    if (baseMarker) {
      versiculo = limpar(marcador.slice(baseMarker[0].length));
      continue;
    }
    const oracaoMarker = /^ora[çc][ãa]o:?/i.exec(marcador);
    if (oracaoMarker) {
      emOracao = true;
      oracao = limpar(marcador.slice(oracaoMarker[0].length));
      continue;
    }
    const refMarker =
      /^(?:\d{1,2}\s+)?[A-Za-zÀ-Žà-ž]+(?:\s+\d{1,2}:\d{1,2}(?:[-–]\d{1,2})?)$/.exec(
        marcador
      );
    if (refMarker && !versiculo) {
      versiculo = limpar(marcador);
      continue;
    }
    if (emOracao) {
      oracao = oracao ? oracao + " " + limpar(ln) : limpar(ln);
      continue;
    }
    corpo.push(limpar(ln));
  }

  return { titulo, versiculo, oracao, corpo };
}