// Frø-styrt tilfeldighet. Poenget: to iPader i samme bil kan skrive inn samme
// spillkode og få hver sin unike brett uten at de snakker sammen over nett.

export function hashTekst(tekst) {
  let h = 2166136261;
  for (let i = 0; i < tekst.length; i += 1) {
    h ^= tekst.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 — liten, rask og gir samme rekke hver gang for samme frø.
export function lagRng(fro) {
  let a = typeof fro === 'string' ? hashTekst(fro) : fro >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Bokstaver og tall som ikke kan forveksles med hverandre på en skjerm
// i en bil i fart: ingen I/1, O/0, S/5.
const KODETEGN = 'ABCDEFGHJKLMNPQRTUVWXYZ2346789';

export function lagKode(rng = Math.random) {
  let ut = '';
  for (let i = 0; i < 4; i += 1) ut += KODETEGN[Math.floor(rng() * KODETEGN.length)];
  return ut;
}

export function gyldigKode(tekst) {
  const k = String(tekst || '').toUpperCase().trim();
  return k.length === 4 && [...k].every((c) => KODETEGN.includes(c)) ? k : null;
}

export function velgTilfeldig(liste, rng) {
  return liste[Math.floor(rng() * liste.length)];
}

// Fisher–Yates på en kopi.
export function stokk(liste, rng) {
  const ut = liste.slice();
  for (let i = ut.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [ut[i], ut[j]] = [ut[j], ut[i]];
  }
  return ut;
}
