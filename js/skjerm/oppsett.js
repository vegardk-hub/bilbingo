// Oppsett av en tur. Skal gå unna — noen sitter allerede i bilen og venter.

import { h, knapp, ikon, symbol, tilbakeknapp, ark, bekreft } from '../kjerne/ui.js';
import { les, endre } from '../kjerne/lager.js';
import { FARGER, MODUS, nyttSpill } from '../kjerne/spill.js';
import { startFrimodus } from '../kjerne/frimodus.js';
import { NIVAA } from '../kjerne/brett.js';
import { RUTER } from '../data/ruter.js';
import { gyldigKode } from '../kjerne/tilfeldig.js';
import { LYD } from '../kjerne/lyd.js';
import { gaaTil } from '../app.js';

let valgtModus = 'sammen';
let valgtRute = 'hytta';
let valgteIder = null;
let delekode = '';

function nyId() { return `s${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`; }

function ledigFarge(brukt) {
  return FARGER.find((f) => !brukt.includes(f.id)) || FARGER[0];
}

function spillerArk(spiller, vedLagring) {
  const t = les();
  const erNy = !spiller;
  const data = spiller
    ? { ...spiller }
    : { id: nyId(), navn: '', farge: ledigFarge(t.spillere.map((s) => s.farge)).id, nivaaId: 2 };

  const navnfelt = h('input.pille', {
    type: 'text',
    value: data.navn,
    placeholder: 'Navn',
    maxlength: 14,
    autocomplete: 'off',
    style: { width: '100%', minHeight: '60px', padding: '12px 18px', fontSize: '1.05em', fontWeight: '700' },
    oninput: (e) => { data.navn = e.target.value; },
  });

  const fargerad = h('div.pillerad');
  FARGER.forEach((f) => {
    const b = h('button.pille', {
      type: 'button',
      'aria-pressed': String(data.farge === f.id),
      style: { '--farge': f.hex, borderColor: data.farge === f.id ? f.hex : '', minWidth: '0' },
      onclick: () => {
        data.farge = f.id;
        [...fargerad.children].forEach((c, i) => {
          c.setAttribute('aria-pressed', String(FARGER[i].id === f.id));
          c.style.borderColor = FARGER[i].id === f.id ? FARGER[i].hex : '';
        });
      },
    }, h('span.prikk', { style: { '--farge': f.hex } }), f.navn);
    fargerad.append(b);
  });

  const nivaaliste = h('div.kortliste');
  NIVAA.forEach((n) => {
    const b = h('button.valgkort', {
      type: 'button',
      'aria-pressed': String(data.nivaaId === n.id),
      onclick: () => {
        data.nivaaId = n.id;
        [...nivaaliste.children].forEach((c, i) => c.setAttribute('aria-pressed', String(NIVAA[i].id === n.id)));
      },
    },
    h('span.merke', {}, h('b', { style: { fontSize: '1.1rem' } }, `${n.rader}×${n.kolonner}`)),
    h('span.tekst', {}, h('b', `${n.navn} · ${n.alder}`), h('span.liten.svak', n.hint)));
    nivaaliste.append(b);
  });

  const lukk = ark([
    h('h2', erNy ? 'Ny spiller' : 'Endre spiller'),
    navnfelt,
    h('div', {}, h('h3', { style: { marginBottom: '8px' } }, 'Farge'), fargerad),
    h('div', {},
      h('h3', { style: { marginBottom: '8px' } }, 'Nivå'),
      h('p.liten.svak', { style: { marginBottom: '10px' } },
        'Nivået bestemmer hvor stort brettet er og hvor sjeldne tingene er. Det er dette som gjør at en på fire og en på ni kan spille mot hverandre.'),
      nivaaliste),
    h('div.kortliste', {},
      knapp('Lagre', {
        klasse: 'stor hoved', onclick: () => {
          data.navn = data.navn.trim() || `Spiller ${t.spillere.length + 1}`;
          lukk();
          vedLagring(data);
        },
      }),
      !erNy ? knapp('Slett spiller', {
        klasse: 'fare', onclick: async () => {
          if (await bekreft({ tittel: `Slette ${data.navn}?`, ja: 'Slett', fare: true })) {
            lukk();
            vedLagring(null, data.id);
          }
        },
      }) : null),
  ]);
}

export function tegn() {
  const t = les();
  if (!valgteIder) valgteIder = t.spillere.map((s) => s.id);
  const valgt = () => t.spillere.filter((s) => valgteIder.includes(s.id));

  const innhold = h('div.innhold');

  // ---------- spillere
  const spillerliste = h('div.kortliste');
  function tegnSpillere() {
    spillerliste.replaceChildren();
    const s = les().spillere;
    s.forEach((sp) => {
      const f = FARGER.find((x) => x.id === sp.farge) || FARGER[0];
      const niv = NIVAA.find((n) => n.id === sp.nivaaId) || NIVAA[1];
      const med = valgteIder.includes(sp.id);
      spillerliste.append(h('div.valgkort', { 'aria-pressed': String(med), style: { gap: '10px' } },
        h('button', {
          type: 'button',
          'aria-label': med ? `Ta ut ${sp.navn}` : `Ta med ${sp.navn}`,
          style: { display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '0', textAlign: 'left', minHeight: '56px' },
          onclick: () => {
            if (med) valgteIder = valgteIder.filter((x) => x !== sp.id);
            else valgteIder.push(sp.id);
            tegnSpillere();
            oppdaterStart();
          },
        },
        h('span.merke', { style: { background: med ? f.hex : 'var(--flate-2)', color: '#fff' } },
          med ? symbol('hake', '') : null),
        h('span.tekst', {}, h('b', sp.navn), h('span.liten.svak', `${niv.navn} · ${niv.rader}×${niv.kolonner}`))),
        h('button.knapp.ikonknapp', {
          type: 'button', 'aria-label': `Endre ${sp.navn}`,
          onclick: () => spillerArk(sp, (data, slettId) => {
            endre((st) => {
              if (slettId) st.spillere = st.spillere.filter((x) => x.id !== slettId);
              else {
                const i = st.spillere.findIndex((x) => x.id === data.id);
                if (i >= 0) st.spillere[i] = data;
              }
            });
            if (slettId) valgteIder = valgteIder.filter((x) => x !== slettId);
            tegnSpillere();
            oppdaterStart();
          }),
        }, symbol('blyant'))));
    });
    if (!s.length) {
      spillerliste.append(h('p.liten.svak.midt', 'Legg til alle som skal være med i bilen.'));
    }
    spillerliste.append(knapp('Legg til spiller', {
      klasse: 'full', sym: 'pluss',
      onclick: () => spillerArk(null, (data) => {
        endre((st) => st.spillere.push(data));
        valgteIder.push(data.id);
        tegnSpillere();
        oppdaterStart();
      }),
    }));
  }

  // ---------- modus
  const MODUSIKON = { sammen: 'vinker', mot: 'fart80', fri: 'postkasser' };
  const modusliste = h('div.kortliste');
  Object.values(MODUS).forEach((m) => {
    modusliste.append(h('button.valgkort', {
      type: 'button',
      'aria-pressed': String(valgtModus === m.id),
      onclick: () => {
        valgtModus = m.id;
        [...modusliste.children].forEach((c, i) => c.setAttribute('aria-pressed', String(Object.values(MODUS)[i].id === m.id)));
        oppdaterModus();
      },
    },
    h('span.merke', {}, ikon(MODUSIKON[m.id])),
    h('span.tekst', {}, h('b', m.navn), h('span.liten.svak', m.lang))));
  });

  // ---------- rute
  const ruteliste = h('div.kortliste');
  RUTER.forEach((r) => {
    ruteliste.append(h('button.valgkort', {
      type: 'button',
      'aria-pressed': String(valgtRute === r.id),
      onclick: () => {
        valgtRute = r.id;
        [...ruteliste.children].forEach((c, i) => c.setAttribute('aria-pressed', String(RUTER[i].id === r.id)));
      },
    },
    h('span.merke', {}, h('b', { style: { fontSize: '0.8rem' } }, `${r.lengde}`)),
    h('span.tekst', {}, h('b', r.navn), h('span.liten.svak', r.undertittel))));
  });

  // ---------- startknapp
  const startknapp = knapp('Kjør!', {
    klasse: 'stor hoved full', sym: 'spill',
    onclick: () => {
      const med = valgt();
      if (!med.length) return;
      LYD.nyttStopp();
      if (valgtModus === 'fri') {
        startFrimodus(med);
        gaaTil('frimodus');
        return;
      }
      nyttSpill({ modus: valgtModus, spillere: med, ruteId: valgtRute, kode: gyldigKode(delekode) });
      gaaTil('spill');
    },
  });

  function oppdaterStart() {
    const n = valgteIder.length;
    startknapp.disabled = n === 0;
    startknapp.querySelector('span:last-child').textContent = n ? `Kjør! (${n} ${n === 1 ? 'spiller' : 'spillere'})` : 'Velg minst én spiller';
  }

  // Frimodus har verken rute eller brett, så begge de valgene skjules.
  const ruteseksjon = h('section');
  const delingsboks = h('details.kort');
  function oppdaterModus() {
    const fri = valgtModus === 'fri';
    ruteseksjon.hidden = fri;
    delingsboks.hidden = fri;
  }

  tegnSpillere();
  oppdaterStart();

  ruteseksjon.append(
    h('h2', { style: { marginBottom: '4px' } }, 'Hvor skal dere?'),
    h('p.liten.svak', { style: { marginBottom: '10px' } },
      'Poengene dere samler blir kilometer. Velg en strekning som passer til hvor lenge dere skal kjøre.'),
    ruteliste,
  );

  delingsboks.append(
    h('summary', { style: { fontWeight: '700', minHeight: '44px', display: 'flex', alignItems: 'center' } },
      'Flere nettbrett i bilen?'),
    h('p.liten.svak', { style: { margin: '10px 0' } },
      'Skriv inn samme kode på hver enhet, så trekkes brettene fra samme stokk — men alle får sitt eget brett. Ingen nett trengs.'),
    h('input.pille', {
      type: 'text', placeholder: 'Kode, f.eks. K7F2', maxlength: 4, autocapitalize: 'characters', autocomplete: 'off',
      style: { width: '100%', minHeight: '58px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '800', textAlign: 'center' },
      oninput: (e) => { delekode = e.target.value.toUpperCase(); },
    }),
  );

  oppdaterModus();

  innhold.append(
    h('section', {}, h('h2', { style: { marginBottom: '10px' } }, 'Hvem er med?'), spillerliste),
    h('section', {}, h('h2', { style: { marginBottom: '10px' } }, 'Hvordan spiller dere?'), modusliste),
    ruteseksjon,
    delingsboks,
  );

  return h('div.skjerm', {},
    h('div.topplinje', {}, tilbakeknapp(() => gaaTil('start')), h('h2', 'Ny tur')),
    innhold,
    h('div.bunnlinje', {}, startknapp));
}
