// Lyd lages i nettleseren, så ingenting må lastes ned.
//
// Stemmen er ikke pynt: når appen sier «Lastebil!» høyt, hører hele bilen at
// noen krysset av. Det er det som gjør at et spotte-spill ikke kan jukses bort
// i stillhet — og det gjør at en som ikke kan lese kan være med.

let ctx = null;
let paa = true;
let stemmePaa = true;

export function settLyd(verdi) { paa = !!verdi; }
export function settStemme(verdi) { stemmePaa = !!verdi; }

function kontekst() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Må kalles fra en ekte trykk-hendelse første gang (iOS krever det). */
export function vekk() {
  kontekst();
  if (stemmePaa && 'speechSynthesis' in window) {
    // Tvinger iOS til å laste stemmene mens vi har et gyldig trykk.
    window.speechSynthesis.getVoices();
  }
}

function tone(frekvens, start, lengde, { type = 'sine', styrke = 0.16 } = {}) {
  const c = kontekst();
  if (!c || !paa) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(frekvens, c.currentTime + start);
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(styrke, c.currentTime + start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + lengde);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + lengde + 0.02);
}

function rekke(noter, { type = 'sine', styrke = 0.16, steg = 0.09 } = {}) {
  noter.forEach((f, i) => tone(f, i * steg, 0.22, { type, styrke }));
}

export const LYD = {
  kryss: () => rekke([660, 880], { steg: 0.06 }),
  krysSjelden: () => rekke([660, 880, 1175], { steg: 0.07, styrke: 0.2 }),
  krysLegendarisk: () => rekke([523, 659, 784, 1047, 1319], { steg: 0.075, styrke: 0.22 }),
  angre: () => rekke([440, 330], { steg: 0.06, styrke: 0.11 }),
  bingo: () => rekke([523, 659, 784, 1047, 784, 1047, 1319], { steg: 0.1, type: 'triangle', styrke: 0.2 }),
  fullPlate: () => rekke([523, 659, 784, 1047, 1319, 1568, 2093], { steg: 0.085, type: 'triangle', styrke: 0.2 }),
  merke: () => rekke([784, 988, 1319], { steg: 0.11, type: 'triangle', styrke: 0.18 }),
  stopp: () => rekke([392, 330], { steg: 0.1, type: 'sine', styrke: 0.13 }),
  tikk: () => tone(1000, 0, 0.05, { type: 'square', styrke: 0.05 }),
  feil: () => rekke([220, 185], { steg: 0.08, type: 'sawtooth', styrke: 0.09 }),
  nyttStopp: () => rekke([659, 784, 988, 1319], { steg: 0.1, type: 'triangle', styrke: 0.18 }),
};

/** Sier ordet høyt på norsk, slik at hele bilen hører det. */
export function si(tekst, { fart = 1, tonehoyde = 1.05 } = {}) {
  if (!stemmePaa || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(tekst);
    u.lang = 'nb-NO';
    u.rate = fart;
    u.pitch = tonehoyde;
    u.volume = 1;
    // iOS melder norsk som «no-NO», macOS som «nb-NO». Ta det som finnes.
    const stemmer = window.speechSynthesis.getVoices() || [];
    const norsk = stemmer.find((s) => /^(nb|no|nn)([-_]|$)/i.test(s.lang));
    if (norsk) u.voice = norsk;
    window.speechSynthesis.speak(u);
  } catch {
    /* stemme er en bonus, ikke et krav */
  }
}

export function stoppStemme() {
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch { /* ignorert */ }
  }
}

// Skjermen skal ikke sovne midt i en biltur.
let laas = null;
let onsketVaaken = false;

export async function holdSkjermenVaaken(skalVaere) {
  onsketVaaken = !!skalVaere;
  if (!('wakeLock' in navigator)) return;
  try {
    if (onsketVaaken && !laas) {
      laas = await navigator.wakeLock.request('screen');
      laas.addEventListener('release', () => { laas = null; });
    } else if (!onsketVaaken && laas) {
      await laas.release();
      laas = null;
    }
  } catch {
    /* nektet eller ikke støttet — ikke kritisk */
  }
}

// Låsen slippes når appen er skjult. Ta den igjen bare hvis vi faktisk ville ha den.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && onsketVaaken && !laas) holdSkjermenVaaken(true);
});
