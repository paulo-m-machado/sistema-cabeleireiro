export function media(vals: number[]): number {
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function mediana(vals: number[]): number {
  if (!vals.length) return 0;
  const sorted = [...vals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function moda(vals: number[]): number[] {
  if (!vals.length) return [];
  const freq = new Map<number, number>();
  for (const v of vals) freq.set(v, (freq.get(v) ?? 0) + 1);
  const maxFreq = Math.max(...freq.values());
  return [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v);
}

export function modaQualitativa(vals: string[]): string[] {
  if (!vals.length) return [];
  const freq = new Map<string, number>();
  for (const v of vals) {
    if (v) freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  if (!freq.size) return [];
  const maxFreq = Math.max(...freq.values());
  return [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v);
}

export function amplitudeTotal(vals: number[]): number {
  if (!vals.length) return 0;
  return Math.max(...vals) - Math.min(...vals);
}

export function variancia(vals: number[]): number {
  if (vals.length < 2) return 0;
  const m = media(vals);
  return vals.reduce((acc, v) => acc + (v - m) ** 2, 0) / (vals.length - 1);
}

export function desvioPadrao(vals: number[]): number {
  return Math.sqrt(variancia(vals));
}

export function coeficienteVariacao(vals: number[]): number {
  const m = media(vals);
  if (m === 0) return 0;
  return (desvioPadrao(vals) / m) * 100;
}

export interface MedidaTendencia {
  variavel: string;
  media: number;
  mediana: number;
  moda: string;
  interpretacao: string;
}

export interface MedidaVariabilidade {
  variavel: string;
  amplitude: number;
  variancia: number;
  desvioPadrao: number;
  cv: number;
  interpretacao: string;
}
