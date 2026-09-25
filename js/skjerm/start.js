// Startskjermen. Skal gi ett tydelig valg: kom i gang.

import { h, knapp, ikon, symbol, stolpe } from '../kjerne/ui.js';
import { les } from '../kjerne/lager.js';
import { hentAktivt } from '../kjerne/spill.js';
import { erIGang, oppsummering } from '../kjerne/frimodus.js';
import { RUTE_ETTER_ID, posisjon } from '../data/ruter.js';
import { TING } from '../data/ting.js';
import { gaaTil } from '../app.js';

function veiscene() {
  // Liten forside-illustrasjon: en vei som forsvinner mot horisonten.
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 320 150');
  svg.setAttribute('class', 'forside');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `
    <defs>
      <linearGradient id="himmel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7EC8F2"/><stop offset="1" stop-color="#CFEAFB"/>
      </linearGradient>
    </defs>
    <rect width="320" height="150" fill="url(#himmel)"/>
    <circle cx="268" cy="34" r="17" fill="#FFC93C"/>
    <path d="M0 96 L56 52 L92 96 Z" fill="#7C8AA3"/>
    <path d="M56 52 L74 74 L38 74 Z" fill="#F4F9FF"/>
    <path d="M78 96 L128 58 L172 96 Z" fill="#94A2BA"/>
    <path d="M128 58 L144 78 L112 78 Z" fill="#F4F9FF"/>
    <path d="M198 96 L246 62 L290 96 Z" fill="#7C8AA3"/>
    <rect y="94" width="320" height="56" fill="#6BCB77"/>
    <path d="M142 94 L178 94 L262 150 L42 150 Z" fill="#4A4E69"/>
    <path d="M158 96 L162 104 M156 110 L164 124 M152 132 L168 150" stroke="#FFC93C" stroke-width="4" stroke-linecap="round"/>
    <g>
      <path d="M186 138 L186 130 C186 128 187 127 189 127 L198 126 L204 119 C205 118 206 117 208 117 L219 117 C221 117 222 118 223 119 L229 126 L233 127 C235 128 236 129 236 131 L236 138 Z" fill="#E63946"/>
      <path d="M206 120 L205 125 L213 125 L213 120 Z" fill="#BFE6F5"/>
      <path d="M216 120 L216 125 L226 126 L220 120 Z" fill="#BFE6F5"/>
      <circle cx="197" cy="138" r="6" fill="#2B2D42"/><circle cx="226" cy="138" r="6" fill="#2B2D42"/>
      <circle cx="197" cy="138" r="2.5" fill="#D4DBE6"/><circle cx="226" cy="138" r="2.5" fill="#D4DBE6"/>
    </g>
    <g fill="#1B6E4A">
      <path d="M28 96 L36 78 L44 96 Z"/><path d="M30 84 L36 70 L42 84 Z"/><rect x="34" y="94" width="4" height="8" fill="#5C3D24"/>
      <path d="M288 98 L296 78 L304 98 Z"/><path d="M290 85 L296 70 L302 85 Z"/><rect x="294" y="96" width="4" height="8" fill="#5C3D24"/>
    </g>
    <path d="M96 30 q6 -8 12 0 q6 -8 12 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>`;
  return svg;
}

export function tegn() {
  const t = les();
  const aktivt = hentAktivt();
  const settAntall = Object.keys(t.spottbok.sett).length;
  const friIGang = erIGang();
  const { ulike: friUlike, totalt: friTotalt } = oppsummering();

  const innhold = h('div.innhold');

  innhold.append(
    h('div.forsideboks', {}, veiscene()),
    h('div.midt', {},
      h('h1', 'Bilbingo'),
      h('p.svak', 'Se ut av vinduet. Rop det du ser.')),
  );

  if (aktivt) {
    const rute = RUTE_ETTER_ID[aktivt.ruteId];
    const pos = posisjon(rute, aktivt.km);
    innhold.append(
      h('div.kort', {},
        h('div.rad.mellom', {},
          h('div', {}, h('b', 'Turen er i gang'), h('div.liten.svak', `${rute.navn} · runde ${aktivt.runde}`)),
          h('span.merkelapp', {}, h('span.kode', aktivt.kode))),
        h('div.rad', { style: { marginTop: '12px' } },
          stolpe(pos.andel),
          h('span.liten.svak', `${Math.round(aktivt.km)} km`)),
        h('div', { style: { marginTop: '14px' } },
          knapp('Fortsett turen', { klasse: 'stor hoved full', sym: 'spill', onclick: () => gaaTil('spill') }))),
    );
  }

  const friOppsummering = friIGang
    ? `${friTotalt} funn · ${friUlike} forskjellige`
    : 'Ingen brett — kryss av alt dere ser';

  innhold.append(
    h('div.kortliste', {},
      knapp(aktivt ? 'Start en ny tur' : 'Start en tur', {
        klasse: aktivt ? 'stor full' : 'stor hoved full',
        sym: aktivt ? 'nytt' : 'spill',
        onclick: () => gaaTil('oppsett'),
      }),
      h('button.valgkort', {
        type: 'button',
        onclick: () => gaaTil(friIGang ? 'frimodus' : 'oppsett'),
      },
        h('span.merke', {}, ikon('postkasser')),
        h('span.tekst', {}, h('b', friIGang ? 'Fortsett frimodus' : 'Frimodus'),
          h('span.liten.svak', friOppsummering)),
        symbol('pil')),
      h('button.valgkort', { type: 'button', onclick: () => gaaTil('spottbok') },
        h('span.merke', {}, ikon('postkasser')),
        h('span.tekst', {}, h('b', 'Spottboka'),
          h('span.liten.svak', `${settAntall} av ${TING.length} ting funnet`)),
        symbol('pil')),
      h('button.valgkort', { type: 'button', onclick: () => gaaTil('innstillinger') },
        h('span.merke', {}, symbol('tannhjul', 'ik')),
        h('span.tekst', {}, h('b', 'Innstillinger'),
          h('span.liten.svak', 'Lyd, sted, årstid og alder')),
        symbol('pil'))),
    h('div.bunnrad', { style: { marginTop: 'auto', paddingTop: '18px' } },
      h('p.liten.svak.midt', 'Virker uten nett. Ingen reklame, ingen kjøp, ingenting sendes noe sted.'),
      // Diskré med vilje: den skal være lett å finne for en voksen som leter,
      // og lite fristende for en femåring som ikke gjør det.
      h('button.foreldreknapp', {
        type: 'button',
        onclick: () => gaaTil('foreldre'),
      }, symbol('laas'), 'Foreldrekontroll')),
  );

  return h('div.skjerm', {}, innhold);
}
