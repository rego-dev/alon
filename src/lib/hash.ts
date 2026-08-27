/**
 * Deterministic, dependency-free hashing used to generate stable demo values
 * (checksums, review rotation, chart series). Pure so server and client agree.
 */
function fnv1a(input: string, seed = 0x811c9dc5): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** 64 lowercase hex chars — shaped like a real SHA-256 digest. */
export function pseudoSha256(input: string): string {
  let out = "";
  for (let round = 0; out.length < 64; round += 1) {
    out += fnv1a(`${input}:${round}`).toString(16).padStart(8, "0");
  }
  return out.slice(0, 64);
}

/** Stable integer in [min, max] derived from a string key. */
export function seededInt(key: string, min: number, max: number): number {
  const span = max - min + 1;
  return min + (fnv1a(key) % span);
}

/** Stable pick from an array. */
export function seededPick<T>(key: string, items: readonly T[]): T {
  return items[fnv1a(key) % items.length];
}

/** Stable float in [min, max] with fixed precision. */
export function seededFloat(key: string, min: number, max: number, decimals = 1): number {
  const t = (fnv1a(key) % 10_000) / 10_000;
  return Number((min + t * (max - min)).toFixed(decimals));
}
