// Trykkpause — en felles sperre mellom hvert trykk, uansett hvilken ting det
// gjelder.
//
// Frimodus har fra før en sperre per ting, men den hindrer ikke at noen går
// gjennom hele brettet på ti sekunder og krysser av alt. Denne sperren gjør
// det: etter et trykk er det stille i femten sekunder, og først da kan neste
// ting registreres.
//
// Tidspunktet lagres, ikke bare holdes i minnet. Ellers ville en omlasting
// av siden nullstille sperren.

import { les, endre } from './lager.js';

export const STANDARD_PAUSE = 15;

export function pauseSekunder() {
  const v = les().innstillinger.trykkpause;
  return Number.isFinite(v) ? Math.max(0, v) : STANDARD_PAUSE;
}

/** Hvor mange sekunder til neste trykk er lov. 0 = klar nå. */
export function igjen(na = Date.now()) {
  const p = pauseSekunder();
  if (!p) return 0;
  const sist = les().sistTrykk || 0;
  if (!sist) return 0;
  return Math.max(0, Math.ceil((p * 1000 - (na - sist)) / 1000));
}

export function erKlar() {
  return igjen() === 0;
}

export function merkTrykk() {
  endre((t) => { t.sistTrykk = Date.now(); });
  start();
  varsle();
}

/** Brukes av angre: et feiltrykk skal ikke koste femten sekunder. */
export function nullstillPause() {
  endre((t) => { t.sistTrykk = 0; });
  varsle();
}

// ---------------------------------------------------------------- nedtelling

const lyttere = new Set();
let intervall = null;

function varsle() {
  const n = igjen();
  for (const fn of [...lyttere]) {
    // Skjermer byttes ut mens sperren går. En lytter som ikke lenger hører til
    // noe på siden melder seg av selv.
    if (fn.levende && !fn.levende()) { lyttere.delete(fn); continue; }
    fn(n);
  }
  if (!n) stopp();
}

function start() {
  if (intervall) return;
  intervall = setInterval(varsle, 250);
}

function stopp() {
  clearInterval(intervall);
  intervall = null;
}

/**
 * Følger nedtellingen. `levende` sier om lytteren fortsatt hører til noe som
 * vises; returnerer en funksjon for å melde seg av manuelt.
 */
export function folg(fn, levende = null) {
  fn.levende = levende;
  lyttere.add(fn);
  fn(igjen());
  if (igjen()) start();
  return () => lyttere.delete(fn);
}
