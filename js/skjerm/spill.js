// Spillskjermen. Her ligger hele kjernesløyfa:
// se noe ut av vinduet -> trykk -> appen sier ordet høyt -> alle hører det.

import { h, knapp, ikon, symbol, ark, bekreft, rop, feire, stolpe, tom } from '../kjerne/ui.js';
import { TING_ETTER_ID, SJELDENHET, POENG } from '../data/ting.js';
import { RUTE_ETTER_ID } from '../data/ruter.js';
import { MERKE_ETTER_ID } from '../data/merker.js';
import {
  FARGER, MODUS, hentAktivt, kryssAv, angre, nesteRunde, avsluttSpill,
  brettFor, kanFaaHjelp, girHjelp, stilling, finnBingo, fremdrift, posisjon,
} from '../kjerne/spill.js';
import { LYD, si } from '../kjerne/lyd.js';
import { gaaTil, tegnPaaNytt } from '../app.js';

let aktivSpiller = 0; // hvem sitt trykk er det (Sammen-modus og delt nettbrett)
let angrefrist = null;

// Én lytter for hele modulen. Skjermen tegnes mange ganger i løpet av en tur,
// og en ny lytter per tegning ville hopet seg opp.
let tilpassNa = null;

// Hvilke brett har allerede fått den store bingo-feiringen. Nullstilles når
// runden eller spillet skifter, ellers ville første bingo i et nytt spill
// gå stille forbi.
const feiretBingo = new Set();
let feiretFor = null;
const vedEndretStorrelse = () => requestAnimationFrame(() => tilpassNa?.());
addEventListener('resize', vedEndretStorrelse);
addEventListener('orientationchange', vedEndretStorrelse);

const fargeHex = (id) => (FARGER.find((f) => f.id === id) || FARGER[0]).hex;

export function tegn() {
  const spill = hentAktivt();
  if (!spill) {
    return h('div.skjerm', {}, h('div.innhold', {}, tom('Ingen tur i gang', 'Start en ny tur fra forsiden.'),
      knapp('Til forsiden', { klasse: 'stor hoved full', onclick: () => gaaTil('start') })));
  }
  if (aktivSpiller >= spill.deltakere.length) aktivSpiller = 0;

  const merkelapp = `${spill.kode}|${spill.runde}`;
  if (feiretFor !== merkelapp) {
    feiretBingo.clear();
    feiretFor = merkelapp;
  }

  const rute = RUTE_ETTER_ID[spill.ruteId];

  // ---------------------------------------------------------------- topp
  const kmTekst = h('span.liten.svak');
  const ruteStolpe = stolpe(0);
  const rutelinje = h('div.rutelinje', {
    role: 'button', tabindex: '0',
    onclick: visRute,
    onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') visRute(); },
  },
  h('span', { style: { fontSize: '0.8rem', fontWeight: '800' } }, rute.navn),
  ruteStolpe, kmTekst);

  const topp = h('div.topplinje', {},
    h('button.knapp.ikonknapp', { type: 'button', 'aria-label': 'Meny', onclick: visMeny }, symbol('tannhjul')),
    h('div.voks', {}, rutelinje),
    h('button.knapp.ikonknapp.gul', { type: 'button', 'aria-label': 'Pause — tunnel eller ferje', onclick: () => gaaTil('pause') }, symbol('pause')));

  // ---------------------------------------------------------------- brett
  const brettEl = h('div.brett');
  const nesteStopp = h('div.nestestopp');
  const brettboks = h('div.brettboks', {}, brettEl);

  // ---------------------------------------------------------------- bunn
  const velger = h('div.spillervelger');
  const angreknapp = knapp('', { klasse: 'ikonknapp', sym: 'angre', 'aria-label': 'Angre siste avkryssing', onclick: paaAngre });
  angreknapp.style.display = 'none';
  const statuslinje = h('div.rad', { style: { marginTop: '8px' } });

  const bunn = h('div.bunnlinje', {}, velger, statuslinje);

  const flate = h('div.spillflate', {}, brettboks, nesteStopp);

  // ---------------------------------------------------------------- tegning

  function synligBrettNr() {
    return brettFor(spill, spill.deltakere[aktivSpiller].plass);
  }

  function tegnBrett() {
    const nr = synligBrettNr();
    const brett = spill.brett[nr];
    const merket = spill.merket[nr];
    const bingo = finnBingo(brett, merket);

    brettEl.style.gridTemplateColumns = `repeat(${brett.kolonner}, 1fr)`;
    brettEl.style.setProperty('--sideforhold', String(brett.kolonner / brett.rader));
    brettEl.replaceChildren();

    brett.felt.forEach((f, i) => {
      if (f.gratis) {
        brettEl.append(h('div.felt', { 'data-gratis': 'ja', 'data-bingo': bingo.feltIBingo.has(i) ? 'ja' : 'nei' },
          symbol('stjerne', ''), h('span.navn', 'Gratis')));
        return;
      }
      const ting = TING_ETTER_ID[f.tingId];
      const merketNa = merket.includes(f.tingId);
      const eier = spill.modus === 'sammen' ? spill.merketAv[f.tingId] : spill.deltakere[aktivSpiller].spillerId;
      const eierFarge = eier ? fargeHex((spill.deltakere.find((d) => d.spillerId === eier) || {}).farge) : 'var(--gronn)';

      const el = h('button.felt', {
        type: 'button',
        'data-merket': merketNa ? 'ja' : 'nei',
        'data-bingo': bingo.feltIBingo.has(i) ? 'ja' : 'nei',
        'aria-pressed': String(merketNa),
        'aria-label': `${ting.navn}, ${SJELDENHET[ting.sjelden].navn}, ${POENG[ting.sjelden]} poeng`,
        style: {
          '--sjelden': SJELDENHET[ting.sjelden].farge,
          '--spillerfarge': merketNa ? eierFarge : '',
        },
        onclick: () => paaTrykk(nr, f.tingId, el),
      },
      ikon(ting.ikon),
      h('span.navn', ting.navn));

      if (merketNa) el.append(h('span.hake', {}, symbol('hakeSirkel', '')));
      brettEl.append(el);
    });
  }

  function tegnVelger() {
    velger.replaceChildren();
    spill.deltakere.forEach((d, i) => {
      const nr = brettFor(spill, d.plass);
      const fr = fremdrift(spill.brett[nr], spill.merket[nr]);
      velger.append(h('button.spillerknapp', {
        type: 'button',
        'aria-pressed': String(i === aktivSpiller),
        style: { '--farge': fargeHex(d.farge) },
        onclick: () => { aktivSpiller = i; tegnAlt(); LYD.tikk(); },
      },
      h('span.rad', { style: { gap: '6px' } }, h('span.prikk', { style: { '--farge': fargeHex(d.farge) } }), h('b', d.navn)),
      h('small', spill.modus === 'sammen' ? `${d.funn} funn · ${d.poeng} p` : `${fr.krysset}/${fr.total} · ${d.poeng} p`)));
    });
  }

  function tegnStatus() {
    statuslinje.replaceChildren();
    const nr = synligBrettNr();
    const fr = fremdrift(spill.brett[nr], spill.merket[nr]);
    const bingo = finnBingo(spill.brett[nr], spill.merket[nr]);

    statuslinje.append(
      h('div.voks.statustekst', {},
        h('div.liten.svak', spill.modus === 'sammen'
          ? `Runde ${spill.runde} · ${fr.krysset} av ${fr.total}`
          : `${spill.deltakere[aktivSpiller].navn} · ${fr.krysset} av ${fr.total}`),
        stolpe(fr.besteLinje, { tynn: true })),
      angreknapp,
    );

    if (bingo.linjer.length) {
      statuslinje.append(knapp(bingo.fulltBrett ? 'Neste brett' : 'Nytt brett', {
        klasse: 'hoved', sym: 'nytt', onclick: paaNyttBrett,
      }));
    }

    // Utjevning: er noen langt bak, tilby et gratisfelt.
    const hjelp = kanFaaHjelp(spill);
    if (hjelp && !bingo.linjer.length) {
      statuslinje.append(knapp('Hjelp', {
        klasse: 'gul', ikonNavn: 'vinker',
        'aria-label': `Gi ${hjelp.deltaker.navn} et gratisfelt`,
        onclick: () => visHjelp(hjelp),
      }));
    }
  }

  function tegnRute() {
    const pos = posisjon(rute, spill.km);
    ruteStolpe.querySelector('i').style.width = `${Math.round(pos.andel * 100)}%`;
    kmTekst.textContent = `${Math.round(spill.km)} / ${rute.lengde} km`;

    nesteStopp.replaceChildren(
      ikon(pos.neste ? 'stedsnavn' : 'flagg'),
      h('span.voks', {},
        h('b', pos.neste ? pos.neste.navn : `Framme i ${pos.forrige.navn}`),
        h('div.liten.svak', pos.neste
          ? `${Math.ceil(pos.tilNeste)} km igjen — omtrent ${Math.max(1, Math.ceil(pos.tilNeste / 4))} ting til`
          : 'Hele ruta er kjørt. Velg en ny fra menyen.')),
    );
  }

  // Brettet skal være så stort som plassen tillater, uansett om nettbrettet
  // holdes stående eller liggende.
  function tilpassBrett() {
    const brett = spill.brett[synligBrettNr()];
    // Nullstill først, ellers måler vi plassen forrige brettstørrelse tok.
    brettEl.style.width = '0px';
    const boks = brettboks.getBoundingClientRect();
    if (!boks.width || !boks.height) return;
    const forhold = brett.kolonner / brett.rader;
    const bredde = Math.floor(Math.min(boks.width, boks.height * forhold));
    brettEl.style.width = `${Math.max(180, bredde)}px`;
  }

  function tegnAlt() {
    tegnBrett();
    tegnVelger();
    tegnStatus();
    tegnRute();
    requestAnimationFrame(tilpassBrett);
  }

  tilpassNa = tilpassBrett;

  // ---------------------------------------------------------------- handling

  function paaTrykk(brettNr, tingId, el) {
    if (spill.merket[brettNr].includes(tingId)) {
      // Allerede krysset av — gi beskjed i stedet for å gjøre ingenting.
      LYD.tikk();
      const ting = TING_ETTER_ID[tingId];
      rop(ting.ikon, ting.navn, 'Allerede funnet');
      return;
    }
    const d = spill.deltakere[aktivSpiller];
    const r = kryssAv(spill, { brettNr, tingId, spillerId: d.spillerId });
    if (!r) return;
    feireFunn(r, d);
    tegnAlt();
    startAngrefrist();
  }

  function feireFunn(r, d) {
    const { ting } = r;
    // Stemmen er selve «rop det høyt»: hele bilen hører hva som ble krysset av.
    si(ting.navn.replace(/!$/, ''));
    if (ting.sjelden === 5) LYD.krysLegendarisk();
    else if (ting.sjelden === 4) LYD.krysSjelden();
    else LYD.kryss();

    const bit = [];
    if (r.forsteGang) bit.push('Ny i spottboka!');
    bit.push(`+${r.poeng} km`);
    if (r.varHjelp) bit.push(`fra ${d.navn}`);
    rop(ting.ikon, ting.navn, bit.join(' · '));

    if (r.fulltBrett) {
      setTimeout(() => { LYD.fullPlate(); feire('FULL PLATE!'); }, 380);
    } else if (r.nyeLinjer > 0) {
      // Mot slutten av et brett fullføres flere rekker av samme trykk. Da blir
      // en skjermfyllende feiring hver gang bare mas — den første tar plassen,
      // resten kvitteres ut med lyd og en linje øverst.
      const forste = !feiretBingo.has(r.brettNr);
      feiretBingo.add(r.brettNr);
      setTimeout(() => {
        LYD.bingo();
        if (forste) feire('BINGO!');
        else rop('gulStripe', `${r.linjerTotalt} rekker!`, 'Fortsett — full plate gir mer');
      }, 340);
    }
    if (r.naddeStopp) setTimeout(() => visStopp(r.naddeStopp, r.ruteFerdig), r.nyeLinjer ? 2000 : 900);
    if (r.nyeMerker.length) setTimeout(() => visMerker(r.nyeMerker), r.naddeStopp ? 3400 : 1600);
  }

  function startAngrefrist() {
    angreknapp.style.display = '';
    clearTimeout(angrefrist);
    // Åtte sekunder: nok til at en femåring rekker å si «nei, feil!».
    angrefrist = setTimeout(() => { angreknapp.style.display = 'none'; }, 8000);
  }

  function paaAngre() {
    const r = angre(spill);
    if (!r) return;
    LYD.angre();
    rop(r.ting.ikon, r.ting.navn, 'Angret');
    angreknapp.style.display = 'none';
    clearTimeout(angrefrist);
    tegnAlt();
  }

  function paaNyttBrett() {
    nesteRunde(spill);
    feiretBingo.clear();
    feiretFor = `${spill.kode}|${spill.runde}`;
    aktivSpiller = 0;
    LYD.nyttStopp();
    tegnAlt();
    rop('gulStripe', `Runde ${spill.runde}`, 'Nytt brett, samme tur');
  }

  // ---------------------------------------------------------------- ark

  function visHjelp(hjelp) {
    const valg = hjelp.forslag.slice(0, 6);
    const lukk = ark([
      h('h2', `Hjelp ${hjelp.deltaker.navn}`),
      h('p.svak', `${hjelp.deltaker.navn} ligger et stykke bak. Så dere noe av dette sammen? Velg én, så får ${hjelp.deltaker.navn} den.`),
      h('div.rutenett', {}, valg.map((id) => {
        const ting = TING_ETTER_ID[id];
        return h('button.bokfelt', {
          type: 'button', 'data-sett': 'ja',
          onclick: () => {
            lukk();
            const r = girHjelp(spill, { brettNr: hjelp.brettNr, tingId: id, spillerId: hjelp.deltaker.spillerId });
            if (r) { feireFunn(r, hjelp.deltaker); tegnAlt(); startAngrefrist(); }
          },
        }, ikon(ting.ikon), h('span.navn', ting.navn));
      })),
      knapp('Ikke nå', { klasse: 'full', onclick: () => lukk() }),
    ]);
  }

  function visStopp(stopp, ferdig) {
    LYD.nyttStopp();
    const lukk = ark([
      h('div.hode', {}, h('span.stortikon', {}, ikon(ferdig ? 'flagg' : 'stedsnavn')),
        h('div', {}, h('h2', ferdig ? `Framme i ${stopp.navn}!` : stopp.navn),
          h('p.liten.svak', `${Math.round(spill.km)} km kjørt`))),
      h('p', stopp.fakta),
      ferdig
        ? h('div.kortliste', {},
          knapp('Velg en ny rute', { klasse: 'stor hoved', onclick: () => { lukk(); visRutebytte(); } }),
          knapp('Fortsett å spille', { klasse: 'stor', onclick: () => lukk() }))
        : knapp('Videre', { klasse: 'stor hoved full', onclick: () => lukk() }),
    ]);
  }

  function visMerker(ider) {
    LYD.merke();
    const lukk = ark([
      h('h2', ider.length > 1 ? 'Nye merker!' : 'Nytt merke!'),
      h('div.merkerute', {}, ider.map((id) => {
        const m = MERKE_ETTER_ID[id];
        return h('div.merkekort', { 'data-tatt': 'ja' }, ikon(m.ikon), h('b', m.navn), h('span', m.tekst));
      })),
      knapp('Fint!', { klasse: 'stor hoved full', onclick: () => lukk() }),
    ]);
  }

  function visRute() {
    const pos = posisjon(rute, spill.km);
    const lukk = ark([
      h('h2', rute.navn),
      h('p.liten.svak', rute.undertittel),
      h('div.rad', {}, stolpe(pos.andel), h('b', `${Math.round(spill.km)} km`)),
      h('div.kortliste', {}, rute.stopp.map((s) => {
        const naadd = s.km <= spill.km;
        return h('div.valgkort', { 'aria-pressed': String(naadd), style: { minHeight: '64px' } },
          h('span.merke', { style: { background: naadd ? 'var(--gul)' : 'var(--flate-2)' } },
            naadd ? symbol('hake', '') : h('span.liten', `${s.km}`)),
          h('span.tekst', {}, h('b', s.navn), h('span.liten.svak', naadd ? s.fakta : `${s.km - Math.round(spill.km)} km igjen`)));
      })),
      knapp('Lukk', { klasse: 'stor full', onclick: () => lukk() }),
    ]);
  }

  function visRutebytte() {
    const lukk = ark([
      h('h2', 'Ny rute'),
      h('p.svak', 'Kilometerne nullstilles, men alt dere har funnet blir liggende i spottboka.'),
      h('div.kortliste', {}, Object.values(RUTE_ETTER_ID).map((r) => h('button.valgkort', {
        type: 'button',
        onclick: () => {
          spill.ruteId = r.id;
          spill.km = 0;
          lukk();
          tegnPaaNytt();
        },
      },
      h('span.merke', {}, h('b', { style: { fontSize: '0.8rem' } }, `${r.lengde}`)),
      h('span.tekst', {}, h('b', r.navn), h('span.liten.svak', r.undertittel))))),
    ]);
  }

  function visMeny() {
    const st = stilling(spill);
    const lukk = ark([
      h('h2', 'Turen'),
      h('div.rad.mellom', {},
        h('span.merkelapp', {}, 'Kode ', h('span.kode', spill.kode)),
        h('span.merkelapp', {}, MODUS[spill.modus].navn)),
      h('p.liten.svak', 'Skriv koden på et annet nettbrett for å spille sammen uten nett.'),
      h('div.kortliste', {}, st.map((d, i) => h('div.valgkort', { style: { minHeight: '64px' } },
        h('span.merke', { style: { background: fargeHex(d.farge), color: '#fff' } }, h('b', `${i + 1}`)),
        h('span.tekst', {}, h('b', d.navn), h('span.liten.svak', `${d.poeng} poeng · ${d.funn} funn`))))),
      h('div.kortliste', {},
        knapp('Nytt brett', { klasse: 'stor', sym: 'nytt', onclick: () => { lukk(); paaNyttBrett(); } }),
        knapp('Bytt rute', { klasse: 'stor', onclick: () => { lukk(); visRutebytte(); } }),
        knapp('Spottboka', { klasse: 'stor', sym: 'bok', onclick: () => gaaTil('spottbok') }),
        knapp('Innstillinger', { klasse: 'stor', sym: 'tannhjul', onclick: () => gaaTil('innstillinger') }),
        knapp('Avslutt turen', {
          klasse: 'stor fare',
          onclick: async () => {
            lukk();
            if (await bekreft({
              tittel: 'Avslutte turen?',
              tekst: 'Alt dere har funnet er allerede lagret i spottboka.',
              ja: 'Avslutt', fare: true,
            })) {
              avsluttSpill(spill);
              gaaTil('start');
            }
          },
        })),
    ]);
  }

  tegnAlt();
  return h('div.skjerm.spillskjerm', {}, topp, flate, bunn);
}
