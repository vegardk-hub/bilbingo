// Frimodus — hele spottboka som spillebrett.
//
// Forskjellen fra et bingobrett: ingenting er valgt ut på forhånd. Ser dere
// noe, krysser dere av, uansett hva det er. Og ser dere det igjen om en time,
// krysser dere av igjen — tellingen bare fortsetter.
//
// Derfor trengs sperren: uten den ville en femåring trykket «rød bil» tjue
// ganger på rad. Tretti sekunder per ting, felles for alle i bilen, gjør at
// et nytt trykk faktisk krever en ny bil.
//
// Alt her lever videre mellom turer. Går dere inn i frimodus neste helg,
// ligger tallene der dere forlot dem.

import { TING_ETTER_ID, POENG } from '../data/ting.js';
import { nyeMerker } from '../data/merker.js';
import { les, endre, registrerFunn } from './lager.js';
import { statistikkFor } from './spill.js';

/** Hvor lenge det er sperret for å registrere samme ting på nytt. */
export const SPERRE_MS = 30000;

export function hentFrimodus() {
  return les().frimodus;
}

export function erIGang() {
  const f = hentFrimodus();
  return !!(f && f.startet && f.deltakere.length);
}

/**
 * Starter eller gjenopptar frimodus. Tallene nullstilles aldri her — det er
 * hele poenget at de huskes. Bare deltakerlista settes på nytt, slik at man
 * kan ta med søskenbarnet på én tur uten å miste noe.
 */
export function startFrimodus(spillere) {
  return endre((t) => {
    const f = t.frimodus;
    const gamle = Object.fromEntries((f.deltakere || []).map((d) => [d.spillerId, d]));
    f.startet = f.startet || new Date().toISOString();
    f.deltakere = spillere.map((s) => ({
      spillerId: s.id,
      navn: s.navn,
      farge: s.farge,
      poeng: gamle[s.id]?.poeng || 0,
      funn: gamle[s.id]?.funn || 0,
    }));
  }).frimodus;
}

/** Hvor mange sekunder til tingen kan registreres igjen? 0 = klar nå. */
export function sperreIgjen(tingId, na = Date.now()) {
  const f = hentFrimodus();
  const sist = f.sistFunn?.[tingId];
  if (!sist) return 0;
  return Math.max(0, Math.ceil((SPERRE_MS - (na - sist)) / 1000));
}

export function antallAv(tingId) {
  return hentFrimodus().antall?.[tingId] || 0;
}

/**
 * Registrerer et funn. Returnerer null hvis tingen fortsatt er sperret, slik
 * at skjermen kan si fra i stedet for å telle i stillhet.
 */
export function registrer(tingId, spillerId) {
  const ting = TING_ETTER_ID[tingId];
  if (!ting) return null;
  const igjen = sperreIgjen(tingId);
  if (igjen > 0) return { sperret: true, sekunder: igjen, ting };

  const poeng = POENG[ting.sjelden];
  const na = Date.now();
  const resultat = { sperret: false, ting, poeng, antall: 0, forsteGang: false, nyeMerker: [] };

  endre((t) => {
    const f = t.frimodus;
    f.antall[tingId] = (f.antall[tingId] || 0) + 1;
    f.sistFunn[tingId] = na;
    f.sisteAv[tingId] = spillerId;
    f.logg.push({ tingId, spillerId, tid: na });
    // Logg brukes bare til «nylig funnet» og pausespillet — den trenger ikke
    // vokse i det uendelige.
    if (f.logg.length > 300) f.logg = f.logg.slice(-300);

    const d = f.deltakere.find((x) => x.spillerId === spillerId);
    if (d) { d.poeng += poeng; d.funn += 1; }

    resultat.antall = f.antall[tingId];
    resultat.forsteGang = registrerFunn(t, tingId);

    const st = t.spottbok.statistikk;
    st.km += poeng;
    st.friFunn = (st.friFunn || 0) + 1;
    if (ting.sjelden === 4) st.sjeldne = (st.sjeldne || 0) + 1;
    if (ting.sjelden === 5) st.legendariske = (st.legendariske || 0) + 1;
    if (!st.sesonger.includes(gjeldendeSesong(t))) st.sesonger.push(gjeldendeSesong(t));

    resultat.nyeMerker = nyeMerker(statistikkFor(t), t.spottbok.merker);
    t.spottbok.merker.push(...resultat.nyeMerker);
  });

  return resultat;
}

function gjeldendeSesong(t) {
  const i = t.innstillinger;
  if (!i.sesongAuto && i.sesong) return i.sesong;
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'var';
  if (m >= 6 && m <= 8) return 'sommer';
  if (m >= 9 && m <= 10) return 'host';
  return 'vinter';
}

/** Angrer siste registrering. Løser feiltrykk uten å måtte nullstille alt. */
export function angreSiste() {
  const f = hentFrimodus();
  const siste = f.logg[f.logg.length - 1];
  if (!siste) return null;
  const ting = TING_ETTER_ID[siste.tingId];
  if (!ting) return null;
  const poeng = POENG[ting.sjelden];

  endre((t) => {
    const fm = t.frimodus;
    fm.logg.pop();
    fm.antall[siste.tingId] = Math.max(0, (fm.antall[siste.tingId] || 1) - 1);
    if (!fm.antall[siste.tingId]) delete fm.antall[siste.tingId];
    // Sperren fjernes også, ellers står tingen låst i tretti sekunder etter
    // et trykk som aldri skulle skjedd.
    delete fm.sistFunn[siste.tingId];
    const forrige = [...fm.logg].reverse().find((l) => l.tingId === siste.tingId);
    if (forrige) fm.sisteAv[siste.tingId] = forrige.spillerId;
    else delete fm.sisteAv[siste.tingId];

    const d = fm.deltakere.find((x) => x.spillerId === siste.spillerId);
    if (d) { d.poeng = Math.max(0, d.poeng - poeng); d.funn = Math.max(0, d.funn - 1); }

    const st = t.spottbok.statistikk;
    st.km = Math.max(0, st.km - poeng);
    st.friFunn = Math.max(0, (st.friFunn || 1) - 1);
    const bok = t.spottbok.sett[siste.tingId];
    if (bok) {
      bok.antall -= 1;
      if (bok.antall <= 0) delete t.spottbok.sett[siste.tingId];
    }
  });

  return { ting, spillerId: siste.spillerId };
}

export function oppsummering() {
  const f = hentFrimodus();
  const ider = Object.keys(f.antall || {});
  const totalt = ider.reduce((n, id) => n + f.antall[id], 0);
  const poeng = ider.reduce((n, id) => n + (POENG[TING_ETTER_ID[id]?.sjelden] || 0) * f.antall[id], 0);
  return { ulike: ider.length, totalt, poeng };
}

/** Nullstiller tellingen i frimodus. Spottboka og merkene røres ikke. */
export function nullstillFrimodus() {
  endre((t) => {
    t.frimodus.antall = {};
    t.frimodus.sistFunn = {};
    t.frimodus.sisteAv = {};
    t.frimodus.logg = [];
    t.frimodus.startet = new Date().toISOString();
    t.frimodus.deltakere.forEach((d) => { d.poeng = 0; d.funn = 0; });
  });
}
