import { writeFileSync } from 'node:fs';
const kat = process.argv[2];
const t = await import('../js/data/ting.js');
const i = await import('../js/data/ikoner.js');
const liste = kat ? t.TING.filter((y) => y.kat === kat) : t.TING;
const ut = liste.map((x) => `<figure><svg viewBox="0 0 100 100">${i.IKONER[x.ikon]}</svg><figcaption>${x.navn}</figcaption></figure>`).join('');
writeFileSync(new URL('./stor.html', import.meta.url), `<!doctype html><meta charset="utf-8"><title>Stor</title>
<style>body{background:#eef2f7;font:13px system-ui;margin:0;padding:10px}
.g{display:grid;grid-template-columns:repeat(8,1fr);gap:8px}
figure{margin:0;background:#fff;border-radius:10px;padding:5px;text-align:center}
svg{width:100%;aspect-ratio:1;display:block}
figcaption{font-size:9px;margin-top:2px}</style><div class="g">${ut}</div>`);
console.log(liste.length);
