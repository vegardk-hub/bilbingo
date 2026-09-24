// Alle 202 ikonene. Hver verdi er innmaten i en <svg viewBox="0 0 100 100">.
import {
  F, bil, varebil, lastebilForm, bussForm, hjulPar,
  skiltRundt, skiltFart, skiltTrekant, skiltBla, skiltBlaRund,
  hus, tre, firbeint, fugl, person, bakke, vannflate, stolpe, tekstMerke,
} from './tegning.js';

// Liten hjelper for a plassere en grunnform et sted i ruten.
const p = (inn, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${inn}</g>`;

// Plasserer en 100x100-form slik at midten havner i (cx, cy).
const pos = (inn, cx, cy, s = 1) =>
  `<g transform="translate(${cx - 50 * s} ${cy - 50 * s}) scale(${s})">${inn}</g>`;

const gran = (farge = F.morkgronn) => `
  <rect x="46" y="70" width="8" height="20" fill="${F.morkbrun}"/>
  <path d="M50 8 L70 42 L30 42 Z" fill="${farge}"/>
  <path d="M50 28 L76 70 L24 70 Z" fill="${farge}"/>`;

const skiltStolpe = `<rect x="47" y="66" width="6" height="26" fill="${F.gra}"/>`;

// Vanlig person-silhuett brukt i skilt (hvit pa bla, svart pa hvit).
const gubbe = (farge, x = 50, y = 20, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <circle cx="0" cy="-14" r="6" fill="${farge}"/>
  <path d="M-6 -6 L6 -6 L9 12 L4 12 L2 2 L-2 2 L-4 12 L-9 12 Z" fill="${farge}"/>
</g>`;

export const IKONER = {
  // ============================================================ KJØRETØY
  bilRod: bil(F.rod),
  bilBla: bil(F.bla),
  bilHvit: bil(F.hvit),
  bilSvart: bil(F.svart),
  bilGronn: bil(F.gronn),
  bilGul: bil(F.gul),
  bilOransje: bil(F.oransje),
  bilRosa: bil(F.rosa),

  lastebil: lastebilForm(F.rod, F.bla),
  vogntog: `
    <circle cx="18" cy="74" r="9" fill="${F.svart}"/><circle cx="34" cy="74" r="9" fill="${F.svart}"/>
    <circle cx="72" cy="74" r="9" fill="${F.svart}"/><circle cx="88" cy="74" r="9" fill="${F.svart}"/>
    <rect x="4" y="34" width="58" height="40" rx="3" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="10" y="42" width="46" height="8" rx="2" fill="${F.bla}"/>
    <path d="M62 74 L62 44 C62 41 64 39 67 39 L80 39 C83 39 85 40 86 43 L94 58 C95 60 96 62 96 66 L96 74 Z" fill="${F.dyprod}"/>
    <path d="M69 44 L69 56 L89 56 L82 44 Z" fill="${F.rute}"/>
    <circle cx="18" cy="74" r="4" fill="${F.lysgra}"/><circle cx="34" cy="74" r="4" fill="${F.lysgra}"/>
    <circle cx="72" cy="74" r="4" fill="${F.lysgra}"/><circle cx="88" cy="74" r="4" fill="${F.lysgra}"/>`,
  buss: bussForm(F.gronn, { striper: `<rect x="7" y="55" width="86" height="6" fill="${F.hvit}"/>` }),
  skolebuss: bussForm(F.gul, {
    striper: `<rect x="7" y="55" width="86" height="5" fill="${F.svart}"/>
      <rect x="7" y="62" width="86" height="3" fill="${F.svart}"/>`,
  }),
  bobil: `
    <circle cx="26" cy="74" r="10" fill="${F.svart}"/><circle cx="76" cy="74" r="10" fill="${F.svart}"/>
    <path d="M5 74 L5 34 C5 31 7 29 10 29 L58 29 L58 22 L74 22 C78 22 81 24 83 28 L94 52 C96 56 97 60 97 65 L97 74 Z" fill="${F.beige}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="12" y="38" width="20" height="16" rx="2" fill="${F.rute}"/>
    <rect x="38" y="38" width="16" height="16" rx="2" fill="${F.rute}"/>
    <path d="M74 32 L74 48 L92 48 L84 32 Z" fill="${F.rute}"/>
    <rect x="5" y="62" width="53" height="6" fill="${F.oransje}"/>
    <circle cx="26" cy="74" r="4.5" fill="${F.lysgra}"/><circle cx="76" cy="74" r="4.5" fill="${F.lysgra}"/>`,
  campingvogn: `
    <circle cx="52" cy="76" r="9" fill="${F.svart}"/>
    <path d="M18 76 L18 42 C18 38 21 35 26 35 L84 35 C89 35 92 38 92 42 L92 76 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="26" y="44" width="22" height="16" rx="2" fill="${F.rute}"/>
    <rect x="56" y="44" width="28" height="16" rx="2" fill="${F.rute}"/>
    <rect x="18" y="66" width="74" height="5" fill="${F.bla}"/>
    <path d="M18 60 L4 70 L4 76 L18 76 Z" fill="${F.gra}"/>
    <circle cx="52" cy="76" r="4" fill="${F.lysgra}"/>`,
  tilhenger: `
    ${p(bil(F.bla), 24, 6, 0.72)}
    <rect x="4" y="52" width="30" height="20" rx="3" fill="${F.gra}"/>
    <rect x="4" y="46" width="30" height="7" rx="2" fill="${F.morkgra}"/>
    <rect x="32" y="60" width="12" height="4" fill="${F.morkgra}"/>
    <circle cx="19" cy="74" r="8" fill="${F.svart}"/><circle cx="19" cy="74" r="3.5" fill="${F.lysgra}"/>`,
  takboks: bil(F.gronn, {
    tak: `<rect x="38" y="24" width="38" height="12" rx="6" fill="${F.svart}"/>
      <rect x="40" y="27" width="34" height="3" rx="1.5" fill="${F.gra}"/>`,
  }),
  sykkelstativ: `
    ${p(bil(F.rod), 0, 0, 0.9)}
    <circle cx="14" cy="42" r="12" fill="none" stroke="${F.svart}" stroke-width="3.5"/>
    <circle cx="34" cy="42" r="12" fill="none" stroke="${F.svart}" stroke-width="3.5"/>
    <path d="M14 42 L24 28 L34 42 M24 28 L30 28" stroke="${F.oransje}" stroke-width="3.5" fill="none"/>`,
  traktor: `
    <circle cx="74" cy="66" r="24" fill="${F.svart}"/><circle cx="74" cy="66" r="12" fill="${F.lysgra}"/>
    <circle cx="22" cy="76" r="14" fill="${F.svart}"/><circle cx="22" cy="76" r="7" fill="${F.lysgra}"/>
    <path d="M12 62 L12 50 C12 47 14 45 17 45 L40 45 L44 24 C45 21 47 20 50 20 L68 20 C72 20 74 22 74 26 L74 62 Z" fill="${F.gronn}"/>
    <rect x="46" y="26" width="24" height="16" rx="2" fill="${F.rute}"/>
    <rect x="8" y="34" width="8" height="18" rx="3" fill="${F.morkgra}"/>`,
  gravemaskin: `
    <rect x="8" y="72" width="60" height="16" rx="8" fill="${F.svart}"/>
    <circle cx="20" cy="80" r="6" fill="${F.lysgra}"/><circle cx="38" cy="80" r="6" fill="${F.lysgra}"/><circle cx="56" cy="80" r="6" fill="${F.lysgra}"/>
    <path d="M14 72 L14 48 C14 45 16 43 19 43 L60 43 C64 43 66 45 66 49 L66 72 Z" fill="${F.gul}" stroke="${F.morkgra}" stroke-width="2"/>
    <rect x="22" y="48" width="20" height="18" rx="2" fill="${F.rute}"/>
    <path d="M62 50 L88 26" stroke="${F.gul}" stroke-width="9" stroke-linecap="round"/>
    <path d="M88 26 L80 48" stroke="${F.gul}" stroke-width="8" stroke-linecap="round"/>
    <path d="M72 46 L92 46 L88 60 L76 60 Z" fill="${F.morkgra}"/>`,
  hjullaster: `
    ${hjulPar(26, 74, 72, 14)}
    <path d="M16 68 L16 46 C16 43 18 41 21 41 L42 41 L46 26 C47 23 49 22 52 22 L70 22 C74 22 76 24 76 28 L76 68 Z" fill="${F.gul}" stroke="${F.morkgra}" stroke-width="2"/>
    <rect x="50" y="28" width="22" height="14" rx="2" fill="${F.rute}"/>
    <path d="M16 52 L4 60 L4 74 L20 74 L20 64" fill="${F.morkgra}"/>`,
  broytebil: `
    ${lastebilForm(F.oransje, F.oransje, `<rect x="10" y="26" width="14" height="8" rx="3" fill="${F.gul}"/>`)}
    <path d="M6 44 L6 78 L-2 78 L-2 44 Z" fill="${F.gra}"/>
    <path d="M8 42 L8 80 L26 74 L26 48 Z" fill="${F.gul}" stroke="${F.morkgra}" stroke-width="2"/>`,
  politibil: bil(F.hvit, {
    blalys: true,
    tak: `<rect x="14" y="56" width="34" height="9" fill="${F.dypbla}"/>
      <rect x="14" y="56" width="34" height="4.5" fill="${F.gul}"/>`,
  }),
  ambulanse: varebil(F.hvit, `
    <rect x="18" y="50" width="26" height="8" fill="${F.rod}"/>
    <rect x="27" y="41" width="8" height="26" fill="${F.rod}"/>
    <rect x="16" y="30" width="20" height="8" rx="3" fill="${F.bla}"/>`),
  brannbil: lastebilForm(F.dyprod, F.dyprod, `
    <rect x="10" y="44" width="42" height="7" rx="3" fill="${F.gul}"/>
    <rect x="12" y="28" width="16" height="8" rx="3" fill="${F.bla}"/>
    <rect x="6" y="56" width="52" height="5" fill="${F.hvit}"/>`),
  blalys: `
    ${p(bil(F.hvit), 0, 8, 0.9)}
    <g><rect x="34" y="18" width="34" height="11" rx="5" fill="${F.dypbla}"/>
    <circle cx="43" cy="23" r="4" fill="${F.bla}"/><circle cx="59" cy="23" r="4" fill="${F.bla}"/>
    <path d="M28 12 L34 20 M74 12 L68 20 M51 6 L51 15" stroke="${F.bla}" stroke-width="3.5" stroke-linecap="round"/></g>`,
  taxi: bil(F.gul, {
    tak: `<rect x="38" y="24" width="26" height="11" rx="2" fill="${F.svart}"/>
      <text x="51" y="30" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="9" fill="${F.gul}">TAXI</text>`,
  }),
  motorsykkel: `
    <circle cx="22" cy="66" r="18" fill="none" stroke="${F.svart}" stroke-width="7"/>
    <circle cx="78" cy="66" r="18" fill="none" stroke="${F.svart}" stroke-width="7"/>
    <path d="M22 66 L44 66 L54 48 L70 48 L78 66" stroke="${F.rod}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M40 48 L54 48 M34 42 L44 50" stroke="${F.morkgra}" stroke-width="5" stroke-linecap="round"/>
    <path d="M52 44 L74 44 L70 56 L54 56 Z" fill="${F.rod}"/>
    <circle cx="61" cy="30" r="11" fill="${F.dypbla}"/><path d="M52 30 a11 11 0 0 1 18 -6 L68 32 Z" fill="${F.rute}"/>`,
  moped: `
    <circle cx="24" cy="70" r="14" fill="none" stroke="${F.svart}" stroke-width="6"/>
    <circle cx="78" cy="70" r="14" fill="none" stroke="${F.svart}" stroke-width="6"/>
    <path d="M24 70 L42 70 C46 70 48 66 48 62 L48 50 L66 50 L72 62 L78 70" stroke="${F.bla}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M44 46 L62 46 L60 56 L46 56 Z" fill="${F.bla}"/>
    <path d="M40 40 L30 34" stroke="${F.morkgra}" stroke-width="5" stroke-linecap="round"/>`,
  sykkel: `
    <circle cx="22" cy="64" r="20" fill="none" stroke="${F.svart}" stroke-width="5"/>
    <circle cx="78" cy="64" r="20" fill="none" stroke="${F.svart}" stroke-width="5"/>
    <path d="M22 64 L46 64 L58 36 L78 64 M46 64 L60 36 M58 36 L70 36" stroke="${F.rod}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M40 32 L52 32" stroke="${F.morkgra}" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="46" cy="64" r="6" fill="${F.morkgra}"/>`,
  sparkesykkel: `
    <circle cx="20" cy="74" r="12" fill="none" stroke="${F.svart}" stroke-width="5"/>
    <circle cx="80" cy="74" r="12" fill="none" stroke="${F.svart}" stroke-width="5"/>
    <path d="M20 74 L80 74" stroke="${F.morkgra}" stroke-width="7" stroke-linecap="round"/>
    <path d="M78 74 L78 24" stroke="${F.morkgra}" stroke-width="7" stroke-linecap="round"/>
    <path d="M62 24 L92 24" stroke="${F.svart}" stroke-width="7" stroke-linecap="round"/>`,
  postbil: varebil(F.rod, `<circle cx="30" cy="54" r="12" fill="${F.gul}"/>
    <path d="M22 50 L38 50 L30 59 Z" fill="${F.rod}"/>`),
  soppelbil: lastebilForm(F.gronn, F.morkgronn, `
    <rect x="10" y="42" width="42" height="6" rx="2" fill="${F.lysgronn}"/>
    <path d="M6 58 L58 58 L58 68 L6 68 Z" fill="${F.gronn}"/>`),
  betongbil: `
    <circle cx="22" cy="74" r="9" fill="${F.svart}"/><circle cx="54" cy="74" r="9" fill="${F.svart}"/><circle cx="82" cy="74" r="9" fill="${F.svart}"/>
    <rect x="6" y="60" width="88" height="14" rx="3" fill="${F.morkgra}"/>
    <path d="M14 60 L20 30 L56 24 L66 44 L56 60 Z" fill="${F.oransje}" stroke="${F.morkgra}" stroke-width="2"/>
    <path d="M22 32 L52 27 M20 42 L60 36 M22 52 L58 48" stroke="${F.hvit}" stroke-width="3" opacity=".7"/>
    <path d="M66 74 L66 46 C66 43 68 42 71 42 L82 42 L92 58 L92 74 Z" fill="${F.bla}"/>
    <path d="M72 46 L72 56 L88 56 L82 46 Z" fill="${F.rute}"/>`,
  tankbil: `
    <circle cx="22" cy="74" r="9" fill="${F.svart}"/><circle cx="50" cy="74" r="9" fill="${F.svart}"/><circle cx="82" cy="74" r="9" fill="${F.svart}"/>
    <rect x="4" y="38" width="58" height="34" rx="17" fill="${F.lysgra}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <path d="M24 38 L24 72 M44 38 L44 72" stroke="${F.gra}" stroke-width="2.5"/>
    <path d="M62 72 L62 44 C62 41 64 39 67 39 L80 39 L92 58 L92 72 Z" fill="${F.dypbla}"/>
    <path d="M69 44 L69 55 L88 55 L81 44 Z" fill="${F.rute}"/>`,
  varebil: varebil(F.hvit),
  veteranbil: `
    <circle cx="26" cy="72" r="13" fill="${F.svart}"/><circle cx="76" cy="72" r="13" fill="${F.svart}"/>
    <circle cx="26" cy="72" r="6" fill="${F.beige}"/><circle cx="76" cy="72" r="6" fill="${F.beige}"/>
    <path d="M8 72 L8 56 C8 53 10 51 14 51 L34 51 L38 34 C39 31 41 30 45 30 L64 30 C68 30 70 32 70 36 L70 51 L88 51 C92 51 94 53 94 57 L94 72 Z" fill="${F.dyprod}"/>
    <rect x="43" y="35" width="22" height="14" rx="2" fill="${F.rute}"/>
    <circle cx="90" cy="46" r="7" fill="${F.gul}"/>
    <rect x="6" y="46" width="10" height="16" rx="3" fill="${F.morkgra}"/>`,
  cabriolet: `
    <circle cx="28" cy="71" r="11" fill="${F.svart}"/><circle cx="72" cy="71" r="11" fill="${F.svart}"/>
    <path d="M8 71 L8 58 C8 55 10 53 13 52 L32 49 L44 44 L74 44 L84 50 L89 52 C92 53 93 55 93 58 L93 71 Z" fill="${F.rod}"/>
    <path d="M42 44 L78 44 L78 40 L42 40 Z" fill="${F.dyprod}"/>
    <circle cx="28" cy="71" r="5" fill="${F.lysgra}"/><circle cx="72" cy="71" r="5" fill="${F.lysgra}"/>
    <circle cx="53" cy="34" r="8" fill="${F.hud}"/><path d="M45 30 a8 8 0 0 1 16 0 Z" fill="${F.gul}"/>`,
  tesla: bil(F.hvit, {
    tak: `<path d="M50 20 L42 26 L46 26 L50 23 L54 26 L58 26 Z" fill="${F.rod}"/>
      <path d="M50 26 L45 29 L50 32 L55 29 Z" fill="${F.rod}"/>`,
  }),
  elbilLader: `
    ${p(bil(F.gronn), -6, 4, 0.82)}
    <rect x="72" y="30" width="22" height="42" rx="4" fill="${F.morkgra}"/>
    <rect x="76" y="36" width="14" height="12" rx="2" fill="${F.lysgronn}"/>
    <path d="M84 52 L79 62 L83 62 L81 70 L88 59 L84 59 Z" fill="${F.gul}"/>
    <path d="M72 44 C64 44 62 50 56 50" stroke="${F.svart}" stroke-width="4" fill="none"/>`,
  hestehenger: `
    ${p(bil(F.bla), 26, 10, 0.66)}
    <rect x="2" y="40" width="42" height="32" rx="4" fill="${F.beige}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="2" y="40" width="42" height="7" rx="3" fill="${F.gronn}"/>
    <rect x="10" y="50" width="12" height="12" rx="2" fill="${F.morkbrun}"/>
    <circle cx="16" cy="56" r="4" fill="${F.lysbrun}"/>
    <rect x="42" y="62" width="10" height="4" fill="${F.morkgra}"/>
    <circle cx="28" cy="74" r="8" fill="${F.svart}"/><circle cx="28" cy="74" r="3.5" fill="${F.lysgra}"/>`,
  baatHenger: `
    ${p(bil(F.svart), 28, 12, 0.62)}
    <path d="M2 50 L52 50 L46 68 L10 68 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="22" y="36" width="5" height="16" fill="${F.gra}"/>
    <path d="M4 44 L50 44 L50 50 L4 50 Z" fill="${F.bla}"/>
    <circle cx="28" cy="74" r="8" fill="${F.svart}"/><circle cx="28" cy="74" r="3.5" fill="${F.lysgra}"/>`,
  traktorHenger: `
    ${p(`<circle cx="74" cy="66" r="24" fill="${F.svart}"/><circle cx="74" cy="66" r="12" fill="${F.lysgra}"/>
      <circle cx="22" cy="76" r="14" fill="${F.svart}"/><circle cx="22" cy="76" r="7" fill="${F.lysgra}"/>
      <path d="M12 62 L12 50 C12 47 14 45 17 45 L40 45 L44 24 C45 21 47 20 50 20 L68 20 C72 20 74 22 74 26 L74 62 Z" fill="${F.gronn}"/>
      <rect x="46" y="26" width="24" height="16" rx="2" fill="${F.rute}"/>`, 34, 14, 0.62)}
    <rect x="2" y="48" width="42" height="24" rx="3" fill="${F.rod}"/>
    <rect x="2" y="44" width="42" height="6" rx="2" fill="${F.dyprod}"/>
    <circle cx="16" cy="76" r="9" fill="${F.svart}"/><circle cx="16" cy="76" r="4" fill="${F.lysgra}"/>
    <rect x="42" y="62" width="14" height="4" fill="${F.morkgra}"/>`,
  militaer: `
    ${hjulPar(26, 74, 72, 13)}
    <path d="M6 72 L6 50 C6 47 8 45 11 45 L34 45 L42 32 L72 32 L82 45 L92 48 C95 49 96 51 96 54 L96 72 Z" fill="#4A5D3A"/>
    <path d="M46 36 L44 45 L60 45 L60 36 Z" fill="#2E3A24"/>
    <path d="M64 36 L64 45 L78 45 L70 36 Z" fill="#2E3A24"/>
    <circle cx="24" cy="40" r="5" fill="#6B7A54"/><circle cx="60" cy="26" r="5" fill="#6B7A54"/>`,
  bulk: `
    ${bil(F.bla)}
    <path d="M82 50 L92 58 L86 62 L94 66" stroke="${F.svart}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>
    <path d="M84 44 q8 6 4 14 q-4 8 -12 6" fill="${F.dypbla}" opacity=".6"/>`,
  hundIBil: `
    ${bil(F.oransje)}
    <circle cx="67" cy="42" r="8" fill="${F.morkbrun}"/>
    <path d="M60 36 L58 46 L64 44 Z" fill="${F.morkbrun}"/>
    <path d="M74 36 L76 46 L70 44 Z" fill="${F.morkbrun}"/>
    <circle cx="70" cy="41" r="1.6" fill="${F.svart}"/>
    <circle cx="67" cy="47" r="2.4" fill="${F.svart}"/>`,
  skiltSverige: `
    <rect x="8" y="34" width="84" height="32" rx="5" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="3"/>
    <rect x="11" y="37" width="14" height="26" rx="3" fill="#005BBB"/>
    <path d="M14 46 L22 46 M17.5 40 L17.5 60 M14 54 L22 54" stroke="${F.gul}" stroke-width="3"/>
    <text x="60" y="51" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="20" fill="${F.svart}">ABC</text>`,
  skiltUtland: `
    <rect x="8" y="34" width="84" height="32" rx="5" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="3"/>
    <rect x="11" y="37" width="14" height="26" rx="3" fill="#003399"/>
    <circle cx="18" cy="44" r="1.6" fill="${F.gul}"/><circle cx="14" cy="50" r="1.6" fill="${F.gul}"/>
    <circle cx="22" cy="50" r="1.6" fill="${F.gul}"/><circle cx="18" cy="56" r="1.6" fill="${F.gul}"/>
    <text x="60" y="51" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="19" fill="${F.svart}">1234</text>`,
  skiltEl: `
    <rect x="8" y="34" width="84" height="32" rx="5" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="3"/>
    <text x="50" y="51" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="24" fill="${F.svart}">EL</text>
    <path d="M78 38 L72 50 L77 50 L74 62 L84 47 L79 47 Z" fill="${F.lysgronn}"/>`,

  // ============================================================ DYR
  sau: firbeint({
    kropp: F.hvit, hode: F.svart, kroppB: 30, kroppH: 20, hodeX: 82, hodeY: 42, hodeR: 10,
    beinFarge: F.svart, oye: false,
    paaKropp: `<circle cx="30" cy="44" r="11" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>
      <circle cx="48" cy="37" r="12" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>
      <circle cx="66" cy="42" r="11" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>
      <circle cx="40" cy="55" r="10" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>
      <circle cx="58" cy="56" r="10" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>`,
    ekstra: `<path d="M74 34 q-4 -6 1 -9 M90 34 q4 -6 -1 -9" stroke="${F.svart}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="86" cy="40" r="1.9" fill="${F.hvit}"/>
      <ellipse cx="88" cy="48" rx="5" ry="4" fill="${F.svart}"/>`,
  }),
  ku: firbeint({
    kropp: F.hvit, hode: F.hvit, kroppB: 32, kroppH: 22, hodeX: 80, hodeY: 40, hodeR: 12,
    bak: `<path d="M18 46 L13 76" stroke="${F.hvit}" stroke-width="5" stroke-linecap="round"/>
      <path d="M13 72 q-5 8 1 12 q6 -4 1 -12 Z" fill="${F.svart}"/>
      <path d="M70 32 q-5 -9 2 -11 M90 32 q5 -9 -2 -11" stroke="${F.beige}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    paaKropp: `<ellipse cx="36" cy="45" rx="12" ry="9" fill="${F.svart}"/>
      <ellipse cx="58" cy="59" rx="9" ry="6" fill="${F.svart}"/>
      <ellipse cx="66" cy="42" rx="6" ry="5" fill="${F.svart}"/>`,
    ekstra: `<ellipse cx="86" cy="48" rx="8" ry="6" fill="${F.rosa}"/>
      <circle cx="84" cy="48" r="1.4" fill="#C4687C"/><circle cx="89" cy="48" r="1.4" fill="#C4687C"/>
      <path d="M72 32 q-3 -5 1 -7 M88 30 q4 -5 0 -7" stroke="${F.svart}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  }),
  hest: firbeint({
    kropp: F.lysbrun, kroppB: 31, kroppH: 20, hodeX: 80, hodeY: 30, hodeR: 10, beinH: 26, beinY: 62,
    bak: `<path d="M19 44 q-13 12 -8 30" stroke="${F.morkbrun}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    paaKropp: `<path d="M70 24 q7 9 4 20 L64 42 q4 -9 -1 -15 Z" fill="${F.morkbrun}"/>`,
    ekstra: `<path d="M84 28 L94 40 Q95 45 89 45 L82 42 Z" fill="${F.lysbrun}"/>
      <path d="M74 22 L71 12 L79 19 Z" fill="${F.lysbrun}"/>
      <path d="M86 22 L88 12 L80 19 Z" fill="${F.lysbrun}"/>
      <ellipse cx="92" cy="42" rx="3" ry="2.4" fill="${F.morkbrun}"/>`,
  }),
  geit: firbeint({
    kropp: F.beige, kroppX: 44, kroppB: 24, kroppH: 15, hodeX: 76, hodeY: 40, hodeR: 11, beinH: 24, oye: false,
    bak: `<path d="M23 42 L16 28" stroke="${F.beige}" stroke-width="6" stroke-linecap="round"/>`,
    ekstra: `<path d="M70 32 C64 18 72 12 76 18 M84 32 C88 16 80 10 77 17" stroke="#6E5236" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M66 40 L58 36 L64 46 Z" fill="${F.beige}" stroke="${F.morkgra}" stroke-width="2"/>
      <path d="M86 42 L90 38 L92 48 Z" fill="${F.beige}" stroke="${F.morkgra}" stroke-width="2"/>
      <ellipse cx="86" cy="46" rx="6" ry="5" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>
      <circle cx="87" cy="45" r="1.3" fill="${F.svart}"/>
      <circle cx="76" cy="37" r="2" fill="${F.svart}"/>
      <path d="M76 52 q-3 12 2 14 q5 -4 2 -14" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>`,
  }),
  gris: firbeint({
    kropp: F.rosa, kroppB: 31, kroppH: 22, hodeX: 80, hodeY: 44, hodeR: 13, beinH: 16, beinY: 66,
    bak: `<path d="M19 46 q-9 1 -7 8 q2 6 8 2" stroke="${F.rosa}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    ekstra: `<ellipse cx="91" cy="47" rx="6.5" ry="5.5" fill="#E8677F"/>
      <circle cx="89" cy="47" r="1.5" fill="#B8455C"/><circle cx="93" cy="47" r="1.5" fill="#B8455C"/>
      <path d="M72 34 L68 24 L80 31 Z" fill="#F07A92"/>
      <path d="M88 32 L88 22 L94 32 Z" fill="#F07A92"/>`,
  }),
  hone: `
    <rect x="40" y="70" width="4" height="14" fill="${F.morkgul}"/><rect x="56" y="70" width="4" height="14" fill="${F.morkgul}"/>
    <ellipse cx="46" cy="56" rx="26" ry="20" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <path d="M20 50 L6 40 L16 62 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <circle cx="70" cy="34" r="12" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <path d="M62 22 q4 -8 8 0 q4 -8 8 0 L78 26 L62 26 Z" fill="${F.rod}"/>
    <path d="M80 34 L92 38 L80 41 Z" fill="${F.morkgul}"/>
    <circle cx="74" cy="32" r="2" fill="${F.svart}"/>
    <path d="M66 44 q4 8 8 2" fill="${F.rod}"/>`,
  elg: firbeint({
    kropp: '#6B4A32', kroppB: 33, kroppH: 22, hodeX: 80, hodeY: 32, hodeR: 11, beinH: 28, beinY: 62, beinFarge: '#4A3222',
    ekstra: `<path d="M86 30 L96 42 L82 44 Z" fill="#5C3D24"/>
      <path d="M72 22 L58 8 L66 8 L62 2 L74 12 M88 22 L102 8 L94 8 L98 2 L86 12" stroke="#8B6B44" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M84 44 q-2 10 2 12" stroke="#5C3D24" stroke-width="4" fill="none"/>`,
  }),
  radyr: firbeint({
    kropp: '#C08552', kroppB: 26, kroppH: 17, hodeX: 78, hodeY: 30, hodeR: 9, beinH: 26, beinY: 62,
    ekstra: `<path d="M72 22 L68 10 M84 22 L88 10" stroke="#8B5E3C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="22" cy="46" rx="7" ry="6" fill="${F.hvit}"/>
      <circle cx="40" cy="46" r="2.5" fill="${F.beige}"/><circle cx="54" cy="42" r="2.5" fill="${F.beige}"/>`,
  }),
  hjort: firbeint({
    kropp: '#A9713F', kroppB: 30, kroppH: 19, hodeX: 80, hodeY: 28, hodeR: 10, beinH: 28, beinY: 62,
    ekstra: `<path d="M72 20 L62 6 L70 8 L66 0 M88 20 L98 6 L90 8 L94 0" stroke="#7A4E28" stroke-width="4.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="40" cy="44" r="3" fill="${F.beige}"/><circle cx="52" cy="40" r="3" fill="${F.beige}"/><circle cx="62" cy="48" r="3" fill="${F.beige}"/>`,
  }),
  rein: firbeint({
    kropp: '#9B8878', kroppB: 30, kroppH: 20, hodeX: 80, hodeY: 30, hodeR: 10, beinH: 26, beinY: 62,
    ekstra: `<path d="M72 22 L60 8 L70 10 M88 22 L100 8 L90 10" stroke="#C9BBA8" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M64 18 L58 14 M96 18 L102 14" stroke="#C9BBA8" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="72" cy="44" rx="14" ry="9" fill="${F.beige}"/>`,
  }),
  hund: firbeint({
    kropp: '#C28E4E', kroppX: 44, kroppB: 26, kroppH: 15, hodeX: 76, hodeY: 38, hodeR: 13,
    beinH: 20, beinY: 62, hals: false, oye: false,
    bak: `<path d="M20 46 q-12 -8 -8 -20" stroke="#C28E4E" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M66 46 L66 58 L74 58 L74 44 Z" fill="#C28E4E"/>
      <path d="M64 30 L60 50 L72 42 Z" fill="#8B5E3C"/>
      <path d="M88 30 L92 50 L80 42 Z" fill="#8B5E3C"/>`,
    ekstra: `<ellipse cx="86" cy="46" rx="10" ry="8" fill="#DCA86A"/>
      <ellipse cx="92" cy="44" rx="4" ry="3.2" fill="${F.svart}"/>
      <circle cx="74" cy="35" r="2" fill="${F.svart}"/><circle cx="84" cy="35" r="2" fill="${F.svart}"/>`,
  }),
  katt: firbeint({
    kropp: F.gra, kroppB: 24, kroppH: 13, hodeX: 76, hodeY: 40, hodeR: 11, beinH: 18, beinY: 60, hals: false, oye: false,
    bak: `<path d="M27 44 q-15 -7 -13 -23" stroke="${F.gra}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    ekstra: `<path d="M68 32 L66 20 L76 30 Z" fill="${F.gra}"/>
      <path d="M84 32 L86 20 L76 30 Z" fill="${F.gra}"/>
      <circle cx="72" cy="39" r="1.8" fill="${F.svart}"/><circle cx="81" cy="39" r="1.8" fill="${F.svart}"/>
      <path d="M76 44 L74 47 L78 47 Z" fill="${F.rosa}"/>
      <path d="M64 42 L70 44 M64 48 L70 46 M88 42 L82 44 M88 48 L82 46" stroke="${F.morkgra}" stroke-width="1.5"/>`,
  }),
  hare: `
    <ellipse cx="46" cy="60" rx="26" ry="19" fill="#B9A78E"/>
    <circle cx="74" cy="44" r="13" fill="#B9A78E"/>
    <path d="M68 32 q-4 -22 4 -22 q6 0 2 22 Z" fill="#B9A78E"/>
    <path d="M80 32 q4 -22 -4 -22" stroke="#B9A78E" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="79" cy="43" r="2" fill="${F.svart}"/>
    <circle cx="20" cy="54" r="8" fill="${F.hvit}"/>
    <rect x="34" y="74" width="8" height="12" rx="4" fill="#B9A78E"/><rect x="54" y="74" width="8" height="12" rx="4" fill="#B9A78E"/>`,
  ekorn: `
    <path d="M28 70 q-22 -6 -18 -34 q3 -20 22 -12 q-12 6 -10 22 q2 14 12 18 Z" fill="#C0622C"/>
    <ellipse cx="52" cy="60" rx="20" ry="22" fill="#D4763C"/>
    <circle cx="66" cy="34" r="13" fill="#D4763C"/>
    <path d="M58 24 L56 12 L66 22 Z" fill="#D4763C"/>
    <path d="M76 24 L78 12 L68 22 Z" fill="#D4763C"/>
    <circle cx="71" cy="33" r="2.2" fill="${F.svart}"/>
    <path d="M78 38 L86 40 L78 43 Z" fill="${F.morkbrun}"/>
    <rect x="42" y="78" width="9" height="10" rx="4" fill="#C0622C"/><rect x="58" y="78" width="9" height="10" rx="4" fill="#C0622C"/>`,
  rev: firbeint({
    kropp: '#E07A3C', kroppB: 27, kroppH: 15, hodeX: 78, hodeY: 40, hodeR: 11, beinH: 18, beinY: 60, beinFarge: '#4A3222', hals: false, oye: false,
    bak: `<path d="M26 44 q-20 -4 -20 -20 q12 7 16 16 Z" fill="#E07A3C"/>
      <path d="M8 24 q-5 -7 2 -9 q5 5 2 9" fill="${F.hvit}"/>`,
    ekstra: `<path d="M70 32 L68 18 L78 30 Z" fill="#E07A3C"/>
      <path d="M86 32 L88 18 L78 30 Z" fill="#E07A3C"/>
      <path d="M86 42 L96 46 L86 48 Z" fill="${F.svart}"/>
      <circle cx="74" cy="39" r="1.8" fill="${F.svart}"/><circle cx="82" cy="39" r="1.8" fill="${F.svart}"/>`,
  }),
  maake: fugl({ kropp: F.hvit, vinge: F.lysgra, nebb: F.gul }),
  kraake: fugl({ kropp: F.svart, vinge: '#1A1B29', nebb: F.morkgra }),
  and: fugl({ kropp: '#6E7B5A', vinge: F.morkgronn, nebb: F.morkgul, ry: 14, bein: false, ekstra: vannflate(72) }),
  svane: `
    ${vannflate(70, F.vann)}
    <path d="M32 62 q-12 -6 -14 -14 q6 4 14 6 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>
    <path d="M62 56 C48 58 40 52 42 44 C44 32 62 26 68 14" stroke="${F.morkgra}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M62 56 C48 58 40 52 42 44 C44 32 62 26 68 14" stroke="${F.hvit}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <ellipse cx="46" cy="60" rx="26" ry="14" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <circle cx="70" cy="14" r="9" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <circle cx="73" cy="12" r="1.8" fill="${F.svart}"/>
    <path d="M78 14 L90 18 L78 20 Z" fill="${F.oransje}"/>
    <path d="M76 9 q4 1 4 4" stroke="${F.svart}" stroke-width="3" fill="none"/>`,
  gaas: fugl({ kropp: '#A99A86', nebb: F.svart, hals: 12, rx: 24, ry: 15 }),
  due: fugl({ kropp: '#98A2B3', vinge: '#7A8497', nebb: F.rosa, rx: 20, ry: 14 }),
  skjaere: `
    ${fugl({ kropp: F.svart, nebb: F.svart, rx: 20, ry: 13, ekstra: `<ellipse cx="46" cy="54" rx="10" ry="8" fill="${F.hvit}"/>` })}
    <path d="M30 56 L4 74 L10 76 L34 62 Z" fill="${F.svart}"/>`,
  fuglLedning: `
    <path d="M0 34 Q50 52 100 34" stroke="${F.morkgra}" stroke-width="3" fill="none"/>
    ${p(fugl({ kropp: F.svart, nebb: F.morkgul, rx: 14, ry: 10, cy: 34, cx: 42 }), 0, 0, 0.9)}
    ${bakke(F.lysgronn, 86)}`,
  fugleflokk: `
    <path d="M14 30 q8 -9 16 0 q8 -9 16 0" stroke="${F.svart}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M44 52 q9 -10 18 0 q9 -10 18 0" stroke="${F.svart}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M16 68 q7 -8 14 0 q7 -8 14 0" stroke="${F.svart}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M58 20 q6 -7 12 0 q6 -7 12 0" stroke="${F.svart}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  fuglFlyr: `
    <path d="M6 56 Q30 22 50 50 Q70 22 94 56 Q70 46 50 62 Q30 46 6 56 Z" fill="${F.morkgra}"/>
    <circle cx="50" cy="52" r="6" fill="${F.morkgra}"/>`,
  rytter: `
    <g transform="translate(-2 26) scale(0.86)">
      ${firbeint({
        kropp: F.lysbrun, kroppB: 30, kroppH: 18, hodeX: 82, hodeY: 32, hodeR: 10, beinH: 26, beinY: 62,
        bak: `<path d="M20 44 q-12 12 -7 28" stroke="${F.morkbrun}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
        paaKropp: `<path d="M70 28 q8 10 4 22 L64 46 q4 -10 -2 -16 Z" fill="${F.morkbrun}"/>`,
        ekstra: `<path d="M86 30 L96 42 Q97 46 91 46 L84 43 Z" fill="${F.lysbrun}"/>
          <path d="M76 24 L73 14 L81 21 Z" fill="${F.lysbrun}"/>`,
      })}
    </g>
    <g transform="translate(14 13) scale(0.52)">
      <circle cx="50" cy="22" r="12" fill="${F.hud}"/>
      <path d="M36 20 a14 14 0 0 1 28 -2 L64 24 L36 24 Z" fill="${F.morkgra}"/>
      <rect x="38" y="34" width="24" height="28" rx="6" fill="${F.rod}"/>
      <path d="M40 60 L36 84 L50 84 L54 62 Z" fill="${F.hvit}"/>
      <path d="M60 38 L84 52" stroke="${F.rod}" stroke-width="9" stroke-linecap="round"/>
      <path d="M36 82 L30 94 L44 94 L48 84 Z" fill="${F.svart}"/>
    </g>`,
  sauVei: `
    <rect x="0" y="58" width="100" height="42" fill="${F.morkgra}"/>
    <path d="M0 78 L100 78" stroke="${F.gul}" stroke-width="4" stroke-dasharray="12 10"/>
    ${p(firbeint({ kropp: F.hvit, hode: F.svart, kroppB: 22, kroppH: 15, hodeX: 74, hodeY: 44, hodeR: 8, beinFarge: F.svart, beinH: 16, beinY: 60 }), -4, 2, 0.78)}
    ${p(firbeint({ kropp: F.hvit, hode: F.svart, kroppB: 16, kroppH: 11, hodeX: 72, hodeY: 46, hodeR: 6, beinFarge: F.svart, beinH: 12, beinY: 62 }), 36, 16, 0.5)}`,

  // ============================================================ SKILT
  fart30: skiltFart('30'),
  fart40: skiltFart('40'),
  fart50: skiltFart('50'),
  fart60: skiltFart('60'),
  fart70: skiltFart('70'),
  fart80: skiltFart('80'),
  fart90: skiltFart('90'),
  fart100: skiltFart('100'),
  fart110: skiltFart('110'),
  stopp: `${skiltStolpe}
    <path d="M36 10 L64 10 L84 30 L84 58 L64 78 L36 78 L16 58 L16 30 Z" fill="${F.rod}"/>
    <text x="50" y="45" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="20" fill="${F.hvit}">STOP</text>`,
  vikeplikt: `${skiltStolpe}
    <path d="M10 12 L90 12 L50 76 Z" fill="${F.rod}"/>
    <path d="M26 22 L74 22 L50 60 Z" fill="${F.hvit}"/>`,
  forkjorsvei: `${skiltStolpe}
    <path d="M50 8 L86 42 L50 76 L14 42 Z" fill="${F.hvit}" stroke="${F.svart}" stroke-width="3"/>
    <path d="M50 20 L74 42 L50 64 L26 42 Z" fill="${F.gul}"/>`,
  innkjoringForbudt: skiltRundt(`<rect x="30" y="37" width="40" height="10" rx="2" fill="${F.hvit}"/>`, { ring: F.rod, bunn: F.rod }),
  elgskilt: skiltTrekant(p(`
    <path d="M30 60 L30 48 M42 60 L42 46 M58 60 L58 46 M70 62 L70 48" stroke="${F.svart}" stroke-width="4"/>
    <ellipse cx="50" cy="42" rx="22" ry="11" fill="${F.svart}"/>
    <circle cx="72" cy="30" r="8" fill="${F.svart}"/>
    <path d="M76 28 L84 34 L72 34 Z" fill="${F.svart}"/>
    <path d="M66 22 L56 10 L64 12 M78 22 L88 10 L80 12" stroke="${F.svart}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`, 0, 6, 0.78)),
  barneskilt: skiltTrekant(`
    ${gubbe(F.svart, 40, 46, 0.9)}
    ${gubbe(F.svart, 60, 50, 0.7)}`),
  gangfeltSkilt: skiltBla(`
    <path d="M22 62 L78 62 L78 66 L22 66 Z" fill="${F.hvit}"/>
    <path d="M26 46 L34 46 L34 62 L26 62 Z M40 46 L48 46 L48 62 L40 62 Z M54 46 L62 46 L62 62 L54 62 Z M68 46 L76 46 L76 62 L68 62 Z" fill="${F.hvit}"/>
    ${gubbe(F.hvit, 44, 36, 0.8)}`),
  rundkjoringSkilt: skiltBlaRund(`
    <path d="M50 24 a18 18 0 1 0 12 5" stroke="${F.hvit}" stroke-width="6" fill="none"/>
    <path d="M62 20 L68 32 L56 32 Z" fill="${F.hvit}"/>
    <path d="M36 52 L30 64 L42 64 Z" fill="${F.hvit}"/>
    <path d="M70 52 L76 64 L64 64 Z" fill="${F.hvit}"/>`),
  glatt: skiltTrekant(`
    ${p(bil(F.svart), 0, -2, 0.5)}
    <path d="M22 66 q8 -6 14 0 M64 66 q8 -6 14 0" stroke="${F.svart}" stroke-width="3.5" fill="none"/>`),
  veiarbeidSkilt: skiltTrekant(`
    ${gubbe(F.svart, 46, 46, 0.9)}
    <path d="M56 32 L74 52" stroke="${F.svart}" stroke-width="5"/>
    <path d="M70 46 L82 58 L76 64 L64 52 Z" fill="${F.svart}"/>
    <rect x="24" y="62" width="52" height="5" fill="${F.svart}"/>`),
  steinsprang: skiltTrekant(`
    <path d="M26 24 L26 66" stroke="${F.svart}" stroke-width="6"/>
    <circle cx="44" cy="36" r="7" fill="${F.svart}"/>
    <circle cx="58" cy="52" r="9" fill="${F.svart}"/>
    <circle cx="44" cy="62" r="5" fill="${F.svart}"/>
    <circle cx="70" cy="64" r="4" fill="${F.svart}"/>`),
  tunnelSkilt: skiltBla(`
    <path d="M28 66 L28 46 a22 22 0 0 1 44 0 L72 66 Z" fill="${F.hvit}"/>
    <path d="M38 66 L38 50 a12 12 0 0 1 24 0 L62 66 Z" fill="${F.dypbla}"/>`),
  bensinSkilt: skiltBla(`
    <path d="M32 66 L32 26 C32 23 34 22 36 22 L54 22 C56 22 58 23 58 26 L58 66 Z" fill="${F.hvit}"/>
    <rect x="36" y="28" width="18" height="12" fill="${F.dypbla}"/>
    <path d="M58 32 L68 32 C70 32 71 34 71 36 L71 54 C71 58 66 58 66 54 L66 42 L58 42" stroke="${F.hvit}" stroke-width="4" fill="none"/>`),
  rasteplassSkilt: skiltBla(`
    <rect x="22" y="44" width="56" height="7" rx="2" fill="${F.hvit}"/>
    <rect x="28" y="51" width="6" height="18" fill="${F.hvit}"/><rect x="66" y="51" width="6" height="18" fill="${F.hvit}"/>
    <rect x="18" y="56" width="16" height="6" fill="${F.hvit}"/><rect x="66" y="56" width="16" height="6" fill="${F.hvit}"/>
    <path d="M44 24 L44 40 M50 22 L50 40 M56 24 L56 40" stroke="${F.hvit}" stroke-width="3.5"/>`),
  campingSkilt: skiltBla(`
    <path d="M50 24 L78 66 L22 66 Z" fill="${F.hvit}"/>
    <path d="M50 40 L64 66 L36 66 Z" fill="${F.dypbla}"/>
    <path d="M50 20 L50 26" stroke="${F.hvit}" stroke-width="4"/>`),
  motorveiSkilt: skiltBla(`
    <path d="M34 66 L34 34 L28 34 L44 18 L60 34 L54 34 L54 66 Z" fill="${F.hvit}"/>
    <rect x="62" y="34" width="8" height="32" fill="${F.hvit}"/>
    <path d="M20 66 L20 44" stroke="${F.hvit}" stroke-width="6"/>`, { bunn: '#1B7F3F' }),
  bomSkilt: skiltBla(`
    <rect x="18" y="40" width="10" height="28" fill="${F.hvit}"/>
    <rect x="26" y="42" width="56" height="8" fill="${F.hvit}"/>
    <rect x="34" y="42" width="10" height="8" fill="${F.rod}"/>
    <rect x="56" y="42" width="10" height="8" fill="${F.rod}"/>
    <text x="50" y="62" text-anchor="middle" font-family="Verdana, sans-serif" font-weight="700" font-size="13" fill="${F.hvit}">BOM</text>`),
  ferjeSkilt: skiltBla(`
    <path d="M18 54 L82 54 L74 68 L26 68 Z" fill="${F.hvit}"/>
    <rect x="34" y="38" width="32" height="16" fill="${F.hvit}"/>
    <rect x="48" y="24" width="5" height="14" fill="${F.hvit}"/>
    <path d="M14 70 q10 -5 18 0 t18 0 t18 0 t18 0" stroke="${F.hvit}" stroke-width="3" fill="none"/>`),
  stedsnavn: `${skiltStolpe}
    <rect x="6" y="28" width="88" height="34" rx="3" fill="${F.hvit}" stroke="${F.svart}" stroke-width="3"/>
    <rect x="16" y="38" width="68" height="6" rx="3" fill="${F.gra}"/>
    <rect x="26" y="48" width="48" height="5" rx="2.5" fill="${F.lysgra}"/>`,
  fylkesgrense: `${skiltStolpe}
    <rect x="6" y="24" width="88" height="40" rx="3" fill="${F.hvit}" stroke="${F.svart}" stroke-width="3"/>
    <path d="M50 24 L50 64" stroke="${F.rod}" stroke-width="4" stroke-dasharray="6 5"/>
    <rect x="14" y="36" width="26" height="6" rx="3" fill="${F.gra}"/>
    <rect x="60" y="36" width="26" height="6" rx="3" fill="${F.gra}"/>
    <rect x="18" y="48" width="18" height="5" rx="2.5" fill="${F.lysgra}"/>
    <rect x="64" y="48" width="18" height="5" rx="2.5" fill="${F.lysgra}"/>`,
  hoyde: skiltRundt(`
    <path d="M26 26 L26 58 M74 26 L74 58" stroke="${F.svart}" stroke-width="5"/>
    <path d="M32 42 L68 42 M36 36 L32 42 L36 48 M64 36 L68 42 L64 48" stroke="${F.svart}" stroke-width="4" fill="none" stroke-linejoin="round"/>
    <text x="50" y="58" text-anchor="middle" font-family="Verdana, sans-serif" font-weight="700" font-size="14" fill="${F.svart}">4,0</text>`),
  sykehusSkilt: skiltBla(`
    <rect x="42" y="24" width="16" height="48" fill="${F.hvit}"/>
    <rect x="26" y="40" width="48" height="16" fill="${F.hvit}"/>`),

  // ============================================================ HUS
  husRodt: hus(F.dyprod),
  husHvitt: hus(F.hvit, F.morkgra),
  husGult: hus(F.gul, F.morkbrun),
  husBlatt: hus(F.bla, F.morkgra),
  laave: `
    <path d="M50 10 L92 32 L92 40 L8 40 L8 32 Z" fill="${F.morkbrun}"/>
    <rect x="12" y="40" width="76" height="48" fill="${F.dyprod}"/>
    <rect x="36" y="56" width="28" height="32" fill="${F.morkbrun}"/>
    <path d="M36 56 L64 88 M64 56 L36 88" stroke="${F.beige}" stroke-width="3"/>
    <rect x="18" y="48" width="12" height="12" fill="${F.beige}"/>
    <rect x="70" y="48" width="12" height="12" fill="${F.beige}"/>`,
  stabbur: `
    <path d="M50 8 L94 34 L6 34 Z" fill="${F.morkbrun}"/>
    <rect x="18" y="34" width="64" height="30" fill="${F.dyprod}"/>
    <rect x="42" y="42" width="16" height="22" fill="${F.morkbrun}"/>
    <rect x="12" y="64" width="76" height="7" fill="${F.lysbrun}"/>
    <rect x="24" y="71" width="9" height="18" fill="${F.morkbrun}"/>
    <rect x="46" y="71" width="9" height="18" fill="${F.morkbrun}"/>
    <rect x="68" y="71" width="9" height="18" fill="${F.morkbrun}"/>`,
  hytte: `
    ${bakke(F.lysgronn, 84)}
    <path d="M50 16 L90 48 L10 48 Z" fill="${F.morkgronn}"/>
    <rect x="20" y="48" width="60" height="36" fill="${F.morkbrun}"/>
    <path d="M20 56 L80 56 M20 66 L80 66 M20 76 L80 76" stroke="${F.lysbrun}" stroke-width="2"/>
    <rect x="44" y="62" width="14" height="22" fill="${F.dyprod}"/>
    <rect x="26" y="58" width="12" height="12" fill="${F.gul}"/>
    <rect x="66" y="26" width="8" height="16" fill="${F.gra}"/>`,
  kirke: `
    <rect x="30" y="46" width="52" height="42" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <path d="M56 32 L88 46 L24 46 Z" fill="${F.morkgra}"/>
    <rect x="8" y="40" width="26" height="48" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <path d="M21 4 L38 40 L4 40 Z" fill="${F.morkgra}"/>
    <path d="M21 0 L21 -2 M18 2 L24 2" stroke="${F.gul}" stroke-width="3"/>
    <rect x="17" y="6" width="8" height="3" fill="${F.gul}"/><rect x="19.5" y="1" width="3" height="10" fill="${F.gul}"/>
    <path d="M44 60 a8 8 0 0 1 16 0 L60 80 L44 80 Z" fill="${F.rute}"/>
    <rect x="66" y="58" width="10" height="14" rx="5" fill="${F.rute}"/>`,
  stavkirke: `
    <path d="M50 2 L58 16 L42 16 Z" fill="${F.morkbrun}"/>
    <path d="M50 12 L70 38 L30 38 Z" fill="${F.morkbrun}"/>
    <path d="M50 30 L84 62 L16 62 Z" fill="${F.morkbrun}"/>
    <rect x="26" y="62" width="48" height="26" fill="#3E2A1A"/>
    <path d="M26 62 L6 84 L26 84 Z" fill="${F.morkbrun}"/>
    <path d="M74 62 L94 84 L74 84 Z" fill="${F.morkbrun}"/>
    <rect x="44" y="70" width="12" height="18" fill="#26180E"/>
    <path d="M36 18 L32 10 M64 18 L68 10" stroke="${F.morkbrun}" stroke-width="3" stroke-linecap="round"/>`,
  bensinstasjon: `
    <rect x="8" y="20" width="84" height="14" rx="3" fill="${F.rod}"/>
    <rect x="14" y="34" width="8" height="54" fill="${F.gra}"/>
    <rect x="78" y="34" width="8" height="54" fill="${F.gra}"/>
    <rect x="34" y="50" width="32" height="38" rx="3" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="40" y="56" width="20" height="14" fill="${F.rute}"/>
    <rect x="44" y="74" width="12" height="14" fill="${F.morkgra}"/>
    <rect x="8" y="88" width="84" height="6" fill="${F.morkgra}"/>`,
  ladestasjon: `
    <rect x="30" y="20" width="40" height="66" rx="6" fill="${F.morkgra}"/>
    <rect x="37" y="28" width="26" height="20" rx="3" fill="${F.lysgronn}"/>
    <path d="M52 54 L44 70 L50 70 L46 84 L60 64 L53 64 Z" fill="${F.gul}"/>
    <path d="M30 40 C16 40 16 58 16 70" stroke="${F.svart}" stroke-width="5" fill="none"/>
    <rect x="10" y="68" width="12" height="10" rx="3" fill="${F.svart}"/>
    <rect x="22" y="86" width="56" height="8" rx="2" fill="${F.gra}"/>`,
  butikk: `
    <rect x="8" y="34" width="84" height="54" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="8" y="22" width="84" height="14" rx="3" fill="${F.gronn}"/>
    <rect x="16" y="26" width="46" height="6" rx="3" fill="${F.hvit}" opacity=".8"/>
    <path d="M8 38 L20 50 L32 38 L44 50 L56 38 L68 50 L80 38 L92 50 L92 38 Z" fill="${F.rod}"/>
    <rect x="18" y="54" width="28" height="22" fill="${F.rute}"/>
    <rect x="58" y="54" width="24" height="34" fill="${F.morkgra}"/>
    <rect x="12" y="80" width="40" height="8" fill="${F.lysgra}"/>`,
  skole: `
    <rect x="10" y="38" width="80" height="50" fill="${F.dyprod}"/>
    <path d="M50 18 L96 40 L4 40 Z" fill="${F.morkgra}"/>
    <rect x="20" y="48" width="14" height="14" fill="${F.rute}"/>
    <rect x="43" y="48" width="14" height="14" fill="${F.rute}"/>
    <rect x="66" y="48" width="14" height="14" fill="${F.rute}"/>
    <rect x="40" y="68" width="20" height="20" fill="${F.beige}"/>
    <rect x="46" y="24" width="8" height="12" fill="${F.hvit}"/>
    <circle cx="50" cy="30" r="6" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>`,
  fyrtaarn: `
    ${vannflate(80)}
    <path d="M36 78 L40 30 L60 30 L64 78 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <path d="M38.4 50 L61.6 50 L62.4 62 L37.6 62 Z" fill="${F.rod}"/>
    <path d="M39.2 38 L60.8 38 L61.2 44 L38.8 44 Z" fill="${F.rod}"/>
    <rect x="34" y="22" width="32" height="9" rx="2" fill="${F.morkgra}"/>
    <rect x="40" y="10" width="20" height="13" fill="${F.gul}"/>
    <path d="M38 8 L62 8 L58 4 L42 4 Z" fill="${F.morkgra}"/>
    <path d="M60 16 L92 8 M60 20 L92 28" stroke="${F.gul}" stroke-width="3" opacity=".7"/>`,
  silo: `
    ${bakke(F.lysgronn, 86)}
    <rect x="18" y="28" width="28" height="58" rx="2" fill="${F.lysgra}" stroke="${F.morkgra}" stroke-width="2"/>
    <path d="M18 28 a14 8 0 0 1 28 0 Z" fill="${F.gra}"/>
    <rect x="52" y="20" width="28" height="66" rx="2" fill="${F.lysgra}" stroke="${F.morkgra}" stroke-width="2"/>
    <path d="M52 20 a14 8 0 0 1 28 0 Z" fill="${F.gra}"/>
    <path d="M22 40 L42 40 M22 54 L42 54 M56 34 L76 34 M56 50 L76 50 M56 66 L76 66" stroke="${F.gra}" stroke-width="2"/>`,
  fabrikk: `
    <rect x="62" y="12" width="14" height="76" fill="${F.gra}"/>
    <rect x="60" y="12" width="18" height="6" fill="${F.morkgra}"/>
    <circle cx="69" cy="6" r="7" fill="${F.lysgra}" opacity=".85"/>
    <circle cx="82" cy="0" r="9" fill="${F.lysgra}" opacity=".7"/>
    <rect x="8" y="46" width="52" height="42" fill="${F.morkgra}"/>
    <path d="M8 46 L20 32 L20 46 Z M20 46 L32 32 L32 46 Z M32 46 L44 32 L44 46 Z M44 46 L56 32 L56 46 Z" fill="${F.gra}"/>
    <rect x="14" y="56" width="12" height="12" fill="${F.gul}"/>
    <rect x="34" y="56" width="12" height="12" fill="${F.gul}"/>
    <rect x="76" y="80" width="18" height="8" fill="${F.morkgra}"/>`,
  kran: `
    <rect x="42" y="18" width="10" height="70" fill="${F.gul}"/>
    <path d="M42 26 L52 34 M52 26 L42 34 M42 42 L52 50 M52 42 L42 50 M42 58 L52 66 M52 58 L42 66 M42 74 L52 82 M52 74 L42 82" stroke="${F.morkgul}" stroke-width="2.5"/>
    <rect x="8" y="14" width="84" height="9" fill="${F.gul}"/>
    <path d="M10 14 L24 23 M24 14 L38 23 M56 14 L70 23 M70 14 L84 23" stroke="${F.morkgul}" stroke-width="2.5"/>
    <path d="M47 14 L28 2 L74 2 Z" fill="none" stroke="${F.gul}" stroke-width="3"/>
    <path d="M78 23 L78 46" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="71" y="46" width="14" height="10" fill="${F.morkgra}"/>
    <rect x="28" y="84" width="38" height="8" fill="${F.morkgra}"/>`,
  drivhus: `
    ${bakke(F.lysgronn, 88)}
    <path d="M50 18 L88 44 L12 44 Z" fill="${F.rute}" stroke="${F.hvit}" stroke-width="3"/>
    <rect x="16" y="44" width="68" height="44" fill="${F.rute}" stroke="${F.hvit}" stroke-width="3"/>
    <path d="M38 44 L38 88 M62 44 L62 88 M16 66 L84 66" stroke="${F.hvit}" stroke-width="3"/>
    <path d="M24 82 q4 -12 8 0 M70 82 q4 -12 8 0" stroke="${F.gronn}" stroke-width="3.5" fill="none"/>`,
  naust: `
    ${vannflate(80)}
    <path d="M50 14 L88 42 L12 42 Z" fill="${F.morkbrun}"/>
    <rect x="20" y="42" width="60" height="38" fill="${F.dyprod}"/>
    <path d="M36 46 a14 14 0 0 1 28 0 L64 80 L36 80 Z" fill="#26180E"/>
    <rect x="14" y="78" width="72" height="5" fill="${F.morkbrun}"/>`,
  brygge: `
    ${vannflate(62)}
    <rect x="4" y="52" width="80" height="9" fill="${F.lysbrun}"/>
    <rect x="14" y="61" width="7" height="26" fill="${F.morkbrun}"/>
    <rect x="42" y="61" width="7" height="26" fill="${F.morkbrun}"/>
    <rect x="70" y="61" width="7" height="26" fill="${F.morkbrun}"/>
    <rect x="80" y="36" width="9" height="20" rx="4" fill="${F.morkbrun}"/>
    <path d="M84 36 q10 -4 6 -10" stroke="${F.beige}" stroke-width="3" fill="none"/>`,
  solcelle: `
    ${hus(F.hvit, F.morkgra, { dor: true })}
    <path d="M50 18 L82 42 L50 42 Z" fill="#1B2A44"/>
    <path d="M58 24 L58 42 M66 30 L66 42 M74 36 L74 42 M53 30 L74 30 M51 36 L78 36" stroke="#4A6FA5" stroke-width="2"/>`,
  lekeplass: `
    ${bakke(F.sand, 84)}
    <path d="M14 84 L26 24 L38 84 M20 54 L32 54" stroke="${F.rod}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M26 24 L66 24" stroke="${F.rod}" stroke-width="5" stroke-linecap="round"/>
    <path d="M62 24 L74 84 M74 24 L62 84" stroke="${F.rod}" stroke-width="5" stroke-linecap="round"/>
    <path d="M36 26 L36 52 M52 26 L52 52" stroke="${F.morkgra}" stroke-width="3"/>
    <rect x="32" y="52" width="24" height="6" rx="3" fill="${F.gul}"/>`,
  fotballbane: `
    <rect x="0" y="22" width="100" height="62" rx="4" fill="${F.lysgronn}"/>
    <rect x="0" y="22" width="100" height="62" rx="4" fill="none" stroke="${F.hvit}" stroke-width="3"/>
    <path d="M50 22 L50 84" stroke="${F.hvit}" stroke-width="3"/>
    <circle cx="50" cy="53" r="14" fill="none" stroke="${F.hvit}" stroke-width="3"/>
    <rect x="0" y="38" width="12" height="30" fill="none" stroke="${F.hvit}" stroke-width="3"/>
    <rect x="88" y="38" width="12" height="30" fill="none" stroke="${F.hvit}" stroke-width="3"/>
    <circle cx="50" cy="53" r="6" fill="${F.hvit}"/>
    <path d="M50 48 L54 52 L52 58 L48 58 L46 52 Z" fill="${F.svart}"/>`,
  busskur: `
    ${bakke(F.lysgra, 86)}
    <rect x="10" y="24" width="80" height="8" rx="3" fill="${F.morkgra}"/>
    <rect x="12" y="32" width="8" height="54" fill="${F.morkgra}"/>
    <rect x="80" y="32" width="8" height="54" fill="${F.morkgra}"/>
    <rect x="20" y="32" width="60" height="42" fill="${F.rute}" opacity=".8"/>
    <rect x="24" y="66" width="52" height="8" rx="3" fill="${F.morkbrun}"/>
    <rect x="46" y="8" width="6" height="16" fill="${F.gra}"/>
    <circle cx="49" cy="8" r="9" fill="${F.hvit}" stroke="${F.gronn}" stroke-width="3"/>`,
  melkerampe: `
    ${bakke(F.lysgronn, 86)}
    <rect x="16" y="56" width="68" height="8" fill="${F.lysbrun}"/>
    <rect x="22" y="64" width="8" height="22" fill="${F.morkbrun}"/>
    <rect x="70" y="64" width="8" height="22" fill="${F.morkbrun}"/>
    <path d="M36 56 L38 32 L46 32 L48 56 Z" fill="${F.lysgra}" stroke="${F.morkgra}" stroke-width="2"/>
    <rect x="36" y="28" width="12" height="5" rx="2" fill="${F.gra}"/>
    <path d="M56 56 L58 36 L66 36 L68 56 Z" fill="${F.lysgra}" stroke="${F.morkgra}" stroke-width="2"/>
    <rect x="56" y="32" width="12" height="5" rx="2" fill="${F.gra}"/>`,
  postkasser: `
    ${bakke(F.lysgronn, 86)}
    <rect x="18" y="62" width="6" height="26" fill="${F.morkbrun}"/>
    <rect x="47" y="62" width="6" height="26" fill="${F.morkbrun}"/>
    <rect x="76" y="62" width="6" height="26" fill="${F.morkbrun}"/>
    <path d="M8 44 a13 10 0 0 1 26 0 L34 62 L8 62 Z" fill="${F.gronn}"/>
    <path d="M37 44 a13 10 0 0 1 26 0 L63 62 L37 62 Z" fill="${F.rod}"/>
    <path d="M66 44 a13 10 0 0 1 26 0 L92 62 L66 62 Z" fill="${F.bla}"/>
    <rect x="14" y="52" width="14" height="4" fill="${F.morkgronn}"/>
    <rect x="43" y="52" width="14" height="4" fill="${F.dyprod}"/>
    <rect x="72" y="52" width="14" height="4" fill="${F.dypbla}"/>`,

  // ============================================================ NATUR
  fjell: `
    <path d="M0 88 L30 34 L52 66 L68 44 L100 88 Z" fill="${F.gra}"/>
    <path d="M30 34 L42 56 L18 56 Z" fill="${F.lysgra}"/>
    <path d="M68 44 L78 62 L58 62 Z" fill="${F.lysgra}"/>
    ${bakke(F.lysgronn, 86)}`,
  snofjell: `
    <path d="M0 88 L32 26 L54 62 L70 38 L100 88 Z" fill="${F.gra}"/>
    <path d="M32 26 L46 54 L18 54 Z" fill="${F.sno}"/>
    <path d="M70 38 L82 60 L58 60 Z" fill="${F.sno}"/>
    <path d="M18 54 q6 6 14 2 q8 6 14 -2" fill="${F.sno}"/>
    ${bakke(F.lysgronn, 86)}`,
  fjord: `
    <path d="M0 82 L0 18 L26 18 L36 64 L46 24 L58 64 L66 20 L100 20 L100 82 Z" fill="${F.gra}"/>
    <path d="M0 18 L12 36 L-6 36 Z M46 24 L56 44 L36 44 Z M66 20 L78 40 L54 40 Z" fill="${F.lysgra}"/>
    ${vannflate(72, F.dypbla)}
    <path d="M0 72 L100 72" stroke="${F.vann}" stroke-width="4"/>`,
  innsjo: `
    ${bakke(F.lysgronn, 54)}
    <ellipse cx="50" cy="70" rx="46" ry="22" fill="${F.vann}"/>
    <path d="M18 66 q8 -4 16 0 t16 0" stroke="${F.hvit}" stroke-width="2.5" fill="none" opacity=".7"/>
    <path d="M44 78 q8 -4 16 0 t14 0" stroke="${F.hvit}" stroke-width="2.5" fill="none" opacity=".7"/>
    ${pos(gran(), 16, 40, 0.3)}${pos(gran(), 86, 44, 0.26)}`,
  elv: `
    ${bakke(F.lysgronn, 20)}
    <path d="M32 100 C32 74 16 66 16 44 C16 24 30 14 42 6 L70 6 C56 18 44 28 44 46 C44 68 62 76 62 100 Z" fill="${F.vann}"/>
    <path d="M40 90 q4 -10 0 -20 M52 80 q-4 -12 2 -22" stroke="${F.hvit}" stroke-width="2.5" fill="none" opacity=".6"/>`,
  foss: `
    <path d="M0 100 L0 10 L34 10 L34 62 L0 62 Z" fill="${F.gra}"/>
    <path d="M100 100 L100 10 L66 10 L66 62 L100 62 Z" fill="${F.gra}"/>
    <path d="M34 10 L66 10 L66 74 L34 74 Z" fill="${F.hvit}"/>
    <path d="M40 16 L40 72 M50 12 L50 74 M60 16 L60 72" stroke="${F.vann}" stroke-width="3.5"/>
    <ellipse cx="50" cy="82" rx="30" ry="12" fill="${F.vann}"/>
    <path d="M32 82 q6 -5 12 0 t12 0" stroke="${F.hvit}" stroke-width="3" fill="none"/>`,
  skog: `
    ${bakke(F.lysgronn, 82)}
    ${pos(gran('#1B6E4A'), 20, 50, 0.62)}
    ${pos(gran('#2A9D5C'), 52, 42, 0.82)}
    ${pos(gran('#1B6E4A'), 82, 52, 0.66)}
    ${pos(gran('#2A9D5C'), 34, 64, 0.44)}`,
  stortTre: tre(F.gronn),
  bjork: `
    ${bakke(F.lysgronn, 88)}
    <rect x="45" y="46" width="10" height="42" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="1.5"/>
    <path d="M45 56 L52 56 M48 66 L55 66 M45 76 L51 76" stroke="${F.svart}" stroke-width="2.5"/>
    <circle cx="50" cy="34" r="24" fill="${F.lysgronn}"/>
    <circle cx="32" cy="46" r="15" fill="${F.lysgronn}"/>
    <circle cx="68" cy="46" r="15" fill="${F.lysgronn}"/>`,
  aaker: `
    <rect x="0" y="0" width="100" height="44" fill="${F.bla}" opacity=".25"/>
    <path d="M0 44 L100 44 L100 100 L0 100 Z" fill="#D9B24C"/>
    <path d="M0 58 L100 50 M0 72 L100 62 M0 88 L100 76" stroke="#B8902F" stroke-width="3"/>
    <path d="M22 44 L22 24 M26 28 q-6 -6 -4 -10 M18 28 q6 -6 4 -10" stroke="#B8902F" stroke-width="3" fill="none"/>
    <path d="M74 44 L74 26 M78 30 q-6 -6 -4 -10 M70 30 q6 -6 4 -10" stroke="#B8902F" stroke-width="3" fill="none"/>`,
  rundballer: `
    ${bakke(F.lysgronn, 62)}
    <circle cx="28" cy="62" r="22" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <circle cx="28" cy="62" r="11" fill="${F.lysgra}"/>
    <circle cx="72" cy="70" r="17" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <circle cx="72" cy="70" r="8" fill="${F.lysgra}"/>`,
  steingjerde: `
    ${bakke(F.lysgronn, 76)}
    <g fill="${F.gra}" stroke="${F.morkgra}" stroke-width="1.5">
      <ellipse cx="14" cy="70" rx="13" ry="9"/><ellipse cx="40" cy="70" rx="14" ry="9"/>
      <ellipse cx="66" cy="70" rx="13" ry="9"/><ellipse cx="90" cy="70" rx="11" ry="9"/>
      <ellipse cx="26" cy="54" rx="13" ry="9"/><ellipse cx="54" cy="54" rx="14" ry="9"/>
      <ellipse cx="80" cy="54" rx="12" ry="9"/>
      <ellipse cx="40" cy="40" rx="12" ry="8"/><ellipse cx="66" cy="40" rx="12" ry="8"/>
    </g>`,
  storStein: `
    ${bakke(F.lysgronn, 80)}
    <path d="M14 80 L22 36 L48 20 L78 34 L88 80 Z" fill="${F.gra}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <path d="M48 20 L44 52 L22 36 M48 20 L56 56 L78 34 M44 52 L88 80 M44 52 L14 80" stroke="${F.morkgra}" stroke-width="2" fill="none"/>
    <path d="M30 26 q10 -6 18 -2" stroke="${F.lysgronn}" stroke-width="4" fill="none"/>`,
  strand: `
    <rect x="0" y="0" width="100" height="42" fill="#B8E3F5"/>
    ${vannflate(42, F.vann)}
    <path d="M0 100 L0 66 Q50 58 100 66 L100 100 Z" fill="${F.sand}"/>
    <path d="M0 68 q10 -6 20 0 t20 0 t20 0 t20 0" stroke="${F.hvit}" stroke-width="3" fill="none"/>
    <circle cx="76" cy="80" r="5" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="1.5"/>
    <circle cx="24" cy="86" r="4" fill="${F.rosa}"/>`,
  holme: `
    ${vannflate(56, F.vann)}
    <path d="M22 56 q28 -22 56 0 Z" fill="${F.gra}"/>
    <path d="M30 56 q20 -14 40 0 Z" fill="${F.lysgronn}"/>
    ${pos(gran(), 50, 42, 0.28)}
    <path d="M10 72 q8 -5 16 0 t16 0 t16 0 t16 0" stroke="${F.hvit}" stroke-width="3" fill="none" opacity=".7"/>`,
  blomstereng: `
    ${bakke(F.lysgronn, 44)}
    <g>
      <path d="M18 88 L18 66 M48 90 L48 62 M76 88 L76 68 M32 92 L32 76 M62 92 L62 74" stroke="${F.morkgronn}" stroke-width="3"/>
      <circle cx="18" cy="62" r="7" fill="${F.gul}"/><circle cx="18" cy="62" r="3" fill="${F.oransje}"/>
      <circle cx="48" cy="58" r="8" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="1.5"/><circle cx="48" cy="58" r="3.5" fill="${F.gul}"/>
      <circle cx="76" cy="64" r="7" fill="${F.rosa}"/><circle cx="76" cy="64" r="3" fill="${F.hvit}"/>
      <circle cx="32" cy="72" r="5" fill="${F.lilla}"/>
      <circle cx="62" cy="70" r="5" fill="${F.rod}"/>
    </g>`,
  lupiner: `
    ${bakke(F.lysgronn, 62)}
    <g>
      <path d="M22 88 L22 46 M44 90 L44 38 M66 88 L66 44 M86 90 L86 52" stroke="${F.morkgronn}" stroke-width="3.5"/>
      <path d="M22 46 q-8 6 0 10 q8 -4 0 -10 M22 54 q-9 6 0 11 q9 -5 0 -11 M22 63 q-9 6 0 11 q9 -5 0 -11" fill="${F.lilla}"/>
      <path d="M44 38 q-9 6 0 11 q9 -5 0 -11 M44 47 q-10 6 0 12 q10 -6 0 -12 M44 57 q-10 6 0 12 q10 -6 0 -12" fill="#7B54C9"/>
      <path d="M66 44 q-8 6 0 10 q8 -4 0 -10 M66 52 q-9 6 0 11 q9 -5 0 -11 M66 61 q-9 6 0 11 q9 -5 0 -11" fill="${F.rosa}"/>
      <path d="M86 52 q-7 5 0 9 q7 -4 0 -9 M86 59 q-8 5 0 10 q8 -5 0 -10" fill="${F.lilla}"/>
    </g>`,
  hostfarger: `
    <rect x="45" y="56" width="10" height="34" rx="2" fill="${F.morkbrun}"/>
    <circle cx="50" cy="38" r="25" fill="${F.oransje}"/>
    <circle cx="31" cy="50" r="16" fill="${F.gul}"/>
    <circle cx="69" cy="50" r="16" fill="#D4572A"/>
    <circle cx="44" cy="30" r="12" fill="${F.gul}"/>
    <path d="M16 78 q4 -6 8 0 q-4 6 -8 0 M80 84 q4 -6 8 0 q-4 6 -8 0 M28 90 q4 -6 8 0 q-4 6 -8 0" fill="${F.oransje}"/>`,
  snoBakken: `
    <rect x="0" y="0" width="100" height="60" fill="#CBE4F5"/>
    <path d="M0 100 L0 60 Q30 50 54 58 Q78 66 100 56 L100 100 Z" fill="${F.sno}" stroke="${F.lysgra}" stroke-width="2"/>
    ${pos(gran('#20614A'), 20, 52, 0.5)}
    ${pos(gran('#20614A'), 80, 58, 0.4)}
    <circle cx="20" cy="18" r="3" fill="${F.hvit}"/><circle cx="52" cy="12" r="3" fill="${F.hvit}"/>
    <circle cx="80" cy="24" r="3" fill="${F.hvit}"/><circle cx="36" cy="34" r="2.5" fill="${F.hvit}"/>`,
  isVann: `
    <rect x="0" y="0" width="100" height="46" fill="#CBE4F5"/>
    <path d="M0 100 L0 46 L100 46 L100 100 Z" fill="#AFD8EC"/>
    <path d="M0 62 L34 54 L70 66 L100 56" stroke="${F.hvit}" stroke-width="3" fill="none"/>
    <path d="M14 80 L46 72 L82 84" stroke="${F.hvit}" stroke-width="3" fill="none"/>
    <path d="M0 46 L100 46" stroke="${F.hvit}" stroke-width="4"/>
    <path d="M56 46 L72 34 L88 46 Z" fill="${F.sno}"/>`,
  snomann: `
    <rect x="0" y="0" width="100" height="100" fill="#CBE4F5"/>
    <path d="M0 100 L0 84 Q50 76 100 84 L100 100 Z" fill="${F.sno}"/>
    <circle cx="50" cy="74" r="22" fill="${F.sno}" stroke="${F.lysgra}" stroke-width="2"/>
    <circle cx="50" cy="48" r="16" fill="${F.sno}" stroke="${F.lysgra}" stroke-width="2"/>
    <circle cx="50" cy="26" r="12" fill="${F.sno}" stroke="${F.lysgra}" stroke-width="2"/>
    <rect x="38" y="14" width="24" height="5" rx="2" fill="${F.svart}"/>
    <rect x="42" y="2" width="16" height="13" fill="${F.svart}"/>
    <circle cx="46" cy="24" r="2" fill="${F.svart}"/><circle cx="54" cy="24" r="2" fill="${F.svart}"/>
    <path d="M50 28 L62 31 L50 33 Z" fill="${F.oransje}"/>
    <circle cx="50" cy="44" r="2.5" fill="${F.svart}"/><circle cx="50" cy="54" r="2.5" fill="${F.svart}"/>
    <path d="M34 46 L14 34 M12 40 L14 34 L20 34" stroke="${F.morkbrun}" stroke-width="3" fill="none"/>
    <path d="M66 46 L86 34 M80 34 L86 34 L88 40" stroke="${F.morkbrun}" stroke-width="3" fill="none"/>`,
  baat: `
    ${vannflate(64)}
    <path d="M12 58 L86 58 L76 76 L24 76 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="34" y="42" width="30" height="16" rx="3" fill="${F.bla}"/>
    <rect x="40" y="46" width="8" height="8" fill="${F.rute}"/>
    <rect x="52" y="46" width="8" height="8" fill="${F.rute}"/>
    <path d="M6 78 q9 -5 18 0 t18 0 t18 0 t18 0" stroke="${F.hvit}" stroke-width="3" fill="none"/>`,
  seilbaat: `
    ${vannflate(70)}
    <path d="M18 64 L84 64 L74 78 L28 78 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="48" y="8" width="4" height="56" fill="${F.morkbrun}"/>
    <path d="M46 12 L46 60 L14 60 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>
    <path d="M54 20 L54 60 L80 60 Z" fill="${F.rod}"/>
    <path d="M6 80 q9 -5 18 0 t18 0 t18 0 t18 0" stroke="${F.hvit}" stroke-width="3" fill="none"/>`,
  ferje: `
    ${vannflate(70)}
    <path d="M6 58 L94 58 L84 76 L16 76 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="6" y="46" width="88" height="12" fill="${F.dypbla}"/>
    <rect x="26" y="26" width="48" height="20" rx="3" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>
    <rect x="32" y="32" width="9" height="8" fill="${F.rute}"/><rect x="45" y="32" width="9" height="8" fill="${F.rute}"/>
    <rect x="58" y="32" width="9" height="8" fill="${F.rute}"/>
    <rect x="46" y="10" width="7" height="18" fill="${F.rod}"/>
    <path d="M14 50 L28 50 M36 50 L50 50 M58 50 L72 50" stroke="${F.gul}" stroke-width="3"/>`,

  // ============================================================ VEI
  bru: `
    ${vannflate(66, F.vann)}
    <path d="M0 52 L100 52 L100 62 L0 62 Z" fill="${F.lysgra}"/>
    <path d="M2 52 Q50 8 98 52" stroke="${F.rod}" stroke-width="6" fill="none"/>
    <path d="M16 52 L16 30 M32 52 L32 19 M50 52 L50 15 M68 52 L68 19 M84 52 L84 30" stroke="${F.rod}" stroke-width="3"/>
    <rect x="14" y="62" width="10" height="24" fill="${F.gra}"/>
    <rect x="76" y="62" width="10" height="24" fill="${F.gra}"/>`,
  tunnel: `
    <path d="M0 100 L0 30 L100 30 L100 100 Z" fill="${F.gra}"/>
    <path d="M20 100 L20 56 a30 30 0 0 1 60 0 L80 100 Z" fill="${F.svart}"/>
    <path d="M16 100 L16 56 a34 34 0 0 1 68 0 L84 100" fill="none" stroke="${F.lysgra}" stroke-width="6"/>
    <rect x="34" y="72" width="32" height="6" rx="3" fill="${F.gul}" opacity=".8"/>
    <path d="M0 30 L28 12 L72 12 L100 30" fill="${F.lysgronn}"/>`,
  rundkjoring: `
    <rect x="0" y="0" width="100" height="100" fill="${F.lysgronn}"/>
    <path d="M42 0 L58 0 L58 30 L42 30 Z M42 70 L58 70 L58 100 L42 100 Z M0 42 L30 42 L30 58 L0 58 Z M70 42 L100 42 L100 58 L70 58 Z" fill="${F.morkgra}"/>
    <circle cx="50" cy="50" r="34" fill="${F.morkgra}"/>
    <circle cx="50" cy="50" r="14" fill="${F.lysgronn}"/>
    <circle cx="50" cy="50" r="24" fill="none" stroke="${F.hvit}" stroke-width="2.5" stroke-dasharray="7 6"/>
    ${pos(gran(), 50, 50, 0.24)}`,
  bomstasjon: `
    <rect x="0" y="66" width="100" height="34" fill="${F.morkgra}"/>
    <rect x="6" y="14" width="88" height="12" rx="3" fill="${F.gra}"/>
    <rect x="10" y="26" width="10" height="46" fill="${F.gra}"/>
    <rect x="80" y="26" width="10" height="46" fill="${F.gra}"/>
    <rect x="30" y="30" width="16" height="12" rx="2" fill="${F.gul}"/>
    <rect x="54" y="30" width="16" height="12" rx="2" fill="${F.gul}"/>
    <text x="50" y="21" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="9" fill="${F.hvit}">AUTOPASS</text>
    <path d="M0 84 L100 84" stroke="${F.gul}" stroke-width="4" stroke-dasharray="12 10"/>`,
  fotoboks: `
    ${bakke(F.lysgronn, 88)}
    <rect x="44" y="40" width="10" height="48" fill="${F.gra}"/>
    <rect x="26" y="16" width="42" height="34" rx="4" fill="${F.gra}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <circle cx="47" cy="33" r="11" fill="${F.morkgra}"/>
    <circle cx="47" cy="33" r="5" fill="${F.rute}"/>
    <rect x="68" y="22" width="14" height="10" rx="3" fill="${F.gul}"/>
    <path d="M84 20 L92 14 M86 27 L96 27 M84 34 L92 40" stroke="${F.gul}" stroke-width="3" stroke-linecap="round"/>`,
  hoyspent: `
    <path d="M28 92 L36 22 M72 92 L64 22" stroke="${F.gra}" stroke-width="5"/>
    <path d="M36 22 L64 22" stroke="${F.gra}" stroke-width="5"/>
    <path d="M22 44 L78 44 M26 62 L74 62" stroke="${F.gra}" stroke-width="4"/>
    <path d="M34 34 L66 34 M32 52 L68 52 M30 72 L70 72 M36 22 L64 44 M64 22 L36 44 M32 44 L68 62 M68 44 L32 62" stroke="${F.gra}" stroke-width="2.5"/>
    <path d="M0 30 Q22 44 22 44 M78 44 Q78 44 100 30" stroke="${F.morkgra}" stroke-width="2.5" fill="none"/>
    <path d="M0 48 Q26 62 26 62 M74 62 Q74 62 100 48" stroke="${F.morkgra}" stroke-width="2.5" fill="none"/>
    ${bakke(F.lysgronn, 90)}`,
  vindmolle: `
    ${bakke(F.lysgronn, 88)}
    <path d="M46 88 L48 34 L52 34 L54 88 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="1.5"/>
    <circle cx="50" cy="32" r="6" fill="${F.lysgra}" stroke="${F.morkgra}" stroke-width="1.5"/>
    <path d="M50 32 L50 2 L56 6 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="1.5"/>
    <path d="M50 32 L78 48 L74 54 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="1.5"/>
    <path d="M50 32 L22 48 L26 54 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="1.5"/>`,
  demning: `
    <path d="M0 24 L100 24 L100 40 L0 40 Z" fill="${F.vann}"/>
    <path d="M6 40 L94 40 L82 92 L18 92 Z" fill="${F.lysgra}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <path d="M24 40 L18 92 M42 40 L38 92 M58 40 L62 92 M76 40 L82 92" stroke="${F.gra}" stroke-width="2.5"/>
    <path d="M44 92 L44 62 L56 62 L56 92" fill="${F.hvit}" opacity=".9"/>
    <rect x="4" y="34" width="92" height="7" fill="${F.morkgra}"/>`,
  jernbane: `
    ${bakke(F.lysgronn, 46)}
    <rect x="0" y="46" width="100" height="48" fill="#6B5B4A"/>
    <g fill="${F.morkbrun}">
      <rect x="2" y="52" width="96" height="7"/><rect x="2" y="66" width="96" height="7"/><rect x="2" y="80" width="96" height="7"/>
    </g>
    <rect x="22" y="46" width="9" height="48" fill="${F.gra}"/>
    <rect x="68" y="46" width="9" height="48" fill="${F.gra}"/>`,
  tog: `
    <rect x="0" y="80" width="100" height="6" fill="${F.morkbrun}"/>
    <path d="M8 78 L8 34 C8 30 11 28 15 28 L52 28 L52 78 Z" fill="${F.dyprod}"/>
    <path d="M52 78 L52 40 L72 40 L80 52 L92 52 C95 52 96 54 96 57 L96 78 Z" fill="${F.dyprod}"/>
    <rect x="14" y="36" width="14" height="14" rx="2" fill="${F.rute}"/>
    <rect x="33" y="36" width="14" height="14" rx="2" fill="${F.rute}"/>
    <rect x="58" y="46" width="16" height="12" rx="2" fill="${F.rute}"/>
    <rect x="4" y="70" width="92" height="8" fill="${F.morkgra}"/>
    <circle cx="22" cy="80" r="7" fill="${F.svart}"/><circle cx="42" cy="80" r="7" fill="${F.svart}"/>
    <circle cx="64" cy="80" r="7" fill="${F.svart}"/><circle cx="84" cy="80" r="7" fill="${F.svart}"/>
    <circle cx="90" cy="60" r="4" fill="${F.gul}"/>`,
  planovergang: `
    ${bakke(F.lysgronn, 84)}
    <rect x="46" y="30" width="8" height="58" fill="${F.gra}"/>
    <path d="M28 8 L72 44 M72 8 L28 44" stroke="${F.hvit}" stroke-width="10" stroke-linecap="round"/>
    <path d="M28 8 L72 44 M72 8 L28 44" stroke="${F.rod}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="34" cy="54" r="7" fill="${F.rod}"/><circle cx="66" cy="54" r="7" fill="${F.morkgra}"/>`,
  flagg: `
    ${stolpe(24, 8, F.lysgra, 6)}
    <path d="M27 12 L94 12 L94 54 L27 54 Z" fill="${F.rod}"/>
    <path d="M45 12 L45 54 M27 28 L94 28" stroke="${F.hvit}" stroke-width="12"/>
    <path d="M49 12 L49 54 M27 32 L94 32" stroke="${F.dypbla}" stroke-width="6"/>
    ${bakke(F.lysgronn, 90)}`,
  flaggstang: `
    ${bakke(F.lysgronn, 88)}
    <rect x="47" y="10" width="6" height="78" fill="${F.hvit}" stroke="${F.lysgra}" stroke-width="1.5"/>
    <circle cx="50" cy="8" r="5" fill="${F.gul}"/>
    <path d="M53 16 L53 40" stroke="${F.lysgra}" stroke-width="2"/>
    <rect x="30" y="86" width="40" height="6" rx="3" fill="${F.gra}"/>`,
  rasteplass: `
    ${bakke(F.lysgronn, 68)}
    <rect x="18" y="52" width="58" height="8" rx="2" fill="${F.lysbrun}"/>
    <path d="M26 60 L22 84 M68 60 L72 84" stroke="${F.morkbrun}" stroke-width="6"/>
    <rect x="10" y="66" width="24" height="6" rx="2" fill="${F.lysbrun}"/>
    <rect x="60" y="66" width="24" height="6" rx="2" fill="${F.lysbrun}"/>
    ${pos(gran(), 22, 28, 0.32)}
    <rect x="80" y="62" width="12" height="18" rx="2" fill="${F.gronn}"/>`,
  veiarbeid: `
    <rect x="0" y="70" width="100" height="30" fill="${F.morkgra}"/>
    ${gubbe(F.oransje, 34, 48, 1.1)}
    <rect x="26" y="26" width="18" height="6" rx="3" fill="${F.gul}"/>
    <path d="M44 40 L66 62" stroke="${F.morkbrun}" stroke-width="5"/>
    <path d="M62 56 L76 70 L68 78 L54 64 Z" fill="${F.gra}"/>
    <path d="M82 70 L92 44 L96 70 Z" fill="${F.oransje}"/>
    <rect x="80" y="70" width="18" height="5" rx="2" fill="${F.hvit}"/>`,
  kjegler: `
    <rect x="0" y="72" width="100" height="28" fill="${F.morkgra}"/>
    <path d="M22 72 L30 24 L38 72 Z" fill="${F.oransje}"/>
    <rect x="25" y="46" width="10" height="7" fill="${F.hvit}"/>
    <rect x="16" y="72" width="28" height="6" rx="2" fill="${F.oransje}"/>
    <path d="M58 76 L64 38 L70 76 Z" fill="${F.oransje}"/>
    <rect x="60" y="54" width="8" height="6" fill="${F.hvit}"/>
    <rect x="53" y="76" width="22" height="5" rx="2" fill="${F.oransje}"/>
    <path d="M82 80 L86 54 L90 80 Z" fill="${F.oransje}"/>`,
  lyskryss: `
    <rect x="46" y="60" width="8" height="34" fill="${F.gra}"/>
    <rect x="30" y="6" width="40" height="58" rx="8" fill="${F.morkgra}"/>
    <circle cx="50" cy="20" r="10" fill="${F.rod}"/>
    <circle cx="50" cy="36" r="10" fill="#6B5E2A"/>
    <circle cx="50" cy="52" r="10" fill="#2A4A33"/>`,
  gangfelt: `
    <rect x="0" y="0" width="100" height="100" fill="${F.morkgra}"/>
    <rect x="8" y="14" width="84" height="12" rx="2" fill="${F.hvit}"/>
    <rect x="8" y="34" width="84" height="12" rx="2" fill="${F.hvit}"/>
    <rect x="8" y="54" width="84" height="12" rx="2" fill="${F.hvit}"/>
    <rect x="8" y="74" width="84" height="12" rx="2" fill="${F.hvit}"/>`,
  fartshump: `
    <rect x="0" y="52" width="100" height="48" fill="${F.morkgra}"/>
    <path d="M18 74 Q50 40 82 74 Z" fill="${F.gul}"/>
    <path d="M30 74 Q50 54 70 74" fill="${F.svart}" opacity=".25"/>
    <path d="M0 92 L100 92" stroke="${F.hvit}" stroke-width="3" stroke-dasharray="10 8"/>
    <path d="M42 30 L50 18 L58 30 M50 18 L50 42" stroke="${F.hvit}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  autovern: `
    ${bakke(F.lysgronn, 56)}
    <rect x="0" y="72" width="100" height="28" fill="${F.morkgra}"/>
    <path d="M0 48 L100 48 L100 60 L0 60 Z" fill="${F.lysgra}"/>
    <path d="M0 54 L100 54" stroke="${F.gra}" stroke-width="4"/>
    <rect x="14" y="60" width="7" height="16" fill="${F.gra}"/>
    <rect x="46" y="60" width="7" height="16" fill="${F.gra}"/>
    <rect x="78" y="60" width="7" height="16" fill="${F.gra}"/>`,
  broytestikke: `
    <rect x="0" y="0" width="100" height="100" fill="#CBE4F5"/>
    <path d="M0 100 L0 74 Q50 66 100 74 L100 100 Z" fill="${F.sno}"/>
    <rect x="18" y="20" width="7" height="58" fill="${F.oransje}"/>
    <rect x="18" y="20" width="7" height="10" fill="${F.svart}"/>
    <rect x="18" y="40" width="7" height="10" fill="${F.svart}"/>
    <rect x="50" y="26" width="7" height="52" fill="${F.oransje}"/>
    <rect x="50" y="26" width="7" height="9" fill="${F.svart}"/>
    <rect x="50" y="44" width="7" height="9" fill="${F.svart}"/>
    <rect x="80" y="32" width="7" height="46" fill="${F.oransje}"/>
    <rect x="80" y="32" width="7" height="8" fill="${F.svart}"/>`,
  speilSving: `
    ${bakke(F.lysgronn, 88)}
    <rect x="46" y="44" width="8" height="46" fill="${F.gra}"/>
    <circle cx="50" cy="32" r="26" fill="${F.morkgra}"/>
    <circle cx="50" cy="32" r="21" fill="#A7C7D9"/>
    <path d="M34 40 q16 -16 32 -4" stroke="${F.hvit}" stroke-width="4" fill="none" opacity=".8"/>
    <path d="M38 24 L44 20 L42 28 Z" fill="${F.hvit}" opacity=".6"/>`,
  gatelys: `
    <rect x="0" y="0" width="100" height="100" fill="#243352"/>
    <rect x="52" y="24" width="8" height="70" fill="${F.morkgra}"/>
    <path d="M56 24 Q56 12 40 12" stroke="${F.morkgra}" stroke-width="8" fill="none"/>
    <path d="M28 10 L52 10 L48 20 L32 20 Z" fill="${F.gra}"/>
    <path d="M32 20 L48 20 L68 62 L12 62 Z" fill="${F.gul}" opacity=".35"/>
    <rect x="33" y="18" width="14" height="4" rx="2" fill="${F.gul}"/>
    <rect x="0" y="86" width="100" height="14" fill="${F.morkgra}"/>`,
  gulStripe: `
    <rect x="0" y="0" width="100" height="100" fill="${F.morkgra}"/>
    <rect x="0" y="16" width="100" height="5" rx="2" fill="${F.hvit}" opacity=".8"/>
    <rect x="0" y="79" width="100" height="5" rx="2" fill="${F.hvit}" opacity=".8"/>
    <rect x="4" y="44" width="26" height="9" rx="4" fill="${F.gul}"/>
    <rect x="40" y="44" width="26" height="9" rx="4" fill="${F.gul}"/>
    <rect x="76" y="44" width="24" height="9" rx="4" fill="${F.gul}"/>`,
  kmStolpe: `
    ${bakke(F.lysgronn, 84)}
    <rect x="40" y="26" width="20" height="60" rx="3" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2.5"/>
    <rect x="40" y="26" width="20" height="16" rx="3" fill="${F.svart}"/>
    <text x="50" y="56" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="15" fill="${F.svart}">12</text>
    <text x="50" y="72" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-weight="700" font-size="11" fill="${F.gra}">km</text>`,

  // ============================================================ FOLK
  syklist: `
    <circle cx="26" cy="72" r="16" fill="none" stroke="${F.svart}" stroke-width="4"/>
    <circle cx="76" cy="72" r="16" fill="none" stroke="${F.svart}" stroke-width="4"/>
    <path d="M26 72 L46 72 L58 48 L76 72 M46 72 L60 48 M58 48 L68 48" stroke="${F.rod}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="56" cy="24" r="10" fill="${F.hud}"/>
    <path d="M46 20 a10 10 0 0 1 20 0 L66 24 L46 24 Z" fill="${F.oransje}"/>
    <path d="M52 34 L44 52 L58 54 L64 44 Z" fill="${F.gul}"/>
    <path d="M58 54 L48 70 M58 50 L70 46" stroke="${F.dypbla}" stroke-width="5" stroke-linecap="round"/>`,
  jogger: `
    ${bakke(F.lysgronn, 90)}
    <circle cx="58" cy="20" r="11" fill="${F.hud}"/>
    <path d="M48 14 a11 11 0 0 1 20 -2 L66 16 L48 18 Z" fill="${F.morkbrun}"/>
    <path d="M48 34 L64 32 L68 54 L52 56 Z" fill="${F.rod}"/>
    <path d="M48 38 L30 30" stroke="${F.hud}" stroke-width="8" stroke-linecap="round"/>
    <path d="M66 38 L82 48" stroke="${F.hud}" stroke-width="8" stroke-linecap="round"/>
    <path d="M56 56 L40 76 L30 86" stroke="${F.dypbla}" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M64 56 L78 72 L88 70" stroke="${F.dypbla}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
  hundelufter: `
    ${bakke(F.lysgronn, 90)}
    ${p(person({ genser: F.lilla, bukse: F.dypbla, x: 32 }), 0, -4, 0.86)}
    <path d="M40 46 Q54 52 64 56" stroke="${F.morkgra}" stroke-width="2.5" fill="none"/>
    ${p(firbeint({ kropp: '#C28E4E', kroppB: 16, kroppH: 9, hodeX: 74, hodeY: 58, hodeR: 7, beinH: 12, beinY: 70, hals: false, kroppX: 62, kroppY: 62 }), 0, 0, 1)}`,
  barnevogn: `
    ${bakke(F.lysgra, 88)}
    <circle cx="30" cy="78" r="11" fill="${F.svart}"/><circle cx="30" cy="78" r="4" fill="${F.lysgra}"/>
    <circle cx="72" cy="78" r="11" fill="${F.svart}"/><circle cx="72" cy="78" r="4" fill="${F.lysgra}"/>
    <path d="M20 58 L80 58 L74 68 L26 68 Z" fill="${F.bla}"/>
    <path d="M32 58 a24 24 0 0 1 40 0 Z" fill="${F.dypbla}"/>
    <path d="M78 60 L92 34" stroke="${F.morkgra}" stroke-width="5" stroke-linecap="round"/>
    <path d="M86 32 L98 32" stroke="${F.morkgra}" stroke-width="5" stroke-linecap="round"/>`,
  refleksvest: `
    <path d="M30 26 L44 20 L56 20 L70 26 L74 76 L26 76 Z" fill="${F.gul}" stroke="${F.morkgul}" stroke-width="2"/>
    <path d="M44 20 L50 36 L56 20" fill="${F.hvit}"/>
    <rect x="26" y="44" width="48" height="8" fill="${F.lysgra}"/>
    <rect x="26" y="58" width="48" height="8" fill="${F.lysgra}"/>
    <path d="M36 26 L36 76 M64 26 L64 76" stroke="${F.morkgul}" stroke-width="2"/>`,
  bonde: `
    <rect x="0" y="0" width="100" height="56" fill="#BFE1F2"/>
    <path d="M0 100 L0 56 L100 56 L100 100 Z" fill="#C9A227"/>
    <path d="M0 70 L100 64 M0 86 L100 78" stroke="#A8851C" stroke-width="3"/>
    ${p(person({ genser: F.bla, bukse: F.morkbrun, ekstra: `<path d="M34 6 L66 6 L70 12 L30 12 Z" fill="${F.beige}"/><rect x="40" y="0" width="20" height="8" rx="3" fill="${F.beige}"/>` }), 0, 4, 0.82)}
    <path d="M62 34 L68 78" stroke="${F.morkbrun}" stroke-width="4"/>`,
  fisker: `
    ${vannflate(66)}
    ${p(person({ genser: F.gronn, bukse: F.morkgronn, x: 28, armer: `<path d="M38 40 L58 24" stroke="${F.gronn}" stroke-width="9" stroke-linecap="round"/>` }), 0, -6, 0.84)}
    <path d="M52 18 L92 40" stroke="${F.morkbrun}" stroke-width="3"/>
    <path d="M92 40 L88 62" stroke="${F.lysgra}" stroke-width="1.8"/>
    <path d="M84 62 q6 -5 10 0 q-6 6 -10 0 Z" fill="${F.oransje}"/>`,
  vinker: `
    ${p(person({
      genser: F.rod, bukse: F.dypbla,
      armer: `<path d="M36 38 L26 58" stroke="${F.rod}" stroke-width="9" stroke-linecap="round"/>
        <path d="M64 36 L76 14" stroke="${F.rod}" stroke-width="9" stroke-linecap="round"/>
        <circle cx="78" cy="10" r="7" fill="${F.hud}"/>`,
    }), 0, 6, 1)}
    <path d="M88 4 L94 0 M90 14 L98 14" stroke="${F.gul}" stroke-width="3" stroke-linecap="round"/>`,
  iskrem: `
    <path d="M36 44 L64 44 L50 92 Z" fill="#D9A15B"/>
    <path d="M40 52 L58 66 M46 44 L64 58 M38 62 L52 76" stroke="#B8813F" stroke-width="2.5"/>
    <circle cx="42" cy="38" r="14" fill="${F.rosa}"/>
    <circle cx="60" cy="38" r="14" fill="${F.beige}"/>
    <circle cx="51" cy="22" r="14" fill="#8B5E3C"/>
    <circle cx="51" cy="8" r="5" fill="${F.rod}"/>`,
  paraply: `
    <path d="M6 48 a44 44 0 0 1 88 0 Z" fill="${F.rod}"/>
    <path d="M28 48 a22 44 0 0 1 44 0 Z" fill="${F.hvit}"/>
    <path d="M50 4 L50 78 q0 12 -12 12 q-10 0 -10 -8" stroke="${F.morkbrun}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M18 62 L14 76 M40 66 L36 80 M62 66 L58 80 M84 62 L80 76" stroke="${F.bla}" stroke-width="3.5" stroke-linecap="round"/>`,

  // ============================================================ HIMMEL
  sol: `
    <circle cx="50" cy="50" r="24" fill="${F.gul}"/>
    <g stroke="${F.gul}" stroke-width="7" stroke-linecap="round">
      <path d="M50 14 L50 2 M50 98 L50 86 M14 50 L2 50 M98 50 L86 50"/>
      <path d="M24 24 L16 16 M76 76 L84 84 M76 24 L84 16 M24 76 L16 84"/>
    </g>
    <circle cx="50" cy="50" r="17" fill="${F.morkgul}" opacity=".35"/>
    <circle cx="50" cy="50" r="17" fill="${F.gul}"/>`,
  regn: `
    <path d="M28 46 a18 18 0 0 1 34 -8 a15 15 0 0 1 22 12 a13 13 0 0 1 -4 26 L30 76 a15 15 0 0 1 -2 -30 Z" fill="${F.gra}"/>
    <g stroke="${F.bla}" stroke-width="5" stroke-linecap="round">
      <path d="M30 82 L26 96 M48 82 L44 96 M66 82 L62 96 M82 80 L78 92"/>
    </g>`,
  regnbue: `
    <path d="M6 88 a44 44 0 0 1 88 0 L82 88 a32 32 0 0 0 -64 0 Z" fill="${F.rod}"/>
    <path d="M18 88 a32 32 0 0 1 64 0 L72 88 a22 22 0 0 0 -44 0 Z" fill="${F.oransje}"/>
    <path d="M28 88 a22 22 0 0 1 44 0 L63 88 a13 13 0 0 0 -26 0 Z" fill="${F.gul}"/>
    <path d="M37 88 a13 13 0 0 1 26 0 L55 88 a5 5 0 0 0 -10 0 Z" fill="${F.gronn}"/>
    <ellipse cx="14" cy="92" rx="16" ry="8" fill="${F.hvit}"/>
    <ellipse cx="86" cy="92" rx="16" ry="8" fill="${F.hvit}"/>`,
  taake: `
    <path d="M0 40 L100 40" stroke="${F.lysgra}" stroke-width="0"/>
    ${pos(gran('#5E7A6E'), 26, 50, 0.52)}
    ${pos(gran('#6E8A7E'), 68, 56, 0.44)}
    <g fill="${F.lysgra}" opacity=".9">
      <rect x="0" y="40" width="100" height="10" rx="5"/>
      <rect x="10" y="56" width="86" height="10" rx="5"/>
      <rect x="0" y="72" width="78" height="10" rx="5"/>
      <rect x="18" y="86" width="82" height="10" rx="5"/>
    </g>`,
  morkeSkyer: `
    <path d="M18 56 a20 20 0 0 1 38 -10 a17 17 0 0 1 26 14 a15 15 0 0 1 -6 30 L22 90 a17 17 0 0 1 -4 -34 Z" fill="${F.morkgra}"/>
    <path d="M6 34 a14 14 0 0 1 26 -6 a12 12 0 0 1 18 10 a10 10 0 0 1 -4 20 L10 58 a12 12 0 0 1 -4 -24 Z" fill="${F.gra}"/>`,
  fly: `
    <rect x="0" y="0" width="100" height="100" fill="#BFE1F2"/>
    <path d="M6 54 L58 44 L82 42 C92 42 94 48 86 52 L60 62 L40 66 L30 62 L44 56 L26 58 L18 64 L10 62 L16 54 Z" fill="${F.hvit}" stroke="${F.morkgra}" stroke-width="2"/>
    <path d="M56 46 L44 24 L52 24 L70 44 Z" fill="${F.lysgra}" stroke="${F.morkgra}" stroke-width="2"/>
    <circle cx="78" cy="47" r="3" fill="${F.rute}"/>`,
  kondensstripe: `
    <rect x="0" y="0" width="100" height="100" fill="#8FCBEA"/>
    <path d="M78 22 L92 18 L90 28 Z" fill="${F.hvit}"/>
    <circle cx="86" cy="23" r="3" fill="${F.lysgra}"/>
    <path d="M78 26 Q46 40 4 62" stroke="${F.hvit}" stroke-width="7" stroke-linecap="round" opacity=".95"/>
    <path d="M40 46 Q22 56 4 70" stroke="${F.hvit}" stroke-width="9" stroke-linecap="round" opacity=".55"/>`,
  helikopter: `
    <rect x="0" y="0" width="100" height="100" fill="#BFE1F2"/>
    <path d="M6 18 L94 18" stroke="${F.morkgra}" stroke-width="5" stroke-linecap="round"/>
    <rect x="46" y="18" width="7" height="12" fill="${F.morkgra}"/>
    <path d="M28 58 a22 28 0 0 1 44 -2 L96 58 L94 68 L72 66 a22 22 0 0 1 -44 -8 Z" fill="${F.rod}"/>
    <path d="M36 46 a16 16 0 0 1 24 0 L60 58 L34 58 Z" fill="${F.rute}"/>
    <path d="M88 58 L96 44 M88 66 L98 74" stroke="${F.rod}" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 72 L74 72 M34 72 L34 80 M70 72 L70 80 M24 80 L80 80" stroke="${F.morkgra}" stroke-width="4" stroke-linecap="round"/>`,
  maane: `
    <rect x="0" y="0" width="100" height="100" fill="#3A4E7A"/>
    <path d="M62 8 a42 42 0 1 0 0 84 a34 34 0 0 1 0 -84 Z" fill="${F.beige}"/>
    <circle cx="50" cy="34" r="6" fill="#DDD0AE"/>
    <circle cx="42" cy="58" r="4" fill="#DDD0AE"/>
    <circle cx="58" cy="70" r="5" fill="#DDD0AE"/>`,
  stjerner: `
    <rect x="0" y="0" width="100" height="100" fill="#1B2440"/>
    <g fill="${F.gul}">
      <path d="M26 14 L30 24 L40 26 L30 30 L26 40 L22 30 L12 26 L22 24 Z"/>
      <path d="M70 30 L73 38 L81 40 L73 43 L70 51 L67 43 L59 40 L67 38 Z"/>
      <path d="M46 58 L50 68 L60 71 L50 74 L46 84 L42 74 L32 71 L42 68 Z"/>
    </g>
    <g fill="${F.hvit}">
      <circle cx="84" cy="16" r="2.5"/><circle cx="14" cy="60" r="2"/>
      <circle cx="88" cy="70" r="2.5"/><circle cx="60" cy="10" r="1.8"/><circle cx="20" cy="86" r="2"/>
    </g>`,
  rarSky: `
    <rect x="0" y="0" width="100" height="100" fill="#8FCBEA"/>
    <path d="M18 62 a16 16 0 0 1 8 -30 a16 16 0 0 1 26 -10 l10 -12 l4 14 a16 16 0 0 1 20 16 a14 14 0 0 1 -6 26 Z" fill="${F.hvit}"/>
    <circle cx="40" cy="42" r="3.5" fill="${F.gra}"/>
    <circle cx="62" cy="40" r="3.5" fill="${F.gra}"/>
    <path d="M40 54 q11 8 22 -2" stroke="${F.gra}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M22 72 q8 -5 16 0 t16 0" stroke="${F.hvit}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`,
};

// Reservemerke hvis en id mangler — skal aldri vises, men er bedre enn tomt felt.
export const UKJENT_IKON = `<circle cx="50" cy="50" r="34" fill="${F.lysgra}"/>${tekstMerke('?', { str: 40, farge: F.gra })}`;

export function svgFor(ikonNavn, { klasse = '' } = {}) {
  const inn = IKONER[ikonNavn] || UKJENT_IKON;
  return `<svg viewBox="0 0 100 100" class="${klasse}" aria-hidden="true" focusable="false">${inn}</svg>`;
}
