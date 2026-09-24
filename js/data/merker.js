// Merker — det lange laget. Disse henger igjen på tvers av turer, og er
// grunnen til at tur nummer tolv fortsatt har noe å strekke seg etter.
//
// Bevisst valg: ingen daglig streak og ingenting som forsvinner hvis man ikke
// spiller. Et merke man har tatt, beholder man. Ingenting her skal gi dårlig
// samvittighet for å ha latt appen ligge.

import { TING } from './ting.js';

const antallIKat = (kat) => TING.filter((t) => t.kat === kat).length;

export const MERKER = [
  // --- de første stegene
  { id: 'forste-bingo', navn: 'Første bingo', tekst: 'Fullfør din første rekke.', ikon: 'flagg', test: (s) => s.bingoer >= 1 },
  { id: 'ti-bingo', navn: 'Ti på rad', tekst: 'Ta bingo ti ganger.', ikon: 'stjerner', test: (s) => s.bingoer >= 10 },
  { id: 'femti-bingo', navn: 'Femti bingo', tekst: 'Ta bingo femti ganger.', ikon: 'sol', test: (s) => s.bingoer >= 50 },
  { id: 'full-plate', navn: 'Full plate', tekst: 'Kryss av hele brettet i ett spill.', ikon: 'gangfelt', test: (s) => s.fullePlater >= 1 },

  // --- de klassiske jaktene
  { id: 'gul-bil', navn: 'GUL BIL!', tekst: 'Finn en gul bil.', ikon: 'bilGul', test: (s) => s.sett.includes('gul-bil') },
  { id: 'elgen', navn: 'Elgen', tekst: 'Se en ekte elg fra bilen.', ikon: 'elg', test: (s) => s.sett.includes('elg') },
  { id: 'toget', navn: 'Toget', tekst: 'Se et tog mens dere kjører.', ikon: 'tog', test: (s) => s.sett.includes('tog') },
  { id: 'regnbuen', navn: 'Regnbuen', tekst: 'Se en regnbue.', ikon: 'regnbue', test: (s) => s.sett.includes('regnbue') },
  { id: 'blalys', navn: 'Blålys', tekst: 'Se en utrykning med blålys.', ikon: 'blalys', test: (s) => s.sett.includes('blalys') },
  { id: 'helikopteret', navn: 'Helikopteret', tekst: 'Se et helikopter.', ikon: 'helikopter', test: (s) => s.sett.includes('helikopter') },

  // --- samlingen
  { id: 'samler-25', navn: 'Samler', tekst: 'Se 25 forskjellige ting.', ikon: 'postkasser', test: (s) => s.sett.length >= 25 },
  { id: 'samler-75', navn: 'Storsamler', tekst: 'Se 75 forskjellige ting.', ikon: 'butikk', test: (s) => s.sett.length >= 75 },
  { id: 'samler-150', navn: 'Mestersamler', tekst: 'Se 150 forskjellige ting.', ikon: 'kran', test: (s) => s.sett.length >= 150 },
  {
    id: 'alt',
    navn: 'Hele spottboka',
    tekst: `Se alle ${TING.length} tingene. Dette tar mange turer.`,
    ikon: 'fyrtaarn',
    test: (s) => s.sett.length >= TING.length,
  },

  // --- fullfør en kategori
  {
    id: 'alle-dyr', navn: 'Dyrepasser', tekst: `Se alle ${antallIKat('dyr')} dyrene.`, ikon: 'sau',
    test: (s) => TING.filter((t) => t.kat === 'dyr').every((t) => s.sett.includes(t.id)),
  },
  {
    id: 'alle-skilt', navn: 'Skiltleser', tekst: `Se alle ${antallIKat('skilt')} skiltene.`, ikon: 'fart80',
    test: (s) => TING.filter((t) => t.kat === 'skilt').every((t) => s.sett.includes(t.id)),
  },
  {
    id: 'alle-kjoretoy', navn: 'Bilkjenner', tekst: `Se alle ${antallIKat('kjoretoy')} kjøretøyene.`, ikon: 'lastebil',
    test: (s) => TING.filter((t) => t.kat === 'kjoretoy').every((t) => s.sett.includes(t.id)),
  },
  {
    id: 'alle-fartsgrenser', navn: 'Fra 30 til 110', tekst: 'Se alle ni fartsgrense-skiltene.', ikon: 'fart110',
    test: (s) => ['30', '40', '50', '60', '70', '80', '90', '100', '110'].every((n) => s.sett.includes(`fart-${n}`)),
  },

  // --- sjeldenhet
  { id: 'fem-sjeldne', navn: 'Skarpt blikk', tekst: 'Finn fem sjeldne ting.', ikon: 'speilSving', test: (s) => s.sjeldne >= 5 },
  { id: 'tre-legendariske', navn: 'Legenden', tekst: 'Finn tre legendariske ting.', ikon: 'stavkirke', test: (s) => s.legendariske >= 3 },

  // --- turen
  { id: 'km-100', navn: 'Hundre kilometer', tekst: 'Kjør 100 km i spillet.', ikon: 'kmStolpe', test: (s) => s.km >= 100 },
  { id: 'km-500', navn: 'Langtur', tekst: 'Kjør 500 km i spillet.', ikon: 'motorveiSkilt', test: (s) => s.km >= 500 },
  { id: 'km-2600', navn: 'Nordkapp', tekst: 'Kjør 2 600 km — hele Norge.', ikon: 'fjell', test: (s) => s.km >= 2600 },
  { id: 'rute-ferdig', navn: 'Framme', tekst: 'Kjør en hel rute i mål.', ikon: 'flagg', test: (s) => s.ruterFullfort >= 1 },

  // --- når og hvor
  { id: 'alle-sesonger', navn: 'Året rundt', tekst: 'Spill i alle fire årstider.', ikon: 'hostfarger', test: (s) => s.sesonger.length >= 4 },
  { id: 'natteravn', navn: 'Natteravn', tekst: 'Spill etter at det er blitt mørkt.', ikon: 'stjerner', test: (s) => s.harSpiltNatt },
  { id: 'tunnelmester', navn: 'Tunnelmester', tekst: 'Spill tunnelspillet fem ganger.', ikon: 'tunnel', test: (s) => s.tunneler >= 5 },
  { id: 'ferjemester', navn: 'Om bord', tekst: 'Spill fergespillet tre ganger.', ikon: 'ferje', test: (s) => s.ferjer >= 3 },

  // --- sammen
  { id: 'lagspill', navn: 'Sammen', tekst: 'Fullfør et brett i Sammen-modus.', ikon: 'vinker', test: (s) => s.samarbeid >= 1 },
  { id: 'lagspill-10', navn: 'Godt lag', tekst: 'Fullfør ti brett i Sammen-modus.', ikon: 'rasteplass', test: (s) => s.samarbeid >= 10 },
];

export const MERKE_ETTER_ID = Object.fromEntries(MERKER.map((m) => [m.id, m]));

/** Returnerer id-ene til merker som nettopp ble oppnådd. */
export function nyeMerker(statistikk, alleredeTatt = []) {
  const tatt = new Set(alleredeTatt);
  return MERKER.filter((m) => !tatt.has(m.id) && m.test(statistikk)).map((m) => m.id);
}
