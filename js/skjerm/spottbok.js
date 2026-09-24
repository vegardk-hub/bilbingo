// Spottboka — det lange laget. Alt dere noen gang har sett samles her, og
// blir liggende mellom turene. Det er dette som gjør at tur nummer tolv
// fortsatt har noe å strekke seg etter.

import { h, knapp, ikon, tilbakeknapp, ark, tom } from '../kjerne/ui.js';
import { les } from '../kjerne/lager.js';
import { TING, KATEGORIER, SJELDENHET, POENG } from '../data/ting.js';
import { MERKER } from '../data/merker.js';
import { RUTE_ETTER_ID } from '../data/ruter.js';
import { hentAktivt } from '../kjerne/spill.js';
import { gaaTil } from '../app.js';

let fane = 'samling';
let filter = 'alle';

function dato(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function tingArk(ting, oppfort) {
  const lukk = ark([
    h('div.hode', {},
      h('span.stortikon', {}, ikon(ting.ikon)),
      h('div', {},
        h('h2', ting.navn),
        h('p.liten.svak', `${KATEGORIER[ting.kat].navn} · ${SJELDENHET[ting.sjelden].navn}`))),
    h('div.tallrad', {},
      h('div.tall', {}, h('b', String(POENG[ting.sjelden])), h('span', 'poeng')),
      h('div.tall', {}, h('b', String(oppfort?.antall || 0)), h('span', 'ganger sett')),
      h('div.tall', {}, h('b', oppfort ? dato(oppfort.forste).split(' ')[0] : '–'),
        h('span', oppfort ? dato(oppfort.forste).split(' ').slice(1).join(' ') : 'ikke sett')),
    ),
    ting.sesong ? h('p.liten.svak', `Sees bare om ${ting.sesong.map((s) => ({ var: 'våren', sommer: 'sommeren', host: 'høsten', vinter: 'vinteren' }[s])).join(' og ')}.`) : null,
    ting.sted ? h('p.liten.svak', `Finnes mest ${ting.sted.map((s) => ({ kyst: 'ved sjøen', fjell: 'på fjellet', by: 'i byen', bygd: 'på landet' }[s])).join(' og ')}.`) : null,
    ting.tid === 'natt' ? h('p.liten.svak', 'Sees bare i mørket.') : null,
    knapp('Lukk', { klasse: 'stor full', onclick: () => lukk() }),
  ]);
}

function samling(t) {
  const sett = t.spottbok.sett;
  const boks = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } });

  const filterrad = h('div.pillerad');
  const valg = [['alle', 'Alle'], ['mangler', 'Mangler'], ...Object.entries(KATEGORIER).map(([k, v]) => [k, v.navn])];
  valg.forEach(([id, navn]) => {
    filterrad.append(h('button.pille', {
      type: 'button',
      'aria-pressed': String(filter === id),
      onclick: () => { filter = id; tegnRute(); [...filterrad.children].forEach((c, i) => c.setAttribute('aria-pressed', String(valg[i][0] === id))); },
    }, navn));
  });

  const rute = h('div.rutenett');
  function tegnRute() {
    let liste = TING;
    if (filter === 'mangler') liste = TING.filter((x) => !sett[x.id]);
    else if (filter !== 'alle') liste = TING.filter((x) => x.kat === filter);
    rute.replaceChildren();
    if (!liste.length) { rute.append(tom('Alt er funnet her!', 'Prøv en annen kategori.')); return; }
    liste.forEach((x) => {
      const o = sett[x.id];
      rute.append(h('button.bokfelt', {
        type: 'button',
        'data-sett': o ? 'ja' : 'nei',
        style: { '--sjelden': SJELDENHET[x.sjelden].farge },
        onclick: () => tingArk(x, o),
      },
      ikon(x.ikon),
      h('span.navn', x.navn),
      o && o.antall > 1 ? h('span.antall', String(o.antall)) : null));
    });
  }
  tegnRute();

  const antall = Object.keys(sett).length;
  boks.append(
    h('div.kort', {},
      h('div.rad.mellom', {}, h('b', 'Samlingen'), h('span.liten.svak', `${antall} av ${TING.length}`)),
      h('div.stolpe', { style: { marginTop: '10px' } }, h('i', { style: { width: `${(antall / TING.length) * 100}%` } }))),
    filterrad,
    rute,
  );
  return boks;
}

function merker(t) {
  const tatt = new Set(t.spottbok.merker);
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
    h('div.kort', {},
      h('div.rad.mellom', {}, h('b', 'Merker'), h('span.liten.svak', `${tatt.size} av ${MERKER.length}`)),
      h('div.stolpe', { style: { marginTop: '10px' } }, h('i', { style: { width: `${(tatt.size / MERKER.length) * 100}%` } }))),
    h('div.merkerute', {}, MERKER.map((m) => h('div.merkekort', { 'data-tatt': tatt.has(m.id) ? 'ja' : 'nei' },
      ikon(m.ikon), h('b', m.navn), h('span', m.tekst)))),
  );
}

function turer(t) {
  const st = t.spottbok.statistikk;
  const liste = [...t.spottbok.turer].reverse();
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
    h('div.tallrad', {},
      h('div.tall', {}, h('b', String(Math.round(st.km))), h('span', 'kilometer totalt')),
      h('div.tall', {}, h('b', String(st.bingoer)), h('span', 'bingoer')),
      h('div.tall', {}, h('b', String(st.fullePlater)), h('span', 'fulle plater'))),
    h('div.tallrad', {},
      h('div.tall', {}, h('b', String(t.spottbok.turer.length)), h('span', 'turer')),
      h('div.tall', {}, h('b', String(st.tunneler || 0)), h('span', 'tunneler')),
      h('div.tall', {}, h('b', String(st.ferjer || 0)), h('span', 'ferjer'))),
    liste.length
      ? h('div.kortliste', {}, liste.map((tur) => {
        const r = RUTE_ETTER_ID[tur.rute];
        return h('div.valgkort', { style: { minHeight: '70px' } },
          h('span.merke', {}, ikon('kmStolpe')),
          h('span.tekst', {},
            h('b', r ? r.navn : 'Tur'),
            h('span.liten.svak', `${dato(tur.dato)} · ${tur.km} km · ${tur.runder} ${tur.runder === 1 ? 'brett' : 'brett'}`),
            tur.deltakere?.length
              ? h('span.liten.svak', tur.deltakere.map((d) => `${d.navn} ${d.poeng}p`).join(' · '))
              : null));
      }))
      : tom('Ingen turer avsluttet ennå', 'Turer dukker opp her når dere avslutter dem.'),
  );
}

export function tegn() {
  const t = les();
  const aktivt = hentAktivt();
  const innhold = h('div.innhold');

  const faner = [['samling', 'Samling'], ['merker', 'Merker'], ['turer', 'Turer']];
  const fanerad = h('div.pillerad');
  faner.forEach(([id, navn]) => {
    fanerad.append(h('button.pille', {
      type: 'button',
      'aria-pressed': String(fane === id),
      onclick: () => { fane = id; tegnInnhold(); [...fanerad.children].forEach((c, i) => c.setAttribute('aria-pressed', String(faner[i][0] === id))); },
    }, navn));
  });

  const kropp = h('div');
  function tegnInnhold() {
    kropp.replaceChildren(fane === 'samling' ? samling(t) : fane === 'merker' ? merker(t) : turer(t));
  }
  tegnInnhold();

  innhold.append(fanerad, kropp);

  return h('div.skjerm', {},
    h('div.topplinje', {}, tilbakeknapp(() => gaaTil(aktivt ? 'spill' : 'start')), h('h2', 'Spottboka')),
    innhold);
}
