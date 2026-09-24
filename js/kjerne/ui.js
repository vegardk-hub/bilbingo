// Små byggeklosser for skjermene. Ingen rammeverk — appen skal starte
// umiddelbart, også på en gammel iPad uten dekning.

import { IKONER, UKJENT_IKON } from '../data/ikoner.js';

/** h('div.kort', { onclick }, barn...) */
export function h(velger, attr = null, ...barn) {
  const [tag, ...klasser] = velger.split('.');
  const el = document.createElement(tag || 'div');
  if (klasser.length) el.className = klasser.join(' ');
  if (attr && (typeof attr !== 'object' || attr instanceof Node || Array.isArray(attr))) {
    barn.unshift(attr);
    attr = null;
  }
  for (const [k, v] of Object.entries(attr || {})) {
    if (v === null || v === undefined || v === false) continue;
    // Object.assign hopper over egendefinerte egenskaper (--farge og slike),
    // så de må settes eksplisitt.
    if (k === 'style' && typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) {
        if (sk.startsWith('--')) el.style.setProperty(sk, sv);
        else el.style[sk] = sv;
      }
    }
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'tekst') el.textContent = v;
    else if (k === 'class') el.className += ` ${v}`;
    else if (k in el && k !== 'list' && typeof v !== 'object') el[k] = v;
    else el.setAttribute(k, v);
  }
  for (const b of barn.flat(4)) {
    if (b === null || b === undefined || b === false) continue;
    el.append(b instanceof Node ? b : document.createTextNode(String(b)));
  }
  return el;
}

export function ikon(navn, klasse = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  if (klasse) svg.setAttribute('class', klasse);
  svg.innerHTML = IKONER[navn] || UKJENT_IKON;
  return svg;
}

/** Grensesnitt-symboler (piler, haker) — enkle strektegninger, ikke motiver. */
const SYMBOL = {
  tilbake: '<path d="M62 20 L32 50 L62 80" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>',
  kryss: '<path d="M26 26 L74 74 M74 26 L26 74" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round"/>',
  hake: '<path d="M22 52 L42 72 L80 30" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>',
  hakeSirkel: '<circle cx="50" cy="50" r="40" fill="currentColor"/><path d="M30 52 L44 66 L72 36" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>',
  angre: '<path d="M24 34 L24 56 L46 56" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 50 A28 28 0 1 1 34 74" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>',
  pluss: '<path d="M50 24 L50 76 M24 50 L76 50" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round"/>',
  tannhjul: '<circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="10"/><path d="M50 12 L50 24 M50 76 L50 88 M12 50 L24 50 M76 50 L88 50 M23 23 L32 32 M68 68 L77 77 M77 23 L68 32 M32 68 L23 77" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>',
  bok: '<path d="M18 20 L46 26 L46 82 L18 76 Z M82 20 L54 26 L54 82 L82 76 Z" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/><path d="M50 26 L50 82" stroke="currentColor" stroke-width="6"/>',
  pause: '<rect x="30" y="24" width="14" height="52" rx="5" fill="currentColor"/><rect x="56" y="24" width="14" height="52" rx="5" fill="currentColor"/>',
  spill: '<path d="M34 24 L78 50 L34 76 Z" fill="currentColor"/>',
  pil: '<path d="M30 20 L60 50 L30 80" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>',
  stjerne: '<path d="M50 10 L61 38 L92 40 L68 60 L76 90 L50 73 L24 90 L32 60 L8 40 L39 38 Z" fill="currentColor"/>',
  blyant: '<path d="M22 78 L20 80 L30 78 L78 30 A9 9 0 0 0 66 18 L18 66 Z" fill="none" stroke="currentColor" stroke-width="9" stroke-linejoin="round"/><path d="M60 24 L74 38" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>',
  nytt: '<path d="M50 14 A36 36 0 1 0 82 34" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M84 10 L84 36 L58 36" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>',
};

export function symbol(navn, klasse = 'ik') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', klasse);
  svg.innerHTML = SYMBOL[navn] || '';
  return svg;
}

export function knapp(tekst, { klasse = '', sym = null, ikonNavn = null, ...rest } = {}) {
  return h(
    `button.knapp${klasse ? `.${klasse.split(' ').join('.')}` : ''}`,
    { type: 'button', ...rest },
    sym ? symbol(sym) : null,
    ikonNavn ? ikon(ikonNavn, 'ik') : null,
    tekst ? h('span', tekst) : null,
  );
}

export function tilbakeknapp(handling) {
  return h(
    'button.knapp.ikonknapp',
    { type: 'button', onclick: handling, 'aria-label': 'Tilbake' },
    symbol('tilbake'),
  );
}

/** Ark = panelet som sklir opp nedenfra. Returnerer en lukk-funksjon. */
export function ark(innhold, { lukkbar = true, vedLukk = null } = {}) {
  const boks = h('div.ark', {}, innhold);
  const bak = h('div.ark-bak', {
    onclick: (e) => { if (lukkbar && e.target === bak) lukk(); },
  }, boks);
  function lukk() {
    bak.remove();
    document.removeEventListener('keydown', paaTast);
    vedLukk?.();
  }
  function paaTast(e) { if (e.key === 'Escape' && lukkbar) lukk(); }
  document.addEventListener('keydown', paaTast);
  document.body.append(bak);
  return lukk;
}

export function bekreft({ tittel, tekst, ja = 'Ja', nei = 'Avbryt', fare = false }) {
  return new Promise((los) => {
    const lukk = ark(
      [
        h('h2', tittel),
        tekst ? h('p.svak', tekst) : null,
        h('div.kortliste', {},
          knapp(ja, { klasse: fare ? 'stor fare' : 'stor hoved', onclick: () => { lukk(); los(true); } }),
          knapp(nei, { klasse: 'stor', onclick: () => { lukk(); los(false); } })),
      ],
      { vedLukk: () => los(false) },
    );
  });
}

/** «Rop det høyt»-stripa øverst. Alle i bilen skal se hva som ble krysset av. */
let ropeEl = null;
let ropeTid = null;
export function rop(ikonNavn, ord, undertekst = '') {
  ropeEl?.remove();
  ropeEl = h('div.rope', { role: 'status' },
    ikon(ikonNavn),
    h('div', {},
      h('div.ord', ord),
      undertekst ? h('div.poeng', undertekst) : null));
  document.body.append(ropeEl);
  clearTimeout(ropeTid);
  const min = ropeEl;
  ropeTid = setTimeout(() => {
    min.classList.add('ut');
    setTimeout(() => min.remove(), 260);
  }, 1700);
}

/** Stor feiring midt på skjermen, med konfetti. */
export function feire(ord, { farger = ['#FFC93C', '#E63946', '#1F6FEB', '#17A06B', '#8E44C9'], tid = 1900 } = {}) {
  const lerret = h('canvas');
  const boks = h('div.feiring', {}, lerret, h('div.ord', ord));
  document.body.append(boks);
  konfetti(lerret, farger);
  setTimeout(() => boks.remove(), tid);
}

function konfetti(lerret, farger) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const k = lerret.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const b = (lerret.width = Math.floor(innerWidth * dpr));
  const hy = (lerret.height = Math.floor(innerHeight * dpr));
  // Under 100 partikler holder 60 bilder i sekundet også på eldre nettbrett.
  const biter = Array.from({ length: 90 }, () => ({
    x: b / 2 + (Math.random() - 0.5) * b * 0.5,
    y: hy * 0.42,
    vx: (Math.random() - 0.5) * 16 * dpr,
    vy: (Math.random() - 1.15) * 15 * dpr,
    r: (3 + Math.random() * 5) * dpr,
    f: farger[(Math.random() * farger.length) | 0],
    v: Math.random() * Math.PI,
    dv: (Math.random() - 0.5) * 0.3,
  }));
  let bilder = 0;
  (function tegn() {
    bilder += 1;
    k.clearRect(0, 0, b, hy);
    for (const p of biter) {
      p.vy += 0.42 * dpr;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.v += p.dv;
      k.save();
      k.translate(p.x, p.y);
      k.rotate(p.v);
      k.fillStyle = p.f;
      k.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
      k.restore();
    }
    if (bilder < 130 && lerret.isConnected) requestAnimationFrame(tegn);
  })();
}

export function tom(melding, undertekst = '') {
  return h('div.tomt', {}, h('p', h('b', melding)), undertekst ? h('p.liten', undertekst) : null);
}

export function stolpe(andel, { tynn = false } = {}) {
  return h(`div.stolpe${tynn ? '.tynn' : ''}`, {}, h('i', { style: { width: `${Math.round(andel * 100)}%` } }));
}

export function bryter(tekst, pa, vedEndring, undertekst = '') {
  const el = h('button.bryter', {
    type: 'button',
    'aria-pressed': String(!!pa),
    onclick: () => {
      const ny = el.getAttribute('aria-pressed') !== 'true';
      el.setAttribute('aria-pressed', String(ny));
      vedEndring(ny);
    },
  },
  h('span.voks', {}, h('b', tekst), undertekst ? h('div.liten.svak', undertekst) : null),
  h('span.vipp'));
  return el;
}

export function tomFor(el) {
  while (el.firstChild) el.firstChild.remove();
  return el;
}
