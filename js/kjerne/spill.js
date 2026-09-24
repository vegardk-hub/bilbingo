// Spilltilstanden. Ett aktivt spill om gangen, lagret etter hvert trykk slik at
// en biltur tåler at iPaden går tom for strøm eller at noen lukker appen.

import { TING_ETTER_ID, POENG, sesongNa, tidNa } from '../data/ting.js';
import { RUTE_ETTER_ID, posisjon } from '../data/ruter.js';
import { nyeMerker } from '../data/merker.js';
import { lagPool, lagBrettSett, lagBrett, finnBingo, fremdrift, NIVAA_ETTER_ID } from './brett.js';
import { lagRng, lagKode, gyldigKode } from './tilfeldig.js';
import { les, endre, registrerFunn } from './lager.js';

export const FARGER = [
  { id: 'rod', navn: 'Rød', hex: '#E63946' },
  { id: 'bla', navn: 'Blå', hex: '#2E86DE' },
  { id: 'gronn', navn: 'Grønn', hex: '#1B9C5B' },
  { id: 'lilla', navn: 'Lilla', hex: '#8E44C9' },
  { id: 'oransje', navn: 'Oransje', hex: '#E8710A' },
  { id: 'turkis', navn: 'Turkis', hex: '#0FA3A3' },
];

export const MODUS = {
  sammen: {
    id: 'sammen',
    navn: 'Sammen',
    kort: 'Ett brett. Alle hjelper til.',
    lang: 'Alle ser på det samme brettet og fyller det sammen. Hver ting får fargen til den som fant den, så alle ser hva de bidro med — men ingen taper.',
  },
  mot: {
    id: 'mot',
    navn: 'Mot hverandre',
    kort: 'Hvert sitt brett. Først til bingo.',
    lang: 'Alle får sitt eget brett, tilpasset alderen sin. Den som ligger bakerst får et gratisfelt nå og da, så ingen henger håpløst etter.',
  },
  fri: {
    id: 'fri',
    navn: 'Frimodus',
    kort: 'Ingen brett. Hele spottboka.',
    lang: 'Ingenting er valgt ut på forhånd — alle 202 tingene er i spill, og ser dere den samme tingen flere ganger teller alle. Tallene huskes til neste tur.',
  },
};

function naa() { return Date.now(); }

/** Starter et nytt spill. Kode kan gjenbrukes fra en annen enhet i samme bil. */
export function nyttSpill({ modus = 'sammen', spillere, ruteId = 'hytta', kode = null }) {
  const t = les();
  const i = t.innstillinger;
  const sesong = i.sesongAuto ? sesongNa() : i.sesong || sesongNa();
  const tid = tidNa();
  const k = gyldigKode(kode) || lagKode();
  const pool = lagPool({ sesong, tid, sted: i.sted, kategorier: i.kategorier });

  const deltakere = spillere.map((s, n) => ({
    spillerId: s.id,
    navn: s.navn,
    farge: s.farge,
    nivaaId: s.nivaaId,
    plass: n,
    poeng: 0,
    funn: 0,
    bingoer: 0,
  }));

  const spill = {
    kode: k,
    modus,
    ruteId,
    sesong,
    tid,
    startet: naa(),
    runde: 1,
    poeng: 0,
    km: 0,
    deltakere,
    brett: [],
    merket: [],
    merketAv: {},
    siste: null, // { tingId, spillerId, brettNr, tid } — til angre-knappen
    logg: [],
    pause: null, // 'tunnel' | 'ferje' | null
  };

  byggBrett(spill, pool, k);
  endre((s) => { s.aktivtSpill = spill; });
  return spill;
}

function byggBrett(spill, pool, fro) {
  // Frøet inneholder runden, så neste brett i samme spill blir et nytt brett —
  // men fortsatt likt på to enheter med samme kode.
  const rng = lagRng(`${fro}|${spill.runde}`);
  if (spill.modus === 'sammen') {
    // Ett felles brett. Nivået settes av den eldste, så det blir noe å strekke
    // seg etter for alle — de minste får hjelp av de store, det er hele poenget.
    const nivaaId = Math.max(...spill.deltakere.map((d) => d.nivaaId));
    spill.brett = [lagBrett({ nivaaId, pool, rng })];
    spill.merket = [[]];
  } else {
    spill.brett = lagBrettSett({ spillere: spill.deltakere, pool, rng });
    spill.merket = spill.brett.map(() => []);
  }
  spill.merketAv = {};
  spill.siste = null;
}

export function hentPool(spill) {
  const i = les().innstillinger;
  return lagPool({ sesong: spill.sesong, tid: spill.tid, sted: i.sted, kategorier: i.kategorier });
}

/** Hvilket brett hører en deltaker til? I Sammen-modus er det alltid brett 0. */
export function brettFor(spill, plass) {
  return spill.modus === 'sammen' ? 0 : plass;
}

export function erMerket(spill, brettNr, tingId) {
  return spill.merket[brettNr].includes(tingId);
}

/**
 * Krysser av en ting. Returnerer hva som skjedde, slik at skjermen kan
 * feire riktig og lyden kan si riktig ord.
 */
export function kryssAv(spill, { brettNr, tingId, spillerId }) {
  if (!tingId || erMerket(spill, brettNr, tingId)) return null;
  const ting = TING_ETTER_ID[tingId];
  if (!ting) return null;

  spill.merket[brettNr].push(tingId);
  if (spill.modus === 'sammen') spill.merketAv[tingId] = spillerId;

  const poeng = POENG[ting.sjelden];
  const d = spill.deltakere.find((x) => x.spillerId === spillerId);
  if (d) { d.poeng += poeng; d.funn += 1; }
  spill.poeng += poeng;
  spill.km += poeng;
  spill.siste = { tingId, spillerId, brettNr, tid: naa() };
  spill.logg.push({ tingId, spillerId, tid: naa() });

  const brett = spill.brett[brettNr];
  const forrigeBingo = spill._bingoTalt?.[brettNr] || 0;
  const bingo = finnBingo(brett, spill.merket[brettNr]);
  const nyeLinjer = bingo.linjer.length - forrigeBingo;
  spill._bingoTalt = spill._bingoTalt || {};
  spill._bingoTalt[brettNr] = bingo.linjer.length;

  const rute = RUTE_ETTER_ID[spill.ruteId];
  const forrigeStopp = posisjon(rute, spill.km - poeng);
  const nyStopp = posisjon(rute, spill.km);
  const naddeStopp = nyStopp.antallNadd > forrigeStopp.antallNadd ? nyStopp.forrige : null;

  const resultat = {
    ting,
    poeng,
    brettNr,
    forsteGang: false,
    nyeLinjer: Math.max(0, nyeLinjer),
    linjerTotalt: bingo.linjer.length,
    fulltBrett: bingo.fulltBrett,
    naddeStopp,
    ruteFerdig: nyStopp.ferdig && !forrigeStopp.ferdig,
    nyeMerker: [],
  };

  endre((t) => {
    resultat.forsteGang = registrerFunn(t, tingId);
    const st = t.spottbok.statistikk;
    st.km += poeng;
    if (ting.sjelden === 4) st.sjeldne = (st.sjeldne || 0) + 1;
    if (ting.sjelden === 5) st.legendariske = (st.legendariske || 0) + 1;
    if (resultat.nyeLinjer > 0) st.bingoer += resultat.nyeLinjer;
    if (resultat.fulltBrett) st.fullePlater += 1;
    if (resultat.fulltBrett && spill.modus === 'sammen') st.samarbeid += 1;
    if (resultat.ruteFerdig) st.ruterFullfort += 1;
    if (!st.sesonger.includes(spill.sesong)) st.sesonger.push(spill.sesong);
    if (spill.tid === 'natt') st.harSpiltNatt = true;
    resultat.nyeMerker = nyeMerker(statistikkFor(t), t.spottbok.merker);
    t.spottbok.merker.push(...resultat.nyeMerker);
    t.aktivtSpill = spill;
  });

  return resultat;
}

/** Angrer siste avkryssing. Løser feiltrykk, som er vanlig med små fingre. */
export function angre(spill) {
  const s = spill.siste;
  if (!s) return null;
  const liste = spill.merket[s.brettNr];
  const i = liste.lastIndexOf(s.tingId);
  if (i === -1) return null;
  liste.splice(i, 1);
  delete spill.merketAv[s.tingId];

  const ting = TING_ETTER_ID[s.tingId];
  const poeng = POENG[ting.sjelden];
  const d = spill.deltakere.find((x) => x.spillerId === s.spillerId);
  if (d) { d.poeng -= poeng; d.funn -= 1; }
  spill.poeng -= poeng;
  spill.km = Math.max(0, spill.km - poeng);
  spill.logg.pop();
  spill.siste = null;
  if (spill._bingoTalt) {
    spill._bingoTalt[s.brettNr] = finnBingo(spill.brett[s.brettNr], liste).linjer.length;
  }

  endre((t) => {
    const bok = t.spottbok.sett[s.tingId];
    if (bok) {
      bok.antall -= 1;
      if (bok.antall <= 0) delete t.spottbok.sett[s.tingId];
    }
    t.spottbok.statistikk.km = Math.max(0, t.spottbok.statistikk.km - poeng);
    t.aktivtSpill = spill;
  });
  return { ting };
}

/** Nytt brett, samme tur. Dette er det som gjør at spillet varer i timevis. */
export function nesteRunde(spill) {
  spill.runde += 1;
  byggBrett(spill, hentPool(spill), spill.kode);
  spill._bingoTalt = {};
  endre((t) => { t.aktivtSpill = spill; });
  return spill;
}

/**
 * Utjevning: den som ligger bakerst kan få et gratisfelt.
 * Uten dette gir den minste opp etter tredje tap på rad.
 */
export function kanFaaHjelp(spill) {
  if (spill.modus !== 'mot' || spill.deltakere.length < 2) return null;
  const stilling = spill.deltakere.map((d) => {
    const b = brettFor(spill, d.plass);
    return { d, ...fremdrift(spill.brett[b], spill.merket[b]) };
  });
  const best = Math.max(...stilling.map((s) => s.krysset / s.total));
  const bak = stilling.filter((s) => best - s.krysset / s.total >= 0.3);
  if (!bak.length) return null;
  const svakest = bak.sort((a, b) => a.krysset / a.total - b.krysset / b.total)[0];
  const brettNr = brettFor(spill, svakest.d.plass);
  const igjen = spill.brett[brettNr].felt
    .filter((f) => f.tingId && !spill.merket[brettNr].includes(f.tingId))
    .map((f) => f.tingId);
  if (!igjen.length) return null;
  return { deltaker: svakest.d, brettNr, forslag: igjen };
}

export function girHjelp(spill, { brettNr, tingId, spillerId }) {
  const r = kryssAv(spill, { brettNr, tingId, spillerId });
  if (r) r.varHjelp = true;
  return r;
}

export function stilling(spill) {
  return spill.deltakere
    .map((d) => {
      const b = brettFor(spill, d.plass);
      return { ...d, ...fremdrift(spill.brett[b], spill.merket[b]) };
    })
    .sort((a, b) => b.poeng - a.poeng);
}

export function avsluttSpill(spill) {
  endre((t) => {
    t.spottbok.turer.push({
      dato: new Date().toISOString(),
      rute: spill.ruteId,
      km: Math.round(spill.km),
      poeng: spill.poeng,
      runder: spill.runde,
      modus: spill.modus,
      deltakere: spill.deltakere.map((d) => ({ navn: d.navn, poeng: d.poeng })),
    });
    t.aktivtSpill = null;
  });
}

/** Samler statistikken i den formen merkene spør etter. */
export function statistikkFor(tilstand = les()) {
  const st = tilstand.spottbok.statistikk;
  return {
    ...st,
    sjeldne: st.sjeldne || 0,
    legendariske: st.legendariske || 0,
    friFunn: st.friFunn || 0,
    friUlike: Object.keys(tilstand.frimodus?.antall || {}).length,
    sett: Object.keys(tilstand.spottbok.sett),
  };
}

export function hentAktivt() {
  const s = les().aktivtSpill;
  if (!s || !s.brett || !s.brett.length) return null;
  return s;
}

export { finnBingo, fremdrift, posisjon, NIVAA_ETTER_ID };
