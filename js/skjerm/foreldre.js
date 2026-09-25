// Foreldrekontroll-skjermen.
//
// To tilstander: låst (tastatur) og åpen (alt som kan slettes). Alt som
// fjerner noe for godt finnes bare her — resten av appen har ingen
// slettknapper i det hele tatt, slik at ingen kan tømme spottboka med en
// feilfinger mens bilen rister.

import { h, knapp, ikon, symbol, tilbakeknapp, bekreft } from '../kjerne/ui.js';
import { les } from '../kjerne/lager.js';
import { FARGER } from '../kjerne/spill.js';
import { NIVAA } from '../kjerne/brett.js';
import { RUTE_ETTER_ID } from '../data/ruter.js';
import { TING } from '../data/ting.js';
import { STANDARD_PAUSE } from '../kjerne/sperre.js';
import {
  harKode, settKode, fjernKode, stemmerKoden, hvaFinnes,
  slettSpiller, slettAlleSpillere, slettTur, slettAlleTurer, slettAktivtSpill,
  nullstillFrimodusTelling, nullstillSpottbok, slettAlt,
} from '../kjerne/foreldre.js';
import { LYD } from '../kjerne/lyd.js';
import { gaaTil, tegnPaaNytt, settInnstilling } from '../app.js';

// Låses igjen når man går ut med tilbakeknappen, ikke når skjermen bare
// tegnes på nytt etter en sletting.
let laastOpp = false;

const fargeHex = (id) => (FARGER.find((f) => f.id === id) || FARGER[0]).hex;

function dato(iso) {
  return new Date(iso).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ------------------------------------------------------------------ tastatur

/**
 * Firesifret tastatur. Brukes både til å låse opp og til å lage ny kode.
 * @param vedFerdig  kalles med koden når fire sifre er tastet
 */
function tastatur({ tittel, undertekst, vedFerdig, ekstra = null, feil = '' }) {
  let kode = '';
  const prikker = h('div.kodeprikker');
  const feilmelding = h('p.liten.midt', { style: { color: 'var(--rod)', minHeight: '1.4em' } }, feil);

  function tegnPrikker() {
    prikker.replaceChildren(...[0, 1, 2, 3].map((i) => h(`span.kodeprikk${i < kode.length ? '.fylt' : ''}`)));
  }

  function skriv(siffer) {
    if (kode.length >= 4) return;
    kode += siffer;
    feilmelding.textContent = '';
    tegnPrikker();
    LYD.tikk();
    if (kode.length === 4) {
      const ferdig = kode;
      setTimeout(() => {
        const feil = vedFerdig(ferdig);
        if (feil) {
          kode = '';
          tegnPrikker();
          feilmelding.textContent = feil;
          LYD.feil();
        }
      }, 140);
    }
  }

  function viskUt() {
    kode = kode.slice(0, -1);
    tegnPrikker();
    LYD.tikk();
  }

  const taster = h('div.tastatur');
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((n) => {
    taster.append(h('button.tast', { type: 'button', onclick: () => skriv(String(n)) }, String(n)));
  });
  taster.append(h('span'));
  taster.append(h('button.tast', { type: 'button', onclick: () => skriv('0') }, '0'));
  taster.append(h('button.tast.viskut', {
    type: 'button', 'aria-label': 'Slett siste siffer', onclick: viskUt,
  }, symbol('tilbake')));

  tegnPrikker();

  return h('div.innhold.kodeinnhold', {},
    h('div.midt', {},
      h('span.laas', {}, symbol('laas')),
      h('h2', { style: { marginTop: '10px' } }, tittel),
      undertekst ? h('p.svak', { style: { marginTop: '6px' } }, undertekst) : null),
    prikker,
    feilmelding,
    taster,
    ekstra);
}

// ------------------------------------------------------------------ låst

function laasSkjerm() {
  if (!harKode()) return lagKodeSkjerm();

  return tastatur({
    tittel: 'Foreldrekontroll',
    undertekst: 'Tast koden for å komme inn.',
    vedFerdig: (kode) => {
      if (!stemmerKoden(kode)) return 'Feil kode. Prøv igjen.';
      laastOpp = true;
      LYD.merke();
      tegnPaaNytt();
      return null;
    },
    ekstra: h('div', { style: { marginTop: 'auto', paddingTop: '20px' } },
      knapp('Glemt koden?', {
        klasse: 'full',
        onclick: async () => {
          if (await bekreft({
            tittel: 'Glemt koden?',
            tekst: 'Koden ligger bare på denne enheten, og kan ikke hentes fram igjen. Den eneste veien inn er å slette alt appen har lagret — spillere, spottbok, merker og turer.',
            ja: 'Slett alt og lag ny kode',
            nei: 'Avbryt',
            fare: true,
          })) {
            slettAlt();
            laastOpp = true;
            LYD.stopp();
            tegnPaaNytt();
          }
        },
      })),
  });
}

function lagKodeSkjerm() {
  let forste = null;

  const lag = (feil = '') => tastatur({
    feil,
    tittel: forste ? 'Tast koden en gang til' : 'Lag en kode',
    undertekst: forste
      ? 'Bare for å være sikker på at den sitter.'
      : 'Fire sifre. Koden hindrer at barna sletter noe ved et uhell — den er ikke ment som sikkerhet, og ligger ulåst på enheten.',
    vedFerdig: (kode) => {
      if (!forste) {
        forste = kode;
        bytt(lag());
        return null;
      }
      if (kode !== forste) {
        forste = null;
        // Meldingen må settes på det nye tastaturet, ikke det som byttes ut.
        bytt(lag('Kodene var ikke like. Prøv på nytt.'));
        return null;
      }
      settKode(kode);
      laastOpp = true;
      LYD.merke();
      tegnPaaNytt();
      return null;
    },
  });

  let boks = lag();
  function bytt(ny) {
    boks.replaceWith(ny);
    boks = ny;
  }
  return boks;
}

// ------------------------------------------------------------------ åpen

function seksjon(tittel, forklaring, ...barn) {
  return h('section.kort', {},
    h('h2', { style: { marginBottom: forklaring ? '4px' : '10px' } }, tittel),
    forklaring ? h('p.liten.svak', { style: { marginBottom: '12px' } }, forklaring) : null,
    ...barn);
}

function apenSkjerm() {
  const t = les();
  const finnes = hvaFinnes();
  const innhold = h('div.innhold');

  // ---------------------------------------------------------- oversikt
  innhold.append(h('div.kort', {},
    h('div.tallrad', {},
      h('div.tall', {}, h('b', String(finnes.spillere)), h('span', 'spillere')),
      h('div.tall', {}, h('b', String(finnes.turer)), h('span', 'lagrede turer')),
      h('div.tall', {}, h('b', `${finnes.funn}/${TING.length}`), h('span', 'i spottboka'))),
    h('p.liten.svak', { style: { marginTop: '12px' } },
      'Alt som sletter noe finnes her og ingen andre steder i appen.')));

  // ---------------------------------------------------------- spillere
  const spillerliste = h('div.kortliste');
  if (!t.spillere.length) {
    spillerliste.append(h('p.liten.svak', 'Ingen spillere lagret.'));
  } else {
    t.spillere.forEach((sp) => {
      const niv = NIVAA.find((n) => n.id === sp.nivaaId) || NIVAA[1];
      spillerliste.append(h('div.valgkort', { style: { gap: '10px' } },
        h('span.merke', { style: { background: fargeHex(sp.farge), color: '#fff' } },
          h('b', sp.navn.slice(0, 1).toUpperCase())),
        h('span.tekst', {}, h('b', sp.navn), h('span.liten.svak', `${niv.navn} · ${niv.rader}×${niv.kolonner}`)),
        knapp('Slett', {
          klasse: 'fare',
          onclick: async () => {
            if (await bekreft({
              tittel: `Slette ${sp.navn}?`,
              tekst: 'Spilleren fjernes også fra turen som er i gang. Funnene blir liggende i spottboka.',
              ja: 'Slett spiller', fare: true,
            })) {
              slettSpiller(sp.id);
              LYD.stopp();
              tegnPaaNytt();
            }
          },
        })));
    });
    spillerliste.append(knapp('Slett alle spillerne', {
      klasse: 'fare full',
      onclick: async () => {
        if (await bekreft({
          tittel: 'Slette alle spillerne?',
          tekst: 'Turen som er i gang avsluttes. Spottboka og merkene beholdes.',
          ja: 'Slett alle', fare: true,
        })) {
          slettAlleSpillere();
          LYD.stopp();
          tegnPaaNytt();
        }
      },
    }));
  }
  innhold.append(seksjon('Spillere', 'Barna kan legge til og endre spillere selv, men ikke slette dem.', spillerliste));

  // ---------------------------------------------------------- turen som går
  if (t.aktivtSpill) {
    const rute = RUTE_ETTER_ID[t.aktivtSpill.ruteId];
    innhold.append(seksjon('Turen som er i gang', null,
      h('div.valgkort', { style: { marginBottom: '12px' } },
        h('span.merke', {}, ikon('gulStripe')),
        h('span.tekst', {},
          h('b', rute ? rute.navn : 'Tur'),
          h('span.liten.svak', `${Math.round(t.aktivtSpill.km)} km · runde ${t.aktivtSpill.runde} · ${t.aktivtSpill.deltakere.map((d) => d.navn).join(', ')}`))),
      knapp('Slett turen som er i gang', {
        klasse: 'fare full',
        onclick: async () => {
          if (await bekreft({
            tittel: 'Slette turen?',
            tekst: 'Brettet og kilometerne forsvinner uten å bli lagret i historikken. Funnene blir liggende i spottboka.',
            ja: 'Slett turen', fare: true,
          })) {
            slettAktivtSpill();
            LYD.stopp();
            tegnPaaNytt();
          }
        },
      })));
  }

  // ---------------------------------------------------------- lagrede turer
  const turliste = h('div.kortliste');
  if (!t.spottbok.turer.length) {
    turliste.append(h('p.liten.svak', 'Ingen turer lagret ennå.'));
  } else {
    [...t.spottbok.turer].reverse().forEach((tur, i) => {
      const indeks = t.spottbok.turer.length - 1 - i;
      const rute = RUTE_ETTER_ID[tur.rute];
      turliste.append(h('div.valgkort', { style: { gap: '10px' } },
        h('span.merke', {}, ikon('kmStolpe')),
        h('span.tekst', {},
          h('b', rute ? rute.navn : 'Tur'),
          h('span.liten.svak', `${dato(tur.dato)} · ${tur.km} km`)),
        knapp('Slett', {
          klasse: 'fare',
          onclick: async () => {
            if (await bekreft({ tittel: 'Slette denne turen?', ja: 'Slett', fare: true })) {
              slettTur(indeks);
              LYD.stopp();
              tegnPaaNytt();
            }
          },
        })));
    });
    turliste.append(knapp('Slett alle turene', {
      klasse: 'fare full',
      onclick: async () => {
        if (await bekreft({
          tittel: 'Slette hele turhistorikken?',
          tekst: 'Spottboka og merkene beholdes.',
          ja: 'Slett alle turene', fare: true,
        })) {
          slettAlleTurer();
          LYD.stopp();
          tegnPaaNytt();
        }
      },
    }));
  }
  innhold.append(seksjon('Lagrede turer', null, turliste));

  // ---------------------------------------------------------- samlingen
  innhold.append(seksjon('Samlingen', 'Dette er det barna har brukt lengst tid på å bygge opp.',
    h('div.kortliste', {},
      knapp(`Nullstill frimodus-tellingen (${finnes.friFunn} funn)`, {
        klasse: 'fare full',
        onclick: async () => {
          if (await bekreft({
            tittel: 'Nullstille frimodus?',
            tekst: 'Alle tallene settes til null. Spottboka og merkene beholdes.',
            ja: 'Nullstill', fare: true,
          })) {
            nullstillFrimodusTelling();
            LYD.stopp();
            tegnPaaNytt();
          }
        },
      }),
      knapp(`Tøm spottboka (${finnes.funn} funn, ${finnes.merker} merker)`, {
        klasse: 'fare full',
        onclick: async () => {
          if (await bekreft({
            tittel: 'Tømme spottboka?',
            tekst: 'Alle funn, alle merker, all statistikk og alle turer forsvinner. Spillerne beholdes.',
            ja: 'Tøm spottboka', fare: true,
          })) {
            nullstillSpottbok();
            LYD.stopp();
            tegnPaaNytt();
          }
        },
      }))));

  // ---------------------------------------------------------- trykkpause
  const pause = t.innstillinger.trykkpause ?? STANDARD_PAUSE;
  const pillerad = h('div.pillerad');
  [['0', 'Av'], ['5', '5 sek'], ['10', '10 sek'], ['15', '15 sek'], ['30', '30 sek']].forEach(([v, navn]) => {
    pillerad.append(h('button.pille', {
      type: 'button',
      'aria-pressed': String(String(pause) === v),
      onclick: () => {
        settInnstilling('trykkpause', Number(v));
        [...pillerad.children].forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === navn)));
        LYD.tikk();
      },
    }, navn));
  });
  innhold.append(seksjon('Trykkpause',
    'Hvor lenge det er sperret etter hvert trykk, uansett hvilken ting det gjelder. Uten den kan man gå gjennom hele brettet på ti sekunder.',
    pillerad));

  // ---------------------------------------------------------- koden
  innhold.append(seksjon('Koden', 'Koden ligger ulåst på denne enheten. Den stopper uhell, ikke noen som virkelig vil inn.',
    h('div.kortliste', {},
      knapp('Bytt kode', {
        klasse: 'full',
        onclick: () => { fjernKode(); laastOpp = false; tegnPaaNytt(); },
      }),
      knapp('Fjern koden', {
        klasse: 'full',
        onclick: async () => {
          if (await bekreft({
            tittel: 'Fjerne koden?',
            tekst: 'Da står foreldrekontrollen åpen for alle som åpner appen.',
            ja: 'Fjern koden',
          })) {
            fjernKode();
            LYD.stopp();
            tegnPaaNytt();
          }
        },
      }))));

  // ---------------------------------------------------------- slett alt
  innhold.append(h('section.kort.farekort', {},
    h('h2', { style: { marginBottom: '4px' } }, 'Slett alt'),
    h('p.liten.svak', { style: { marginBottom: '12px' } },
      'Appen blir som nyinstallert: spillere, turer, spottbok, merker, frimodus og koden forsvinner. Dette kan ikke angres.'),
    knapp('Slett alt appen har lagret', {
      klasse: 'stor fare full',
      onclick: async () => {
        if (!await bekreft({
          tittel: 'Slette alt?',
          tekst: `${finnes.funn} funn og ${finnes.merker} merker forsvinner for godt.`,
          ja: 'Fortsett', fare: true,
        })) return;
        if (!await bekreft({
          tittel: 'Helt sikker?',
          tekst: 'Siste sjanse. Ingenting kan hentes tilbake etterpå.',
          ja: 'Ja, slett alt', nei: 'Nei, behold', fare: true,
        })) return;
        slettAlt();
        laastOpp = false;
        LYD.stopp();
        gaaTil('start');
      },
    })));

  return innhold;
}

// ------------------------------------------------------------------ skjermen

export function tegn() {
  return h('div.skjerm', {},
    h('div.topplinje', {},
      tilbakeknapp(() => { laastOpp = false; gaaTil('start'); }),
      h('h2', 'Foreldrekontroll'),
      laastOpp ? h('span.merkelapp', {}, symbol('laasApen', 'ik'), 'Åpen') : null),
    laastOpp ? apenSkjerm() : laasSkjerm());
}
