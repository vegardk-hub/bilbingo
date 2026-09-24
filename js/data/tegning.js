// Grunnformer for ikonene. Alt tegnes i et 100x100-rutenett, flatt og uten
// gradienter, slik at tingene er til a kjenne igjen i et lite felt pa brettet.

export const F = {
  rod: '#E63946',
  dyprod: '#B0212C',
  gul: '#FFC93C',
  morkgul: '#E0A400',
  oransje: '#F77F00',
  gronn: '#2A9D5C',
  lysgronn: '#6BCB77',
  morkgronn: '#1B6E4A',
  bla: '#4EA8DE',
  dypbla: '#1B4965',
  vann: '#67D3E8',
  rute: '#BFE6F5',
  brun: '#8B5E3C',
  morkbrun: '#5C3D24',
  lysbrun: '#B98A5E',
  beige: '#F2E8CF',
  gra: '#8D99AE',
  morkgra: '#4A4E69',
  lysgra: '#D4DBE6',
  hvit: '#FFFFFF',
  svart: '#2B2D42',
  rosa: '#FF8FA3',
  lilla: '#9D4EDD',
  hud: '#F3C49B',
  sand: '#EBD9A6',
  sno: '#F4F9FF',
};

// Lyse farger trenger en kontur for a vaere synlige mot lys bakgrunn.
const LYS = new Set([F.hvit, F.beige, F.sno, F.lysgra, F.gul, F.sand]);
const kontur = (farge) => (LYS.has(farge) ? ` stroke="${F.morkgra}" stroke-width="2.5"` : '');

// ---------------------------------------------------------------- kjøretøy

export function bil(farge, { blalys = false, tak = null } = {}) {
  return `
    <circle cx="28" cy="71" r="11" fill="${F.svart}"/>
    <circle cx="72" cy="71" r="11" fill="${F.svart}"/>
    <path d="M8 71 L8 58 C8 55 10 53 13 52 L32 49 L44 37 C46 35 48 34 51 34 L66 34 C69 34 71 35 73 37 L84 50 L89 52 C92 53 93 55 93 58 L93 71 Z" fill="${farge}"${kontur(farge)}/>
    <path d="M47 40 L45 49 L58 48 L58 39 Z" fill="${F.rute}"/>
    <path d="M62 39 L62 48 L78 49 L68 39 Z" fill="${F.rute}"/>
    <circle cx="28" cy="71" r="5" fill="${F.lysgra}"/>
    <circle cx="72" cy="71" r="5" fill="${F.lysgra}"/>
    ${tak || ''}
    ${blalys ? `<rect x="46" y="27" width="16" height="7" rx="3" fill="${F.bla}"/><circle cx="50" cy="30" r="2.5" fill="${F.hvit}"/>` : ''}`;
}

export function varebil(farge, dekor = '') {
  return `
    <circle cx="30" cy="71" r="11" fill="${F.svart}"/>
    <circle cx="74" cy="71" r="11" fill="${F.svart}"/>
    <path d="M8 71 L8 44 C8 41 10 39 13 39 L60 39 L60 71 Z" fill="${farge}"${kontur(farge)}/>
    <path d="M60 71 L60 46 L72 46 C75 46 77 47 79 50 L89 62 C91 64 92 66 92 69 L92 71 Z" fill="${farge}"${kontur(farge)}/>
    <path d="M64 50 L64 60 L84 60 L76 50 Z" fill="${F.rute}"/>
    <circle cx="30" cy="71" r="5" fill="${F.lysgra}"/>
    <circle cx="74" cy="71" r="5" fill="${F.lysgra}"/>
    ${dekor}`;
}

export function lastebilForm(hyttefarge, lassfarge, dekor = '') {
  return `
    <circle cx="24" cy="72" r="10" fill="${F.svart}"/>
    <circle cx="66" cy="72" r="10" fill="${F.svart}"/>
    <circle cx="84" cy="72" r="10" fill="${F.svart}"/>
    <rect x="6" y="36" width="52" height="36" rx="3" fill="${lassfarge}"${kontur(lassfarge)}/>
    <path d="M58 72 L58 44 C58 41 60 39 63 39 L78 39 C81 39 83 40 84 43 L92 58 C93 60 94 62 94 65 L94 72 Z" fill="${hyttefarge}"${kontur(hyttefarge)}/>
    <path d="M66 44 L66 56 L86 56 L79 44 Z" fill="${F.rute}"/>
    <circle cx="24" cy="72" r="4.5" fill="${F.lysgra}"/>
    <circle cx="66" cy="72" r="4.5" fill="${F.lysgra}"/>
    <circle cx="84" cy="72" r="4.5" fill="${F.lysgra}"/>
    ${dekor}`;
}

export function bussForm(farge, { striper = null } = {}) {
  const ruter = [16, 33, 50, 67]
    .map((x) => `<rect x="${x}" y="36" width="13" height="14" rx="2" fill="${F.rute}"/>`)
    .join('');
  return `
    <circle cx="27" cy="73" r="10" fill="${F.svart}"/>
    <circle cx="73" cy="73" r="10" fill="${F.svart}"/>
    <rect x="7" y="26" width="86" height="47" rx="7" fill="${farge}"${kontur(farge)}/>
    ${ruter}
    ${striper || ''}
    <circle cx="27" cy="73" r="4.5" fill="${F.lysgra}"/>
    <circle cx="73" cy="73" r="4.5" fill="${F.lysgra}"/>`;
}

export function hjulPar(x1, x2, y, r = 10) {
  return `
    <circle cx="${x1}" cy="${y}" r="${r}" fill="${F.svart}"/>
    <circle cx="${x2}" cy="${y}" r="${r}" fill="${F.svart}"/>
    <circle cx="${x1}" cy="${y}" r="${r * 0.42}" fill="${F.lysgra}"/>
    <circle cx="${x2}" cy="${y}" r="${r * 0.42}" fill="${F.lysgra}"/>`;
}

// ---------------------------------------------------------------- skilt

export function skiltRundt(innhold, { ring = F.rod, bunn = F.hvit } = {}) {
  return `
    <rect x="47" y="62" width="6" height="30" fill="${F.gra}"/>
    <circle cx="50" cy="42" r="34" fill="${ring}"/>
    <circle cx="50" cy="42" r="26" fill="${bunn}"/>
    ${innhold}`;
}

export function skiltFart(tall) {
  const st = tall.length > 2 ? 24 : 28;
  return skiltRundt(
    `<text x="50" y="42" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="${st}" fill="${F.svart}">${tall}</text>`,
  );
}

export function skiltTrekant(innhold) {
  return `
    <rect x="47" y="66" width="6" height="26" fill="${F.gra}"/>
    <path d="M50 8 L90 70 C92 73 90 76 87 76 L13 76 C10 76 8 73 10 70 Z" fill="${F.rod}"/>
    <path d="M50 20 L80 68 L20 68 Z" fill="${F.hvit}"/>
    ${innhold}`;
}

export function skiltBla(innhold, { bunn = F.dypbla, r = 4 } = {}) {
  return `
    <rect x="47" y="70" width="6" height="22" fill="${F.gra}"/>
    <rect x="12" y="14" width="76" height="58" rx="${r}" fill="${bunn}"/>
    ${innhold}`;
}

export function skiltBlaRund(innhold) {
  return `
    <rect x="47" y="62" width="6" height="30" fill="${F.gra}"/>
    <circle cx="50" cy="42" r="34" fill="${F.dypbla}"/>
    ${innhold}`;
}

// ---------------------------------------------------------------- hus

export function hus(vegg, tak = F.dyprod, { dor = true, ekstra = '' } = {}) {
  return `
    <path d="M50 14 L94 46 L6 46 Z" fill="${tak}"/>
    <rect x="16" y="46" width="68" height="40" fill="${vegg}"${kontur(vegg)}/>
    <rect x="26" y="54" width="16" height="15" fill="${F.rute}" stroke="${F.hvit}" stroke-width="2.5"/>
    <rect x="58" y="54" width="16" height="15" fill="${F.rute}" stroke="${F.hvit}" stroke-width="2.5"/>
    ${dor ? `<rect x="43" y="68" width="14" height="18" rx="1" fill="${F.morkbrun}"/>` : ''}
    ${ekstra}`;
}

export function tre(lov = F.gronn, stamme = F.morkbrun) {
  return `
    <rect x="45" y="58" width="10" height="30" rx="2" fill="${stamme}"/>
    <circle cx="50" cy="42" r="26" fill="${lov}"/>
    <circle cx="32" cy="52" r="17" fill="${lov}"/>
    <circle cx="68" cy="52" r="17" fill="${lov}"/>`;
}

export function grantre(farge = F.morkgronn, x = 50, y = 0, s = 1) {
  return `<g transform="translate(${x - 50} ${y}) scale(${s}) ${s !== 1 ? `translate(${(50 / s) * (1 - s) * 0} 0)` : ''}">
    <rect x="46" y="72" width="8" height="18" fill="${F.morkbrun}"/>
    <path d="M50 10 L70 44 L30 44 Z" fill="${farge}"/>
    <path d="M50 30 L76 72 L24 72 Z" fill="${farge}"/>
  </g>`;
}

// ---------------------------------------------------------------- dyr

// Firbeint dyr sett fra siden. Proporsjonene skiller artene fra hverandre.
// bak       tegnes forst (horn, hale som skal ligge bak kroppen)
// paaKropp  tegnes pa kroppen, men under hodet (ull, flekker)
// ekstra    tegnes helt til slutt (mule, oyne, detaljer foran)
export function firbeint({
  kropp = F.hvit,
  hode = null,
  kroppX = 50,
  kroppY = 52,
  kroppB = 34,
  kroppH = 22,
  hodeX = 78,
  hodeY = 38,
  hodeR = 11,
  beinY = 64,
  beinH = 22,
  beinFarge = null,
  hals = true,
  oye = true,
  bak = '',
  paaKropp = '',
  ekstra = '',
}) {
  const hf = hode || kropp;
  const bf = beinFarge || hf;
  const k = kontur(bf);
  const bein = [-1, -0.45, 0.45, 1]
    .map((f) => {
      const x = kroppX + f * (kroppB - 5);
      return `<rect x="${x - 3.5}" y="${beinY}" width="7" height="${beinH}" rx="3" fill="${bf}"${k}/>`;
    })
    .join('');
  return `
    ${bak}
    ${bein}
    ${hals ? `<path d="M${hodeX - 6} ${hodeY + 4} L${hodeX + 2} ${hodeY + 6} L${kroppX + kroppB * 0.55} ${kroppY + 8} L${kroppX + kroppB * 0.3} ${kroppY - 6} Z" fill="${bf}"${k}/>` : ''}
    <ellipse cx="${kroppX}" cy="${kroppY}" rx="${kroppB}" ry="${kroppH}" fill="${kropp}"${kontur(kropp)}/>
    ${paaKropp}
    <circle cx="${hodeX}" cy="${hodeY}" r="${hodeR}" fill="${hf}"${kontur(hf)}/>
    ${oye ? `<circle cx="${hodeX + hodeR * 0.35}" cy="${hodeY - 2}" r="1.8" fill="${F.svart}"/>` : ''}
    ${ekstra}`;
}

export function fugl({
  kropp = F.gra,
  vinge = null,
  nebb = F.morkgul,
  cx = 50,
  cy = 52,
  rx = 24,
  ry = 16,
  hals = 0,
  bein = true,
  ekstra = '',
}) {
  const hodeY = cy - 12 - hals;
  const hodeX = cx + rx * 0.72;
  return `
    <path d="M${cx - rx} ${cy + 2} L${cx - rx - 16} ${cy - 6} L${cx - rx - 14} ${cy + 10} Z" fill="${vinge || kropp}"/>
    ${hals ? `<path d="M${hodeX - 7} ${hodeY} L${hodeX + 5} ${hodeY} L${cx + rx * 0.5} ${cy + 4} L${cx + rx * 0.1} ${cy + 4} Z" fill="${kropp}"${kontur(kropp)}/>` : ''}
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${kropp}"${kontur(kropp)}/>
    ${vinge ? `<ellipse cx="${cx - 2}" cy="${cy}" rx="${rx * 0.6}" ry="${ry * 0.6}" fill="${vinge}"/>` : ''}
    <circle cx="${hodeX}" cy="${hodeY}" r="10" fill="${kropp}"${kontur(kropp)}/>
    <circle cx="${hodeX + 3}" cy="${hodeY - 2}" r="1.8" fill="${F.svart}"/>
    <path d="M${hodeX + 9} ${hodeY} L${hodeX + 22} ${hodeY + 3} L${hodeX + 9} ${hodeY + 5} Z" fill="${nebb}"/>
    ${bein ? `<rect x="${cx - 4}" y="${cy + ry - 2}" width="4" height="14" rx="2" fill="${F.morkgul}"/><rect x="${cx + 8}" y="${cy + ry - 2}" width="4" height="14" rx="2" fill="${F.morkgul}"/>` : ''}
    ${ekstra}`;
}

// ---------------------------------------------------------------- folk

export function person({
  genser = F.bla,
  bukse = F.dypbla,
  x = 50,
  y = 0,
  armer = '',
  ekstra = '',
} = {}) {
  return `<g transform="translate(${x - 50} ${y})">
    <circle cx="50" cy="22" r="12" fill="${F.hud}"/>
    <path d="M50 8 C42 8 38 13 38 19 L62 19 C62 13 58 8 50 8 Z" fill="${F.morkbrun}"/>
    <rect x="38" y="34" width="24" height="30" rx="6" fill="${genser}"/>
    <rect x="40" y="62" width="8" height="26" rx="3" fill="${bukse}"/>
    <rect x="52" y="62" width="8" height="26" rx="3" fill="${bukse}"/>
    ${armer || `<rect x="28" y="36" width="9" height="24" rx="4.5" fill="${genser}"/><rect x="63" y="36" width="9" height="24" rx="4.5" fill="${genser}"/>`}
    ${ekstra}
  </g>`;
}

// ---------------------------------------------------------------- landskap

export function bakke(farge = F.lysgronn, y = 78) {
  return `<path d="M0 100 L0 ${y} Q50 ${y - 8} 100 ${y} L100 100 Z" fill="${farge}"/>`;
}

export function vannflate(y = 66, farge = F.vann) {
  return `<path d="M0 100 L0 ${y} L100 ${y} L100 100 Z" fill="${farge}"/>
    <path d="M8 ${y + 10} q7 -4 14 0 t14 0" stroke="${F.hvit}" stroke-width="2.5" fill="none" opacity=".65"/>
    <path d="M56 ${y + 18} q7 -4 14 0 t14 0" stroke="${F.hvit}" stroke-width="2.5" fill="none" opacity=".65"/>`;
}

export function stolpe(x = 50, topp = 20, farge = F.gra, bredde = 6) {
  return `<rect x="${x - bredde / 2}" y="${topp}" width="${bredde}" height="${92 - topp}" fill="${farge}"/>`;
}

export function tekstMerke(tekst, { y = 50, str = 30, farge = F.svart } = {}) {
  return `<text x="50" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="${str}" fill="${farge}">${tekst}</text>`;
}
