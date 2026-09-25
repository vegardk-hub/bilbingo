// Oppstart og navigering. Appen er én side; skjermene bytter ut innholdet.

import { les, endre } from './kjerne/lager.js';
import { settLyd, settStemme, holdSkjermenVaaken, vekk, stoppStemme } from './kjerne/lyd.js';
import { tomFor } from './kjerne/ui.js';

const rot = document.getElementById('app');
const skjermer = new Map();
let naavaerende = null;

export function registrer(navn, tegn) {
  skjermer.set(navn, tegn);
}

export function gaaTil(navn, data = {}) {
  const tegn = skjermer.get(navn);
  if (!tegn) throw new Error(`Ukjent skjerm: ${navn}`);
  stoppStemme();
  naavaerende = { navn, data };
  history.replaceState({ navn }, '', `#${navn}`);
  tomFor(rot).append(tegn(data));
  rot.scrollTop = 0;
  document.querySelector('.innhold')?.scrollTo(0, 0);
}

export function tegnPaaNytt() {
  if (naavaerende) gaaTil(naavaerende.navn, naavaerende.data);
}

export function naaSkjerm() { return naavaerende?.navn; }

/** Speiler innstillinger ut i resten av appen. */
export function bruktInnstillinger() {
  const i = les().innstillinger;
  settLyd(i.lyd);
  settStemme(i.stemme);
  holdSkjermenVaaken(!!i.skjermPaa);
  document.documentElement.dataset.skrift = i.storSkrift ? 'stor' : 'normal';
  if (i.tema && i.tema !== 'auto') document.documentElement.dataset.tema = i.tema;
  else delete document.documentElement.dataset.tema;
}

export function settInnstilling(nokkel, verdi) {
  endre((t) => { t.innstillinger[nokkel] = verdi; });
  bruktInnstillinger();
}

async function start() {
  // Skjermene lastes etter at oppsettet er lest, så første bilde kommer raskt.
  const [start, oppsett, spill, frimodus, pause, spottbok, innstillinger, foreldre] = await Promise.all([
    import('./skjerm/start.js'),
    import('./skjerm/oppsett.js'),
    import('./skjerm/spill.js'),
    import('./skjerm/frimodus.js'),
    import('./skjerm/pause.js'),
    import('./skjerm/spottbok.js'),
    import('./skjerm/innstillinger.js'),
    import('./skjerm/foreldre.js'),
  ]);
  registrer('start', start.tegn);
  registrer('oppsett', oppsett.tegn);
  registrer('spill', spill.tegn);
  registrer('frimodus', frimodus.tegn);
  registrer('pause', pause.tegn);
  registrer('spottbok', spottbok.tegn);
  registrer('innstillinger', innstillinger.tegn);
  registrer('foreldre', foreldre.tegn);

  bruktInnstillinger();
  gaaTil('start');
  document.body.classList.add('klar');

  // Første trykk hvor som helst låser opp lyd og stemme på iOS.
  const laasOpp = () => { vekk(); document.removeEventListener('pointerdown', laasOpp); };
  document.addEventListener('pointerdown', laasOpp, { once: true });

  // Bare over https. Utviklingsserveren kjorer http, og da avviser nettleseren
  // registreringen med en feil i konsollen som ikke betyr noe.
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

start();
