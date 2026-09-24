// Liten husholdningssjekk: laster hver modul, og melder fra om importerte
// navn som ikke brukes. Ingen avhengigheter.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROT = join(fileURLToPath(new URL('.', import.meta.url)), '..');

function alleFiler(mappe) {
  const ut = [];
  for (const navn of readdirSync(mappe)) {
    const sti = join(mappe, navn);
    if (statSync(sti).isDirectory()) ut.push(...alleFiler(sti));
    else if (navn.endsWith('.js')) ut.push(sti);
  }
  return ut;
}

const filer = alleFiler(join(ROT, 'js'));
let feil = 0;

// 1) lastes filen i det hele tatt?
for (const f of filer) {
  try {
    await import(pathToFileURL(f).href);
  } catch (e) {
    if (!/is not defined|localStorage/.test(e.message)) {
      console.log('LASTEFEIL', relative(ROT, f), e.message);
      feil += 1;
    }
  }
}

// 2) importerte navn som ikke brukes noe sted i filen
const IMPORT = /^import\s+(?:\{([\s\S]*?)\}|[\w*\s,]+)\s+from\s+'[^']+';?/gm;
for (const f of filer) {
  const src = readFileSync(f, 'utf8');
  const utenImport = src.replace(IMPORT, '');
  for (const m of src.matchAll(IMPORT)) {
    if (!m[1]) continue;
    for (const bit of m[1].split(',')) {
      const navn = bit.trim().split(/\s+as\s+/).pop().trim();
      if (!navn) continue;
      if (!new RegExp(`\\b${navn}\\b`).test(utenImport)) {
        console.log('UBRUKT', relative(ROT, f), navn);
        feil += 1;
      }
    }
  }
}

// 3) hver ting har et ikon, og hvert ikon brukes
const { TING } = await import(pathToFileURL(join(ROT, 'js/data/ting.js')).href);
const { IKONER } = await import(pathToFileURL(join(ROT, 'js/data/ikoner.js')).href);
const { MERKER } = await import(pathToFileURL(join(ROT, 'js/data/merker.js')).href);
const { RUTER } = await import(pathToFileURL(join(ROT, 'js/data/ruter.js')).href);
const { SPORSMAL } = await import(pathToFileURL(join(ROT, 'js/data/quiz.js')).href);

for (const t of TING) {
  if (!IKONER[t.ikon]) { console.log('MANGLER IKON', t.id, t.ikon); feil += 1; }
}
for (const m of MERKER) {
  if (!IKONER[m.ikon]) { console.log('MERKE UTEN IKON', m.id, m.ikon); feil += 1; }
}
for (const r of RUTER) {
  const sist = r.stopp[r.stopp.length - 1];
  if (sist.km !== r.lengde) { console.log('RUTE ENDER FEIL', r.id, sist.km, '!=', r.lengde); feil += 1; }
  r.stopp.forEach((s, i) => {
    if (i && s.km <= r.stopp[i - 1].km) { console.log('RUTE USORTERT', r.id, s.navn); feil += 1; }
  });
}
for (const s of SPORSMAL) {
  if (s.svar.length < 3) { console.log('FOR FÅ SVAR', s.q); feil += 1; }
  if (new Set(s.svar).size !== s.svar.length) { console.log('DOBLE SVAR', s.q); feil += 1; }
}

// 4) alle filene i service workeren finnes
const sw = readFileSync(join(ROT, 'sw.js'), 'utf8');
for (const m of sw.matchAll(/'\.\/([^']+)'/g)) {
  try { statSync(join(ROT, m[1])); } catch { console.log('SW PEKER PÅ FIL SOM MANGLER', m[1]); feil += 1; }
}

console.log(feil ? `\n${feil} ting å se på` : '\nAlt i orden.');
process.exit(feil ? 1 : 0);
