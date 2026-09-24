// Lager app-ikonene. Ingen bildeverktoy er installert, sa PNG-ene skrives
// direkte med zlib. Motivet er et bingobrett med en gul diagonal og en liten
// rod bil - leselig helt ned i 32 px.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const UT = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'ikoner');
mkdirSync(UT, { recursive: true });

// ---------------------------------------------------------------- PNG

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function bit(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const navn = Buffer.from(type, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([navn, data])));
  return Buffer.concat([len, navn, data, crc]);
}

function skrivPng(bredde, hoyde, piksler) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(bredde, 0);
  ihdr.writeUInt32BE(hoyde, 4);
  ihdr[8] = 8; // 8 bit per kanal
  ihdr[9] = 6; // RGBA
  const rader = Buffer.alloc((bredde * 4 + 1) * hoyde);
  for (let y = 0; y < hoyde; y += 1) {
    rader[y * (bredde * 4 + 1)] = 0;
    piksler.copy(rader, y * (bredde * 4 + 1) + 1, y * bredde * 4, (y + 1) * bredde * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bit('IHDR', ihdr),
    bit('IDAT', deflateSync(rader, { level: 9 })),
    bit('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------- tegning

function lerret(n) {
  return { n, p: Buffer.alloc(n * n * 4) };
}

const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];

function blend(l, x, y, farge, a) {
  if (a <= 0 || x < 0 || y < 0 || x >= l.n || y >= l.n) return;
  const i = (y * l.n + x) * 4;
  const [r, g, b] = farge;
  const ga = l.p[i + 3] / 255;
  const na = a + ga * (1 - a);
  if (na <= 0) return;
  for (let k = 0; k < 3; k += 1) {
    l.p[i + k] = Math.round((farge[k] * a + l.p[i + k] * ga * (1 - a)) / na);
  }
  l.p[i + 3] = Math.round(na * 255);
  void r; void g; void b;
}

// Avstandsfunksjoner + 3x3 kantutjevning gir rene kanter uten et grafikkbibliotek.
function tegnForm(l, farge, avstand) {
  const f = hex(farge);
  for (let y = 0; y < l.n; y += 1) {
    for (let x = 0; x < l.n; x += 1) {
      let treff = 0;
      for (let sy = 0; sy < 3; sy += 1) {
        for (let sx = 0; sx < 3; sx += 1) {
          if (avstand(x + (sx + 0.5) / 3, y + (sy + 0.5) / 3) <= 0) treff += 1;
        }
      }
      if (treff) blend(l, x, y, f, treff / 9);
    }
  }
}

const rundRekt = (x0, y0, b, h, r) => (x, y) => {
  const dx = Math.max(x0 + r - x, 0, x - (x0 + b - r));
  const dy = Math.max(y0 + r - y, 0, y - (y0 + h - r));
  return Math.hypot(dx, dy) - r;
};

const sirkel = (cx, cy, r) => (x, y) => Math.hypot(x - cx, y - cy) - r;

function bingoIkon(n, { maskable = false } = {}) {
  const l = lerret(n);
  const s = n / 512;
  const innhold = maskable ? 0.64 : 0.84; // trygg sone for maskable-ikoner

  // bakgrunn
  if (maskable) tegnForm(l, '#1F6FEB', () => -1);
  else tegnForm(l, '#1F6FEB', rundRekt(0, 0, n, n, 112 * s));

  // en gul vei nederst, sa ikonet ikke bare er et rutenett
  tegnForm(l, '#1249A8', (x, y) => (y > n * 0.78 ? -1 : 1));

  const felt = n * innhold * 0.27;
  const gap = n * innhold * 0.055;
  const total = felt * 3 + gap * 2;
  const x0 = (n - total) / 2;
  const y0 = (n - total) / 2 - n * 0.03;

  for (let r = 0; r < 3; r += 1) {
    for (let k = 0; k < 3; k += 1) {
      const x = x0 + k * (felt + gap);
      const y = y0 + r * (felt + gap);
      const paa = r === k; // diagonal bingo
      tegnForm(l, paa ? '#FFC93C' : '#FFFFFF', rundRekt(x, y, felt, felt, felt * 0.26));
      if (paa) {
        // hake
        const cx = x + felt / 2;
        const cy = y + felt / 2;
        const t = felt * 0.13;
        tegnForm(l, '#8A5C00', (px, py) => {
          const a = [cx - felt * 0.2, cy + felt * 0.02];
          const b = [cx - felt * 0.05, cy + felt * 0.17];
          const c = [cx + felt * 0.21, cy - felt * 0.18];
          return Math.min(seg(px, py, a, b), seg(px, py, b, c)) - t / 2;
        });
      }
    }
  }

  // liten rod bil pa veien
  const bx = n * 0.5;
  const by = n * 0.88;
  const bb = n * 0.3;
  tegnForm(l, '#E63946', rundRekt(bx - bb / 2, by - bb * 0.22, bb, bb * 0.3, bb * 0.09));
  tegnForm(l, '#E63946', rundRekt(bx - bb * 0.26, by - bb * 0.38, bb * 0.52, bb * 0.22, bb * 0.08));
  tegnForm(l, '#2B2D42', sirkel(bx - bb * 0.28, by + bb * 0.09, bb * 0.1));
  tegnForm(l, '#2B2D42', sirkel(bx + bb * 0.28, by + bb * 0.09, bb * 0.1));

  return skrivPng(n, n, l.p);
}

function seg(px, py, a, b) {
  const vx = b[0] - a[0];
  const vy = b[1] - a[1];
  const wx = px - a[0];
  const wy = py - a[1];
  const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
  return Math.hypot(wx - t * vx, wy - t * vy);
}

for (const [navn, n, opt] of [
  ['ikon-180.png', 180, {}],
  ['ikon-192.png', 192, {}],
  ['ikon-512.png', 512, {}],
  ['ikon-maske-512.png', 512, { maskable: true }],
]) {
  writeFileSync(join(UT, navn), bingoIkon(n, opt));
  console.log('skrev', navn);
}

// ---------------------------------------------------------------- SVG

const rute = [];
for (let r = 0; r < 3; r += 1) {
  for (let k = 0; k < 3; k += 1) {
    const paa = r === k;
    rute.push(
      `<rect x="${118 + k * 106}" y="${104 + r * 106}" width="86" height="86" rx="23" fill="${paa ? '#FFC93C' : '#fff'}"/>`,
    );
    if (paa) {
      const cx = 118 + k * 106 + 43;
      const cy = 104 + r * 106 + 43;
      rute.push(
        `<path d="M${cx - 17} ${cy + 1} L${cx - 4} ${cy + 14} L${cx + 18} ${cy - 15}" fill="none" stroke="#8A5C00" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`,
      );
    }
  }
}

writeFileSync(
  join(UT, 'ikon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Bilbingo">
  <rect width="512" height="512" rx="112" fill="#1F6FEB"/>
  <path d="M0 400 L512 400 L512 512 L0 512 Z" fill="#1249A8"/>
  ${rute.join('\n  ')}
  <g transform="translate(256 452)">
    <rect x="-77" y="-17" width="154" height="46" rx="14" fill="#E63946"/>
    <rect x="-40" y="-58" width="80" height="45" rx="12" fill="#E63946"/>
    <rect x="-31" y="-49" width="27" height="28" rx="6" fill="#BFE6F5"/>
    <rect x="4" y="-49" width="27" height="28" rx="6" fill="#BFE6F5"/>
    <circle cx="-43" cy="29" r="16" fill="#2B2D42"/>
    <circle cx="43" cy="29" r="16" fill="#2B2D42"/>
    <circle cx="-43" cy="29" r="6" fill="#D4DBE6"/>
    <circle cx="43" cy="29" r="6" fill="#D4DBE6"/>
  </g>
</svg>
`,
);
console.log('skrev ikon.svg');
