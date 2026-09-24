// Pause — for tunneler og ferjer.
//
// Norge har over 1 200 veitunneler, og Lærdalstunnelen alene tar tjue minutter.
// I en tunnel er det ingenting å se ut av vinduet, og et spotte-spill stopper
// helt opp. Det er derfor denne skjermen finnes: noe å gjøre mens utsikten er
// borte, uten at noen mister noe av brettet sitt.

import { h, knapp, ikon, symbol, tom } from '../kjerne/ui.js';
import { endre } from '../kjerne/lager.js';
import { SPORSMAL, NIVAA_NAVN } from '../data/quiz.js';
import { TING, TING_ETTER_ID } from '../data/ting.js';
import { hentAktivt } from '../kjerne/spill.js';
import { LYD, si } from '../kjerne/lyd.js';
import { gaaTil } from '../app.js';

let brukteSporsmal = new Set();

function stokk(liste) {
  const ut = liste.slice();
  for (let i = ut.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [ut[i], ut[j]] = [ut[j], ut[i]];
  }
  return ut;
}

// ------------------------------------------------------------------ gjett tiden

function gjettTiden(spill, tilbake) {
  const deltakere = spill?.deltakere?.length ? spill.deltakere : [{ navn: 'Alle', spillerId: 'alle' }];
  const gjett = new Map();
  let start = null;
  let ticker = null;

  const boks = h('div.innhold');

  function visInnlegging() {
    boks.replaceChildren(
      h('div.kort', {},
        h('h2', 'Hvor lenge varer tunnelen?'),
        h('p.svak', { style: { marginTop: '6px' } },
          'Alle gjetter antall sekunder. Så starter dere klokka når dere kjører inn, og stopper når dere ser dagslys igjen. Nærmest vinner.')),
      ...deltakere.map((d) => {
        const felt = h('input.pille', {
          type: 'number', inputmode: 'numeric', min: '1', max: '3600', placeholder: 'sekunder',
          style: { width: '120px', minHeight: '58px', textAlign: 'center', fontWeight: '800', fontSize: '1.15em' },
          oninput: (e) => gjett.set(d.navn, Number(e.target.value) || 0),
        });
        return h('div.valgkort', { style: { minHeight: '76px' } },
          h('span.tekst', {}, h('b', d.navn)), felt);
      }),
      knapp('Start klokka', { klasse: 'stor hoved full', sym: 'spill', onclick: visKlokke }),
    );
  }

  function visKlokke() {
    start = Date.now();
    LYD.tikk();
    const tall = h('div.stortall', '0');
    boks.replaceChildren(
      h('div.kort.midt', {},
        h('p.svak', 'Sekunder i tunnelen'),
        tall,
        h('p.liten.svak', { style: { marginTop: '8px' } }, 'Trykk når dere ser dagslys igjen.')),
      knapp('Vi er ute!', { klasse: 'stor gul full', onclick: visFasit }),
    );
    ticker = setInterval(() => {
      const s = Math.round((Date.now() - start) / 1000);
      tall.textContent = String(s);
      if (s % 10 === 0) LYD.tikk();
    }, 200);
  }

  function visFasit() {
    clearInterval(ticker);
    const fasit = Math.round((Date.now() - start) / 1000);
    LYD.bingo();
    si(`${fasit} sekunder`);
    const rangert = deltakere
      .map((d) => ({ navn: d.navn, gjett: gjett.get(d.navn) || 0 }))
      .map((x) => ({ ...x, bom: Math.abs(x.gjett - fasit) }))
      .sort((a, b) => a.bom - b.bom);

    endre((t) => { t.spottbok.statistikk.tunneler = (t.spottbok.statistikk.tunneler || 0) + 1; });

    boks.replaceChildren(
      h('div.kort.midt', {}, h('p.svak', 'Tunnelen varte'), h('div.stortall', String(fasit)), h('p.svak', 'sekunder')),
      h('div.kortliste', {}, rangert.map((r, i) => h('div.valgkort', { 'aria-pressed': String(i === 0), style: { minHeight: '64px' } },
        h('span.merke', {}, i === 0 ? symbol('stjerne', '') : h('b', `${i + 1}`)),
        h('span.tekst', {}, h('b', r.navn),
          h('span.liten.svak', r.gjett ? `Gjettet ${r.gjett} — bom på ${r.bom} sek` : 'Gjettet ikke'))))),
      h('div.kortliste', {},
        knapp('En gang til', { klasse: 'stor', sym: 'nytt', onclick: () => { gjett.clear(); visInnlegging(); } }),
        knapp('Tilbake til brettet', { klasse: 'stor hoved', sym: 'tilbake', onclick: tilbake })),
    );
  }

  visInnlegging();
  return { boks, rydd: () => clearInterval(ticker) };
}

// ------------------------------------------------------------------ quiz

function quiz(tilbake) {
  const boks = h('div.innhold');
  let riktige = 0;
  let stilte = 0;

  function neste() {
    let kandidater = SPORSMAL.filter((s) => !brukteSporsmal.has(s.q));
    if (!kandidater.length) { brukteSporsmal = new Set(); kandidater = SPORSMAL; }
    const sp = kandidater[Math.floor(Math.random() * kandidater.length)];
    brukteSporsmal.add(sp.q);
    stilte += 1;

    const riktig = sp.svar[0];
    const alternativer = stokk(sp.svar);
    const liste = h('div.kortliste');

    alternativer.forEach((a) => {
      const b = h('button.svaralternativ', {
        type: 'button',
        onclick: () => {
          if (liste.dataset.svart) return;
          liste.dataset.svart = 'ja';
          const erRiktig = a === riktig;
          if (erRiktig) { riktige += 1; LYD.bingo(); } else { LYD.feil(); }
          teller.textContent = `${riktige} av ${stilte} riktig`;
          [...liste.children].forEach((c) => {
            if (c.textContent === riktig) c.dataset.svar = 'riktig';
            else if (c === b) c.dataset.svar = 'galt';
          });
          si(erRiktig ? 'Riktig!' : `Nei. Svaret er ${riktig}`);
          setTimeout(() => {
            liste.after(knapp('Neste spørsmål', { klasse: 'stor hoved full', sym: 'pil', onclick: neste }));
          }, 500);
        },
      }, a);
      liste.append(b);
    });

    const teller = h('span.merkelapp', {},
      stilte > 1 ? `${riktige} av ${stilte - 1} riktig` : `Spørsmål ${stilte}`);

    boks.replaceChildren(
      h('div.rad.mellom', {},
        h('span.merkelapp', {}, NIVAA_NAVN[sp.niv]),
        teller),
      h('div.kort', {}, h('h2', sp.q)),
      liste,
      knapp('Tilbake til brettet', { klasse: 'full', sym: 'tilbake', onclick: tilbake }),
    );
  }

  neste();
  return { boks, rydd: () => {} };
}

// ------------------------------------------------------------------ husker du?

function huskerDu(spill, tilbake) {
  const boks = h('div.innhold');
  const sette = new Set((spill?.logg || []).map((l) => l.tingId));

  function neste() {
    if (sette.size < 2) {
      boks.replaceChildren(
        tom('Ikke nok funn ennå', 'Kryss av noen ting på brettet først, så kan dere teste hverandre her.'),
        knapp('Tilbake til brettet', { klasse: 'stor hoved full', sym: 'tilbake', onclick: tilbake }),
      );
      return;
    }
    const funnet = stokk([...sette]).slice(0, 3);
    const ikkeFunnet = stokk(TING.filter((t) => !sette.has(t.id))).slice(0, 3).map((t) => t.id);
    const alle = stokk([...funnet, ...ikkeFunnet]);
    const valgt = new Set();

    const rute = h('div.rutenett');
    alle.forEach((id) => {
      const ting = TING_ETTER_ID[id];
      const b = h('button.bokfelt', {
        type: 'button', 'data-sett': 'ja',
        onclick: () => {
          if (rute.dataset.svart) return;
          if (valgt.has(id)) { valgt.delete(id); b.style.outline = ''; }
          else { valgt.add(id); b.style.outline = '3px solid var(--primaer)'; }
          LYD.tikk();
        },
      }, ikon(ting.ikon), h('span.navn', ting.navn));
      rute.append(b);
    });

    const svarknapp = knapp('Sjekk svaret', {
      klasse: 'stor hoved full',
      onclick: () => {
        if (rute.dataset.svart) return;
        rute.dataset.svart = 'ja';
        const riktig = funnet.every((id) => valgt.has(id)) && [...valgt].every((id) => funnet.includes(id));
        [...rute.children].forEach((c, i) => {
          const id = alle[i];
          c.style.outline = funnet.includes(id) ? '3px solid var(--gronn)' : (valgt.has(id) ? '3px solid var(--rod)' : '');
        });
        if (riktig) { LYD.bingo(); si('Helt riktig!'); } else { LYD.feil(); si('Ikke helt'); }
        svarknapp.replaceWith(knapp('En gang til', { klasse: 'stor hoved full', sym: 'nytt', onclick: neste }));
      },
    });

    boks.replaceChildren(
      h('div.kort', {}, h('h2', 'Hvilke av disse har dere krysset av på denne turen?'),
        h('p.liten.svak', { style: { marginTop: '6px' } }, 'Trykk på alle dere tror er riktige.')),
      rute,
      svarknapp,
      knapp('Tilbake til brettet', { klasse: 'full', sym: 'tilbake', onclick: tilbake }),
    );
  }

  neste();
  return { boks, rydd: () => {} };
}

// ------------------------------------------------------------------ skjermen

export function tegn() {
  const spill = hentAktivt();
  let aktivt = null;
  const tilbake = () => { aktivt?.rydd(); gaaTil(spill ? 'spill' : 'start'); };

  const skjerm = h('div.skjerm');
  const topp = h('div.topplinje', {},
    h('button.knapp.ikonknapp', { type: 'button', 'aria-label': 'Tilbake', onclick: tilbake }, symbol('tilbake')),
    h('h2', 'Pause'));

  function visMeny() {
    aktivt?.rydd();
    aktivt = null;
    const innhold = h('div.innhold', {},
      h('div.kort', {},
        h('h2', 'Ingenting å se?'),
        h('p.svak', { style: { marginTop: '6px' } },
          'Tunnel, ferje eller bare mørkt og kjedelig ute. Brettet står stille imens — dere mister ingenting.')),
      h('div.kortliste', {},
        h('button.valgkort', { type: 'button', onclick: () => start('tid') },
          h('span.merke', {}, ikon('tunnel')),
          h('span.tekst', {}, h('b', 'Gjett tiden'), h('span.liten.svak', 'Hvor lenge varer tunnelen? Gjett, så tar vi tida.')),
          symbol('pil')),
        h('button.valgkort', { type: 'button', onclick: () => start('quiz') },
          h('span.merke', {}, ikon('fart80')),
          h('span.tekst', {}, h('b', 'Quiz'), h('span.liten.svak', 'Spørsmål om veier, dyr og Norge.')),
          symbol('pil')),
        h('button.valgkort', { type: 'button', onclick: () => start('husker') },
          h('span.merke', {}, ikon('speilSving')),
          h('span.tekst', {}, h('b', 'Husker du?'), h('span.liten.svak', 'Hvilke av disse krysset dere av i dag?')),
          symbol('pil')),
        h('button.valgkort', { type: 'button', onclick: paaFerje },
          h('span.merke', {}, ikon('ferje')),
          h('span.tekst', {}, h('b', 'Vi er på ferja'), h('span.liten.svak', 'Registrer fergeturen og spill quiz imens.')),
          symbol('pil'))),
      knapp('Tilbake til brettet', { klasse: 'stor hoved full', sym: 'tilbake', onclick: tilbake }),
    );
    skjerm.replaceChildren(topp, innhold);
  }

  function paaFerje() {
    endre((t) => { t.spottbok.statistikk.ferjer = (t.spottbok.statistikk.ferjer || 0) + 1; });
    LYD.nyttStopp();
    si('God tur over fjorden');
    start('quiz');
  }

  function start(hva) {
    aktivt?.rydd();
    if (hva === 'tid') aktivt = gjettTiden(spill, visMeny);
    else if (hva === 'quiz') aktivt = quiz(visMeny);
    else aktivt = huskerDu(spill, visMeny);
    skjerm.replaceChildren(topp, aktivt.boks);
  }

  visMeny();
  return skjerm;
}
