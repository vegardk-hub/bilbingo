# Bilbingo
Norsk bilbingo-PWA for barn (ca. 3–12 år) og foreldre på biltur: se ut av vinduet, trykk på det du ser. Ren HTML/CSS/JS med ES-moduler, ingen byggesteg og ingen avhengigheter.

## Kjøre og teste
- Forhåndsvisning: `bilbingo` i `.claude/launch.json` (`node .dev/server.mjs`, port 5190).
- Røyktest: `node .dev/roykTest.mjs` (skal skrive «Røyktest OK»).
- Egne sjekker: `node .dev/sjekk.mjs` (skal skrive «Alt i orden.», exit 1 ved feil). Den laster alle moduler, finner ubrukte importer, sjekker at hver ting og hvert merke har ikon, at rutene er sortert og ender på `lengde`, at quiz har minst 3 og ingen doble svar, og at alle filer i `sw.js` finnes.

## Publisering
- Repo `vegardk-hub/bilbingo`, gren `main`, GitHub Pages: https://vegardk-hub.github.io/bilbingo/
- Versjonen er konstanten `VERSJON` i `sw.js` (linje 12, nå `'v4'`); cache-navnet blir `bilbingo-${VERSJON}`. Den MÅ telles opp ved hver utgivelse, ellers henger Pages igjen med gamle filer.
- Nye filer må legges i `FILER`-lista i `sw.js`, ellers blir de ikke tilgjengelige offline.
- Skillen `publiser-pwa` gjør opptelling, tester og publisering.

## Struktur
- `js/data/` er ren data uten logikk: `ting.js` (katalogen), `tegning.js` (grunnformer), `ikoner.js`, `ruter.js`, `merker.js`, `quiz.js`.
- `js/kjerne/` er logikk uten DOM-skjermer: brettgenerering, spilltilstand, frimodus, foreldrekode, trykkpause, lagring (localStorage), lyd, frø-styrt tilfeldighet. `ui.js` har byggeklosser for skjermene.
- `js/skjerm/` har én fil per skjerm; `js/app.js` starter og navigerer.
- Ny ting: legg en rad i `RAD` i `js/data/ting.js` (`[id, navn, ikon, kat, sjelden, alder, sesong, tid, sted]`, forklart i filhodet) og et ikon med samme nøkkel som `ikon`-feltet i `IKONER` i `js/data/ikoner.js`, bygget på formene i `tegning.js`. Kjør så `sjekk.mjs`. Ikoner er SVG tegnet i kode, aldri emoji.
- `.dev/`: dev-server, `sjekk.mjs`, `roykTest.mjs`, `lagIkoner.mjs` (skriver PNG-appikonene i `ikoner/`), `lagArk.mjs` og `lagArkStor.mjs` (skriver `ark.html`/`stor.html`, kontaktark over alle ikonene; gitignorert).

## Verdt å vite
- Service worker registreres bare over https: offline og tunnelmodus kan ikke testes lokalt, kun på Pages-adressen. Appen må fungere uten nett (Lærdalstunnelen); ingenting sendes noe sted.
- Barn kan ikke slette noe. Alt som sletter ligger i foreldrekontrollen (`js/skjerm/foreldre.js`) bak en firesifret kode i klartekst, en sperre mot uhell og ikke sikkerhet. Ikke legg slettknapper andre steder.
- Trykkpause på 15 s mellom hvert trykk (`js/kjerne/sperre.js`), og i frimodus låses hvert felt i 30 s (`SPERRE_MS`). Angre fjerner også ventetiden. Ikke fjern dem; de hindrer at brettet fylles på sekunder.
- Appen sier tingen høyt på norsk ved avkryssing (Web Speech): det er anti-juks og hjelper de som ikke kan lese. Samarbeid («Sammen») er standard, ikke konkurranse.
- Designet er for bruk i bil: store ikoner leses på et halvt sekund, lite tekst, og ingen daglige streaks eller merker som forsvinner.
- Spillkoden på 4 tegn er frø til tilfeldighetsgeneratoren: flere nettbrett uten nett får samme stokk, men hver sitt brett. Endring i `tilfeldig.js` eller `brett.js` kan bryte dette.
- `bekreft()` må sette svaret før `lukk()` kalles, siden `ark()` kjører `vedLukk` ved lukking; ellers svarer alle bekreftelsesdialoger «nei».
