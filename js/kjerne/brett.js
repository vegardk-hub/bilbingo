// Brettgenerering. To ting skal alltid stemme:
//  1) to spillere får aldri identiske brett (den vanligste klagen på appene
//     som finnes fra før — alle får samme brett og alle får bingo samtidig)
//  2) en 4-åring og en 9-åring skal bli ferdige omtrent samtidig, så de faktisk
//     kan spille mot hverandre uten at den minste alltid taper

import { TING, sesongNa, tidNa } from '../data/ting.js';
import { stokk } from './tilfeldig.js';

export const NIVAA = [
  {
    id: 1,
    navn: 'Småtass',
    alder: '3–5 år',
    hint: 'Store, enkle ting. Ingen lesing.',
    rader: 3,
    kolonner: 3,
    gratisMidt: true,
    maksAlder: 3,
    // Hvor mange felt av hver sjeldenhetsgrad brettet skal sikte mot (1..5).
    fordeling: [0.55, 0.45, 0, 0, 0],
  },
  {
    id: 2,
    navn: 'Speider',
    alder: '6–7 år',
    hint: 'Litt av hvert, med noen som må jaktes på.',
    rader: 4,
    kolonner: 4,
    gratisMidt: false,
    maksAlder: 5,
    fordeling: [0.2, 0.4, 0.3, 0.1, 0],
  },
  {
    id: 3,
    navn: 'Jeger',
    alder: '8–10 år',
    hint: 'Færre gratispoeng, flere sjeldenheter.',
    rader: 4,
    kolonner: 4,
    gratisMidt: false,
    maksAlder: 7,
    fordeling: [0.05, 0.25, 0.4, 0.25, 0.05],
  },
  {
    id: 4,
    navn: 'Ørneøye',
    alder: '11 år og oppover',
    hint: 'Stort brett og ting du må virkelig lete etter.',
    rader: 5,
    kolonner: 5,
    gratisMidt: true,
    maksAlder: 99,
    fordeling: [0, 0.16, 0.36, 0.36, 0.12],
  },
];

export const NIVAA_ETTER_ID = Object.fromEntries(NIVAA.map((n) => [n.id, n]));

export const STEDER = {
  overalt: 'Hvor som helst',
  kyst: 'Ved sjøen',
  fjell: 'På fjellet',
  by: 'I byen',
  bygd: 'På landet',
};

// Filtrerer hele katalogen ned til det som faktisk kan sees akkurat nå.
export function lagPool({
  sesong = sesongNa(),
  tid = tidNa(),
  sted = 'overalt',
  kategorier = null,
  taMedSesongTing = true,
} = {}) {
  return TING.filter((t) => {
    if (kategorier && !kategorier.includes(t.kat)) return false;
    if (t.sesong && taMedSesongTing && !t.sesong.includes(sesong)) return false;
    if (t.tid && t.tid !== tid) return false;
    if (t.sted && sted !== 'overalt' && !t.sted.includes(sted)) return false;
    // Ting som bare finnes på ett sted tas med når man ikke har valgt sted,
    // men de er sjeldnere verdt — de får et hakk opp i sjeldenhet.
    return true;
  });
}

// Gjør om fordelingen til et konkret antall felt per sjeldenhetsgrad.
function kvoter(fordeling, antall) {
  const raa = fordeling.map((f) => f * antall);
  const ut = raa.map(Math.floor);
  let rest = antall - ut.reduce((a, b) => a + b, 0);
  // Del ut resten til de gradene som tapte mest på avrundingen.
  const rekke = raa
    .map((v, i) => ({ i, brok: v - Math.floor(v) }))
    .sort((a, b) => b.brok - a.brok);
  let k = 0;
  while (rest > 0) {
    ut[rekke[k % rekke.length].i] += 1;
    rest -= 1;
    k += 1;
  }
  return ut;
}

/**
 * Lager ett brett.
 * @param nivaaId   hvilket nivå spilleren står på
 * @param pool      ting som kan sees nå (fra lagPool)
 * @param rng       frø-styrt tilfeldighetsfunksjon
 * @param unngaa    id-er som helst ikke skal gå igjen fra andre spilleres brett
 */
export function lagBrett({ nivaaId = 2, pool, rng, unngaa = new Set() }) {
  const nivaa = NIVAA_ETTER_ID[nivaaId] || NIVAA_ETTER_ID[2];
  const { rader, kolonner, gratisMidt } = nivaa;
  const antallFelt = rader * kolonner;
  const trengs = gratisMidt && rader % 2 === 1 && kolonner % 2 === 1 ? antallFelt - 1 : antallFelt;

  // Del poolen etter sjeldenhet, med de som allerede er i bruk bakerst
  // slik at brettene overlapper minst mulig uten at det blir umulig.
  const etterGrad = [1, 2, 3, 4, 5].map((g) => {
    const alle = stokk(pool.filter((t) => t.sjelden === g), rng);
    return [...alle.filter((t) => !unngaa.has(t.id)), ...alle.filter((t) => unngaa.has(t.id))];
  });

  const onsket = kvoter(nivaa.fordeling, trengs);
  const valgt = [];
  const brukt = new Set();

  // Første runde: ta det kvoten ber om.
  onsket.forEach((antall, i) => {
    for (const t of etterGrad[i]) {
      if (valgt.filter((v) => v.sjelden === i + 1).length >= antall) break;
      if (brukt.has(t.id)) continue;
      valgt.push(t);
      brukt.add(t.id);
    }
  });

  // Andre runde: fyll opp fra nærmeste grad hvis en kvote ikke lot seg dekke.
  if (valgt.length < trengs) {
    const rest = stokk(
      pool.filter((t) => !brukt.has(t.id)),
      rng,
    ).sort((a, b) => {
      const mid = nivaa.fordeling.findIndex((f) => f > 0) + 1;
      return Math.abs(a.sjelden - mid) - Math.abs(b.sjelden - mid);
    });
    for (const t of rest) {
      if (valgt.length >= trengs) break;
      valgt.push(t);
      brukt.add(t.id);
    }
  }

  const felt = stokk(valgt.slice(0, trengs), rng).map((t) => ({ tingId: t.id, gratis: false }));

  if (trengs !== antallFelt) {
    const midt = Math.floor(antallFelt / 2);
    felt.splice(midt, 0, { tingId: null, gratis: true });
  }

  return { nivaaId: nivaa.id, rader, kolonner, felt };
}

/** Lager ett brett per spiller, garantert forskjellige. */
export function lagBrettSett({ spillere, pool, rng }) {
  const brukt = new Set();
  const ut = [];
  for (const s of spillere) {
    const brett = lagBrett({ nivaaId: s.nivaaId, pool, rng, unngaa: brukt });
    brett.felt.forEach((f) => f.tingId && brukt.add(f.tingId));
    ut.push(brett);
  }
  return ut;
}

/** Alle linjer (rader, kolonner, diagonaler) som indekser inn i felt-lista. */
export function linjer(rader, kolonner) {
  const ut = [];
  for (let r = 0; r < rader; r += 1) {
    ut.push({ type: 'rad', felt: Array.from({ length: kolonner }, (_, k) => r * kolonner + k) });
  }
  for (let k = 0; k < kolonner; k += 1) {
    ut.push({ type: 'kolonne', felt: Array.from({ length: rader }, (_, r) => r * kolonner + k) });
  }
  if (rader === kolonner) {
    ut.push({ type: 'diagonal', felt: Array.from({ length: rader }, (_, i) => i * kolonner + i) });
    ut.push({
      type: 'diagonal',
      felt: Array.from({ length: rader }, (_, i) => i * kolonner + (kolonner - 1 - i)),
    });
  }
  return ut;
}

/** Hvilke linjer er ferdige, og er hele brettet fullt? */
export function finnBingo(brett, merket) {
  const alle = linjer(brett.rader, brett.kolonner);
  const erMerket = (i) => brett.felt[i].gratis || merket.includes(brett.felt[i].tingId);
  const fulle = alle.filter((l) => l.felt.every(erMerket));
  const fulltBrett = brett.felt.every((f, i) => erMerket(i));
  return { linjer: fulle, feltIBingo: new Set(fulle.flatMap((l) => l.felt)), fulltBrett };
}

/** Hvor nær er spilleren? Brukes til fremdriftslinja og til utjevning. */
export function fremdrift(brett, merket) {
  const alle = linjer(brett.rader, brett.kolonner);
  const erMerket = (i) => brett.felt[i].gratis || merket.includes(brett.felt[i].tingId);
  const beste = alle.reduce((m, l) => Math.max(m, l.felt.filter(erMerket).length / l.felt.length), 0);
  const krysset = brett.felt.filter((f, i) => erMerket(i)).length;
  return { besteLinje: beste, krysset, total: brett.felt.length };
}
