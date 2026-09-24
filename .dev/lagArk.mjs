import { writeFileSync } from 'node:fs';
const t = await import('../js/data/ting.js');
const i = await import('../js/data/ikoner.js');
const KAT = t.KATEGORIER;
let ut = '';
for (const k of Object.keys(KAT)) {
  ut += `<h2 style="grid-column:1/-1;margin:24px 0 4px;font:700 14px system-ui;color:${KAT[k].farge}">${KAT[k].navn}</h2>`;
  for (const x of t.TING.filter((y) => y.kat === k)) {
    ut += `<figure><svg viewBox="0 0 100 100">${i.IKONER[x.ikon]}</svg><figcaption>${x.navn}<br><span>${x.sjelden}\u2605 ${x.alder}+</span></figcaption></figure>`;
  }
}
writeFileSync(new URL('./ark.html', import.meta.url), `<!doctype html><meta charset="utf-8"><title>Ikonark</title>
<style>
body{background:#eef2f7;font:14px system-ui;margin:0;padding:20px}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:6px}
figure{margin:0;background:#fff;border-radius:12px;padding:4px;text-align:center;box-shadow:0 1px 3px #0002}
svg{width:100%;aspect-ratio:1;display:block}
figcaption{font-size:8px;line-height:1.25;margin-top:4px;color:#333}
figcaption span{color:#888;font-size:7px}
</style><div class="g">${ut}</div>`);
console.log('ok');
