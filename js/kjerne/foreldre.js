// Foreldrekontroll.
//
// Alt som sletter noe for godt bor her, bak en kode. Grunnen er enkel: en
// femåring som leter etter «nytt spill» skal ikke kunne treffe «slett alt».
//
// Koden er en sperre mot uhell, ikke sikkerhet. Den ligger i klartekst på
// enheten, og en voksen som virkelig vil forbi kommer forbi. Det sies også
// rett ut i skjermbildet — det er ikke noe å skjule.

import { les, endre, nullstillAlt, STANDARD } from './lager.js';

export function harKode() {
  return !!les().foreldre?.kode;
}

export function settKode(kode) {
  endre((t) => { t.foreldre.kode = String(kode); });
}

export function fjernKode() {
  endre((t) => { t.foreldre.kode = null; });
}

export function stemmerKoden(kode) {
  return les().foreldre?.kode === String(kode);
}

// ---------------------------------------------------------------- spillere

/**
 * Sletter en spiller. Spilleren tas samtidig ut av et spill som er i gang og
 * ut av frimodus, ellers ville turen referert til noen som ikke finnes.
 * Blir det ingen igjen i turen, avsluttes den.
 */
export function slettSpiller(id) {
  endre((t) => {
    t.spillere = t.spillere.filter((s) => s.id !== id);
    if (t.frimodus) {
      t.frimodus.deltakere = t.frimodus.deltakere.filter((d) => d.spillerId !== id);
    }
    const spill = t.aktivtSpill;
    if (spill) {
      const igjen = spill.deltakere.filter((d) => d.spillerId !== id);
      if (!igjen.length) t.aktivtSpill = null;
      else if (igjen.length !== spill.deltakere.length) {
        // Brettene er knyttet til plassnummer, så de må nummereres på nytt.
        const beholdt = spill.deltakere
          .map((d, i) => ({ d, i }))
          .filter(({ d }) => d.spillerId !== id);
        if (spill.modus !== 'sammen') {
          spill.brett = beholdt.map(({ i }) => spill.brett[i]);
          spill.merket = beholdt.map(({ i }) => spill.merket[i]);
          spill._bingoTalt = {};
        }
        spill.deltakere = beholdt.map(({ d }, n) => ({ ...d, plass: n }));
      }
    }
  });
}

export function slettAlleSpillere() {
  endre((t) => {
    t.spillere = [];
    t.aktivtSpill = null;
    if (t.frimodus) t.frimodus.deltakere = [];
  });
}

// ---------------------------------------------------------------- turer

export function slettTur(indeks) {
  endre((t) => { t.spottbok.turer.splice(indeks, 1); });
}

export function slettAlleTurer() {
  endre((t) => { t.spottbok.turer = []; });
}

/** Sletter turen som er i gang uten å lagre den i historikken. */
export function slettAktivtSpill() {
  endre((t) => { t.aktivtSpill = null; });
}

// ---------------------------------------------------------------- samling

export function nullstillFrimodusTelling() {
  endre((t) => {
    t.frimodus.antall = {};
    t.frimodus.sistFunn = {};
    t.frimodus.sisteAv = {};
    t.frimodus.logg = [];
    t.frimodus.startet = new Date().toISOString();
    t.frimodus.deltakere.forEach((d) => { d.poeng = 0; d.funn = 0; });
  });
}

/** Tømmer spottboka: funnene, merkene og all statistikk. Spillerne beholdes. */
export function nullstillSpottbok() {
  endre((t) => {
    t.spottbok.sett = {};
    t.spottbok.merker = [];
    t.spottbok.turer = [];
    t.spottbok.statistikk = structuredClone(STANDARD.spottbok.statistikk);
  });
}

/** Sletter alt. Koden forsvinner også, så appen er som nyinstallert. */
export function slettAlt() {
  nullstillAlt();
}

// ---------------------------------------------------------------- oversikt

export function hvaFinnes() {
  const t = les();
  return {
    spillere: t.spillere.length,
    aktivtSpill: !!t.aktivtSpill,
    turer: t.spottbok.turer.length,
    funn: Object.keys(t.spottbok.sett).length,
    merker: t.spottbok.merker.length,
    friFunn: Object.values(t.frimodus?.antall || {}).reduce((a, b) => a + b, 0),
  };
}
