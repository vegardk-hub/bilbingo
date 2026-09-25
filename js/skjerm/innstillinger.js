// Innstillinger. Kort liste — det viktige er at sted og årstid stemmer, ellers
// står det ting på brettet som ikke går an å finne der dere faktisk kjører.

import { h, knapp, tilbakeknapp, ikon, bryter } from '../kjerne/ui.js';
import { les } from '../kjerne/lager.js';
import { STEDER } from '../kjerne/brett.js';
import { sesongNa, TING, KATEGORIER } from '../data/ting.js';
import { hentAktivt } from '../kjerne/spill.js';
import { LYD, si } from '../kjerne/lyd.js';
import { gaaTil, settInnstilling } from '../app.js';

const SESONGNAVN = { var: 'Vår', sommer: 'Sommer', host: 'Høst', vinter: 'Vinter' };

function pillevalg(valg, naa, vedValg) {
  const rad = h('div.pillerad');
  valg.forEach(([id, navn]) => {
    rad.append(h('button.pille', {
      type: 'button',
      'aria-pressed': String(naa === id),
      onclick: () => {
        vedValg(id);
        [...rad.children].forEach((c, i) => c.setAttribute('aria-pressed', String(valg[i][0] === id)));
      },
    }, navn));
  });
  return rad;
}

export function tegn() {
  const t = les();
  const i = t.innstillinger;
  const aktivt = hentAktivt();
  const innhold = h('div.innhold');

  // --------------------------------------------------------- lyd
  innhold.append(h('section.kort', {},
    h('h2', { style: { marginBottom: '4px' } }, 'Lyd'),
    bryter('Lydeffekter', i.lyd, (v) => { settInnstilling('lyd', v); if (v) LYD.kryss(); }),
    bryter('Si tingen høyt', i.stemme, (v) => {
      settInnstilling('stemme', v);
      if (v) si('Sånn ja');
    }, 'Appen sier navnet på det som krysses av. Da hører hele bilen det — og den som ikke kan lese ennå kan være med.')));

  // --------------------------------------------------------- hvor og når
  const sesongrad = pillevalg(
    [['auto', `Følg datoen (${SESONGNAVN[sesongNa()]})`], ...Object.entries(SESONGNAVN)],
    i.sesongAuto ? 'auto' : i.sesong || 'auto',
    (id) => {
      if (id === 'auto') { settInnstilling('sesongAuto', true); settInnstilling('sesong', null); }
      else { settInnstilling('sesongAuto', false); settInnstilling('sesong', id); }
    },
  );

  innhold.append(h('section.kort', {},
    h('h2', { style: { marginBottom: '4px' } }, 'Hvor kjører dere?'),
    h('p.liten.svak', { style: { marginBottom: '10px' } },
      'Styrer hva som kan dukke opp på brettet. Velger dere «ved sjøen» slipper dere reinsdyr, og motsatt.'),
    pillevalg(Object.entries(STEDER), i.sted, (id) => settInnstilling('sted', id)),
    h('h3', { style: { margin: '18px 0 8px' } }, 'Årstid'),
    h('p.liten.svak', { style: { marginBottom: '10px' } },
      'Snømann om sommeren gir ingen mening. Appen følger datoen med mindre dere sier noe annet.'),
    sesongrad));

  // --------------------------------------------------------- kategorier
  const valgte = new Set(i.kategorier || Object.keys(KATEGORIER));
  const katrad = h('div.pillerad');
  Object.entries(KATEGORIER).forEach(([k, v]) => {
    const antall = TING.filter((x) => x.kat === k).length;
    const b = h('button.pille', {
      type: 'button',
      'aria-pressed': String(valgte.has(k)),
      onclick: () => {
        if (valgte.has(k)) { if (valgte.size <= 2) { LYD.feil(); return; } valgte.delete(k); }
        else valgte.add(k);
        b.setAttribute('aria-pressed', String(valgte.has(k)));
        const alle = Object.keys(KATEGORIER);
        settInnstilling('kategorier', valgte.size === alle.length ? null : [...valgte]);
      },
    }, `${v.navn} (${antall})`);
    katrad.append(b);
  });

  innhold.append(h('section.kort', {},
    h('h2', { style: { marginBottom: '4px' } }, 'Hva skal være med?'),
    h('p.liten.svak', { style: { marginBottom: '10px' } }, 'Skru av det dere ikke bryr dere om. Minst to må være på.'),
    katrad));

  // --------------------------------------------------------- skjerm
  innhold.append(h('section.kort', {},
    h('h2', { style: { marginBottom: '4px' } }, 'Skjerm'),
    bryter('Hold skjermen våken', i.skjermPaa, (v) => settInnstilling('skjermPaa', v),
      'Så skjermen ikke slukner midt i jakten.'),
    bryter('Større skrift', i.storSkrift, (v) => { settInnstilling('storSkrift', v); }),
    h('h3', { style: { margin: '18px 0 8px' } }, 'Utseende'),
    pillevalg(
      [['auto', 'Følg enheten'], ['lyst', 'Lyst'], ['morkt', 'Mørkt']],
      i.tema || 'auto',
      (id) => settInnstilling('tema', id),
    )));

  // --------------------------------------------------------- om
  innhold.append(h('section.kort', {},
    h('h2', { style: { marginBottom: '8px' } }, 'Om Bilbingo'),
    h('p.liten.svak', `${TING.length} ting å finne langs norske veier. Alt ligger lagret på denne enheten — ingen konto, ingen reklame, ingen kjøp, og ingenting sendes noe sted. Appen virker like godt i en tunnel som hjemme.`),
    h('div.rad.bryt', { style: { marginTop: '14px' } },
      h('span.merkelapp', {}, ikon('tunnel', 'ik'), 'Virker uten nett'),
      h('span.merkelapp', {}, ikon('hundIBil', 'ik'), 'Ingen sporing')),
    // Ingenting som sletter noe ligger her lenger. Det holder til i
    // foreldrekontrollen, bak kode, så ingen tømmer spottboka med en feilfinger.
    h('div', { style: { marginTop: '16px' } },
      knapp('Foreldrekontroll', {
        klasse: 'full', sym: 'laas', onclick: () => gaaTil('foreldre'),
      }),
      h('p.liten.svak', { style: { marginTop: '10px' } },
        'Der ligger alt som sletter noe: spillere, turer, spottboka og full nullstilling.'))));

  return h('div.skjerm', {},
    h('div.topplinje', {}, tilbakeknapp(() => gaaTil(aktivt ? 'spill' : 'start')), h('h2', 'Innstillinger')),
    innhold);
}
