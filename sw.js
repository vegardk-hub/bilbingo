// Service worker. Hele poenget: appen skal starte i Lærdalstunnelen.
//
// Strategi:
//  - alle filer legges i hurtiglageret ved installasjon
//  - sidevisninger prøver nettet først (så en ny versjon slår gjennom), men
//    faller tilbake på lageret straks nettet ikke svarer
//  - alt annet leses fra lageret og oppdateres i bakgrunnen
//
// Husk å telle opp VERSJON ved hver utgivelse, ellers henger GitHub Pages
// igjen med gamle filer.

const VERSJON = 'v4';
const LAGER = `bilbingo-${VERSJON}`;

const FILER = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/stil.css',
  './js/app.js',
  './js/data/ting.js',
  './js/data/tegning.js',
  './js/data/ikoner.js',
  './js/data/ruter.js',
  './js/data/merker.js',
  './js/data/quiz.js',
  './js/kjerne/brett.js',
  './js/kjerne/frimodus.js',
  './js/kjerne/foreldre.js',
  './js/kjerne/sperre.js',
  './js/kjerne/lager.js',
  './js/kjerne/lyd.js',
  './js/kjerne/spill.js',
  './js/kjerne/tilfeldig.js',
  './js/kjerne/ui.js',
  './js/skjerm/start.js',
  './js/skjerm/oppsett.js',
  './js/skjerm/spill.js',
  './js/skjerm/frimodus.js',
  './js/skjerm/foreldre.js',
  './js/skjerm/pause.js',
  './js/skjerm/spottbok.js',
  './js/skjerm/innstillinger.js',
  './ikoner/ikon.svg',
  './ikoner/ikon-180.png',
  './ikoner/ikon-192.png',
  './ikoner/ikon-512.png',
  './ikoner/ikon-maske-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(LAGER)
      // addAll feiler på hele settet hvis én fil mangler — legg inn én og én.
      .then((c) => Promise.all(FILER.map((f) => c.add(f).catch(() => null))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((n) => Promise.all(n.filter((k) => k !== LAGER).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((svar) => {
          const kopi = svar.clone();
          caches.open(LAGER).then((c) => c.put('./index.html', kopi));
          return svar;
        })
        .catch(() => caches.match('./index.html').then((t) => t || caches.match('./'))),
    );
    return;
  }

  e.respondWith(
    caches.match(request).then((truffet) => {
      const fraNett = fetch(request)
        .then((svar) => {
          if (svar && svar.ok) {
            const kopi = svar.clone();
            caches.open(LAGER).then((c) => c.put(request, kopi));
          }
          return svar;
        })
        .catch(() => truffet);
      return truffet || fraNett;
    }),
  );
});
