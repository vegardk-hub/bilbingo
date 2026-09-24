// Alt lagres lokalt på enheten. Ingen konto, ingen server, ingen sporing.
// Hele appen skal virke i en tunnel på Dovre uten dekning.

const NOKKEL = 'bilbingo.v1';

export const STANDARD = {
  versjon: 1,
  spillere: [],
  spottbok: {
    sett: {}, // tingId -> { antall, forste, siste }
    merker: [],
    turer: [],
    statistikk: {
      bingoer: 0,
      fullePlater: 0,
      km: 0,
      ruterFullfort: 0,
      sesonger: [],
      harSpiltNatt: false,
      tunneler: 0,
      ferjer: 0,
      samarbeid: 0,
    },
  },
  innstillinger: {
    lyd: true,
    stemme: true,
    sted: 'overalt',
    sesongAuto: true,
    sesong: null,
    kategorier: null, // null = alle
    storSkrift: false,
    skjermPaa: true,
  },
  aktivtSpill: null,
};

function flett(standard, lagret) {
  if (!lagret || typeof lagret !== 'object') return structuredClone(standard);
  const ut = structuredClone(standard);
  for (const [k, v] of Object.entries(lagret)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && ut[k] && typeof ut[k] === 'object' && !Array.isArray(ut[k])) {
      ut[k] = flett(ut[k], v);
    } else if (v !== undefined) {
      ut[k] = v;
    }
  }
  return ut;
}

let bufret = null;

export function les() {
  if (bufret) return bufret;
  let raa = null;
  try {
    raa = JSON.parse(localStorage.getItem(NOKKEL) || 'null');
  } catch {
    raa = null;
  }
  bufret = flett(STANDARD, raa);
  return bufret;
}

let venter = null;
export function skriv(neste) {
  bufret = neste || bufret;
  // Samle flere endringer i én skriving — det er mye tapping i dette spillet.
  if (venter) return;
  venter = setTimeout(() => {
    venter = null;
    try {
      localStorage.setItem(NOKKEL, JSON.stringify(bufret));
    } catch {
      // Full disk eller privat modus. Spillet skal virke uansett, bare uten minne.
    }
  }, 120);
}

export function endre(fn) {
  const s = les();
  fn(s);
  skriv(s);
  return s;
}

export function nullstillAlt() {
  bufret = structuredClone(STANDARD);
  try {
    localStorage.removeItem(NOKKEL);
  } catch {
    /* ignorert */
  }
  return bufret;
}

/** Legg en ting inn i spottboka. Returnerer true hvis det var første gang. */
export function registrerFunn(tilstand, tingId) {
  const bok = tilstand.spottbok.sett;
  const na = new Date().toISOString();
  if (!bok[tingId]) {
    bok[tingId] = { antall: 1, forste: na, siste: na };
    return true;
  }
  bok[tingId].antall += 1;
  bok[tingId].siste = na;
  return false;
}
