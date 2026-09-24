// Frimodus-skjermen. Hele katalogen ligger framme; trykk på det dere ser.
//
// Skjermen tegner 202 felt, så den bygges bare én gang per filter. Et trykk
// oppdaterer det ene feltet, summen og spillerknappene — ikke hele rutenettet.

import { h, knapp, ikon, symbol, tilbakeknapp, ark, bekreft, rop, feire, tom } from '../kjerne/ui.js';
import { les } from '../kjerne/lager.js';
import { TING, KATEGORIER, SJELDENHET, POENG, sesongNa, tidNa } from '../data/ting.js';
import { MERKE_ETTER_ID } from '../data/merker.js';
import { lagPool } from '../kjerne/brett.js';
import { FARGER } from '../kjerne/spill.js';
import {
  SPERRE_MS, hentFrimodus, antallAv, registrer, angreSiste,
  oppsummering, nullstillFrimodus,
} from '../kjerne/frimodus.js';
import { LYD, si } from '../kjerne/lyd.js';
import { gaaTil, tegnPaaNytt } from '../app.js';

let aktivSpiller = 0;
let filter = 'alle';

// Sperrene tikker ned i én felles intervall. Skjermen tegnes på nytt hver gang
// et filter endres, og en intervall per tegning ville hopet seg opp.
let nedtelling = null;
let tikkNa = null;

function startTikking(fn) {
  tikkNa = fn;
  clearInterval(nedtelling);
  nedtelling = setInterval(() => {
    if (!tikkNa || !tikkNa()) { clearInterval(nedtelling); nedtelling = null; }
  }, 500);
}

const fargeHex = (id) => (FARGER.find((f) => f.id === id) || FARGER[0]).hex;

export function tegn() {
  const fri = hentFrimodus();
  if (!fri.deltakere.length) {
    return h('div.skjerm', {},
      h('div.topplinje', {}, tilbakeknapp(() => gaaTil('start')), h('h2', 'Frimodus')),
      h('div.innhold', {},
        tom('Ingen spillere ennå', 'Velg hvem som er med fra oppsettet.'),
        knapp('Sett opp frimodus', { klasse: 'stor hoved full', onclick: () => gaaTil('oppsett') })));
  }
  if (aktivSpiller >= fri.deltakere.length) aktivSpiller = 0;

  // Hvilke ting som kan sees der og når dere er nå — brukes av «Passer nå».
  const inn = les().innstillinger;
  const passerNa = new Set(
    lagPool({
      sesong: inn.sesongAuto ? sesongNa() : inn.sesong || sesongNa(),
      tid: tidNa(),
      sted: inn.sted,
    }).map((t) => t.id),
  );

  const felter = new Map(); // tingId -> { el, teller, sperre }

  // ------------------------------------------------------------- topp
  const sumEl = h('div.frisum');
  const velger = h('div.spillervelger');
  const angreknapp = knapp('', {
    klasse: 'ikonknapp', sym: 'angre', 'aria-label': 'Angre siste registrering', onclick: paaAngre,
  });
  angreknapp.disabled = !fri.logg.length;

  const filterrad = h('div.pillerad.frifilter');
  const valg = [
    ['alle', 'Alt'],
    ['passer', 'Passer nå'],
    ['funnet', 'Funnet'],
    ['mangler', 'Ikke funnet'],
    ...Object.entries(KATEGORIER).map(([k, v]) => [k, v.navn]),
  ];
  valg.forEach(([id, navn]) => {
    filterrad.append(h('button.pille', {
      type: 'button',
      'aria-pressed': String(filter === id),
      onclick: () => {
        filter = id;
        [...filterrad.children].forEach((c, i) => c.setAttribute('aria-pressed', String(valg[i][0] === id)));
        byggRutenett();
        LYD.tikk();
      },
    }, navn));
  });

  const rutenett = h('div.rutenett.frirutenett');

  // ------------------------------------------------------------- tegning

  function tegnSum() {
    const o = oppsummering();
    sumEl.replaceChildren(
      h('div.tall', {}, h('b', String(o.totalt)), h('span', 'funn i alt')),
      h('div.tall', {}, h('b', `${o.ulike}/${TING.length}`), h('span', 'forskjellige')),
      h('div.tall', {}, h('b', String(o.poeng)), h('span', 'poeng')),
    );
  }

  function tegnVelger() {
    velger.replaceChildren();
    hentFrimodus().deltakere.forEach((d, i) => {
      velger.append(h('button.spillerknapp', {
        type: 'button',
        'aria-pressed': String(i === aktivSpiller),
        style: { '--farge': fargeHex(d.farge) },
        onclick: () => { aktivSpiller = i; tegnVelger(); LYD.tikk(); },
      },
      h('span.rad', { style: { gap: '6px' } },
        h('span.prikk', { style: { '--farge': fargeHex(d.farge) } }), h('b', d.navn)),
      h('small', `${d.funn} funn · ${d.poeng} p`)));
    });
  }

  function listen() {
    if (filter === 'alle') return TING;
    if (filter === 'passer') return TING.filter((t) => passerNa.has(t.id));
    if (filter === 'funnet') return TING.filter((t) => antallAv(t.id) > 0);
    if (filter === 'mangler') return TING.filter((t) => antallAv(t.id) === 0);
    return TING.filter((t) => t.kat === filter);
  }

  function byggRutenett() {
    felter.clear();
    rutenett.replaceChildren();
    const liste = listen();
    if (!liste.length) {
      rutenett.append(tom('Ingenting her', 'Prøv et annet filter.'));
      return;
    }
    const f = hentFrimodus();
    liste.forEach((ting) => {
      const teller = h('span.antall');
      const sperre = h('span.sperre');
      const el = h('button.bokfelt.frifelt', {
        type: 'button',
        'data-sett': 'ja',
        style: { '--sjelden': SJELDENHET[ting.sjelden].farge },
        onclick: () => paaTrykk(ting),
        oncontextmenu: (e) => { e.preventDefault(); visTing(ting); },
      },
      ikon(ting.ikon),
      h('span.navn', ting.navn),
      teller,
      sperre);
      felter.set(ting.id, { el, teller, sperre });
      rutenett.append(el);
      oppdaterFelt(ting.id, f);
    });
    oppdaterNedtelling();
  }

  function oppdaterFelt(tingId, f = hentFrimodus()) {
    const bit = felter.get(tingId);
    if (!bit) return;
    const n = f.antall[tingId] || 0;
    bit.teller.textContent = n ? String(n) : '';
    bit.teller.style.display = n ? '' : 'none';
    const eier = f.sisteAv[tingId];
    const d = f.deltakere.find((x) => x.spillerId === eier);
    bit.el.style.setProperty('--spillerfarge', d ? fargeHex(d.farge) : '');
    bit.el.dataset.funnet = n ? 'ja' : 'nei';
    if (bit.teller.style.display === '') bit.teller.style.background = d ? fargeHex(d.farge) : '';
  }

  /** Tikker ned sperren på feltene som er låst akkurat nå. */
  function oppdaterNedtelling() {
    if (!rutenett.isConnected) return false;
    const f = hentFrimodus();
    const na = Date.now();
    let noenSperret = false;
    for (const [tingId, bit] of felter) {
      const sist = f.sistFunn[tingId];
      const igjen = sist ? Math.max(0, Math.ceil((SPERRE_MS - (na - sist)) / 1000)) : 0;
      if (igjen > 0) {
        noenSperret = true;
        bit.el.dataset.sperret = 'ja';
        bit.sperre.textContent = String(igjen);
        bit.el.setAttribute('aria-disabled', 'true');
      } else if (bit.el.dataset.sperret === 'ja') {
        bit.el.dataset.sperret = 'nei';
        bit.sperre.textContent = '';
        bit.el.removeAttribute('aria-disabled');
      }
    }
    if (noenSperret && !nedtelling) startTikking(oppdaterNedtelling);
    return noenSperret;
  }

  // ------------------------------------------------------------- handling

  function paaTrykk(ting) {
    const d = hentFrimodus().deltakere[aktivSpiller];
    const r = registrer(ting.id, d.spillerId);
    if (!r) return;

    if (r.sperret) {
      // Ikke et nederlag — bare en beskjed om at den allerede er talt.
      LYD.stopp();
      rop(ting.ikon, ting.navn, `Talt allerede — vent ${r.sekunder} sek`);
      const bit = felter.get(ting.id);
      bit?.el.classList.remove('rist');
      requestAnimationFrame(() => bit?.el.classList.add('rist'));
      return;
    }

    si(ting.navn.replace(/!$/, ''));
    if (ting.sjelden === 5) LYD.krysLegendarisk();
    else if (ting.sjelden === 4) LYD.krysSjelden();
    else LYD.kryss();

    const bit = [];
    if (r.forsteGang) bit.push('Ny i spottboka!');
    bit.push(r.antall === 1 ? 'første gang' : `${r.antall}. gang`);
    bit.push(`+${r.poeng} p`);
    rop(ting.ikon, ting.navn, bit.join(' · '));

    oppdaterFelt(ting.id);
    oppdaterNedtelling();
    tegnSum();
    tegnVelger();
    angreknapp.disabled = false;
    if (filter === 'mangler' || filter === 'funnet') byggRutenett();

    if (r.nyeMerker.length) setTimeout(() => visMerker(r.nyeMerker), 900);
    if (r.antall === 10) setTimeout(() => feire(`10 × ${ting.navn}`), 400);
  }

  function paaAngre() {
    const r = angreSiste();
    if (!r) return;
    LYD.angre();
    rop(r.ting.ikon, r.ting.navn, 'Angret');
    oppdaterFelt(r.ting.id);
    oppdaterNedtelling();
    tegnSum();
    tegnVelger();
    angreknapp.disabled = !hentFrimodus().logg.length;
    if (filter === 'mangler' || filter === 'funnet') byggRutenett();
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

  function visTing(ting) {
    const f = hentFrimodus();
    const n = f.antall[ting.id] || 0;
    const lukk = ark([
      h('div.hode', {},
        h('span.stortikon', {}, ikon(ting.ikon)),
        h('div', {}, h('h2', ting.navn),
          h('p.liten.svak', `${KATEGORIER[ting.kat].navn} · ${SJELDENHET[ting.sjelden].navn}`))),
      h('div.tallrad', {},
        h('div.tall', {}, h('b', String(n)), h('span', n === 1 ? 'gang i frimodus' : 'ganger i frimodus')),
        h('div.tall', {}, h('b', String(POENG[ting.sjelden])), h('span', 'poeng per funn')),
        h('div.tall', {}, h('b', String(n * POENG[ting.sjelden])), h('span', 'poeng i alt'))),
      knapp('Lukk', { klasse: 'stor full', onclick: () => lukk() }),
    ]);
  }

  function visMeny() {
    const o = oppsummering();
    const f = hentFrimodus();
    const topp = Object.entries(f.antall).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const lukk = ark([
      h('h2', 'Frimodus'),
      h('p.svak', `Startet ${f.startet ? new Date(f.startet).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' }) : '–'}. Tallene her huskes til dere nullstiller dem selv.`),
      h('div.tallrad', {},
        h('div.tall', {}, h('b', String(o.totalt)), h('span', 'funn')),
        h('div.tall', {}, h('b', String(o.ulike)), h('span', 'forskjellige')),
        h('div.tall', {}, h('b', String(o.poeng)), h('span', 'poeng'))),
      topp.length ? h('div', {},
        h('h3', { style: { marginBottom: '8px' } }, 'Mest sett'),
        h('div.kortliste', {}, topp.map(([id, n]) => {
          const ting = TING.find((x) => x.id === id);
          return h('div.valgkort', { style: { minHeight: '62px' } },
            h('span.merke', {}, ikon(ting.ikon)),
            h('span.tekst', {}, h('b', ting.navn), h('span.liten.svak', `${n} ${n === 1 ? 'gang' : 'ganger'}`)));
        }))) : null,
      h('div.kortliste', {},
        knapp('Bytt spillere', { klasse: 'stor', onclick: () => { lukk(); gaaTil('oppsett'); } }),
        knapp('Spottboka', { klasse: 'stor', sym: 'bok', onclick: () => { lukk(); gaaTil('spottbok'); } }),
        knapp('Nullstill tellingen', {
          klasse: 'stor fare',
          onclick: async () => {
            lukk();
            if (await bekreft({
              tittel: 'Nullstille frimodus?',
              tekst: 'Alle tallene settes til null. Spottboka og merkene beholder dere.',
              ja: 'Nullstill', fare: true,
            })) {
              nullstillFrimodus();
              LYD.nyttStopp();
              tegnPaaNytt();
            }
          },
        })),
    ]);
  }

  tegnSum();
  tegnVelger();
  byggRutenett();

  return h('div.skjerm', {},
    h('div.topplinje', {},
      tilbakeknapp(() => gaaTil('start')),
      h('h2', 'Frimodus'),
      angreknapp,
      h('button.knapp.ikonknapp', { type: 'button', 'aria-label': 'Meny', onclick: visMeny }, symbol('tannhjul'))),
    h('div.innhold.friinnhold', {},
      h('div.kort.frikort', {}, sumEl),
      velger,
      filterrad,
      h('p.liten.svak', 'Ser dere den samme tingen igjen, trykk igjen. Hvert felt låses i 30 sekunder etterpå.'),
      rutenett));
}
