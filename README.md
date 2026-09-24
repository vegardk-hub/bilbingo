# Bilbingo

Bilbingo for norske veier. Se ut av vinduet, rop det du ser.

**Spill:** https://vegardk-hub.github.io/bilbingo/

Ingen reklame. Ingen kjøp. Ingen konto. Ingenting sendes noe sted.
Virker like godt i Lærdalstunnelen som hjemme.

---

## Hvorfor denne finnes

Det finnes en del bilbingo-apper fra før. De feiler stort sett på én av fire måter,
og hele designet her er bygget rundt å ikke gjøre det samme:

| Problemet | Hva Bilbingo gjør |
|---|---|
| **Amerikansk innhold.** Vanntårn, delstatsskilt, bensinmerker. Én anmelder om et av de større brettene: «dated, some very area specific and if you don't live in those areas, you're screwed.» | 202 ting som faktisk finnes langs norske veier: stabbur, brøytestikker, elgskilt, melkerampe, rundballer, ferje, bomstasjon. |
| **Alle får samme brett.** Den mest oppstemte klagen på den best distribuerte iOS-appen: spiller man på hver sin telefon får alle identisk brett, alle får bingo samtidig, og det er ingen vits. | Hver spiller får garantert sitt eget brett. Trukket fra samme stokk, men aldri det samme. |
| **Betalingsmur mot barn.** En av de nyeste appene gir gratisbrukere **ett spill per 24 timer**, så 2,99 $. | Alt er med. Det finnes ingen kjøpsknapp noe sted i appen. |
| **Varer tjue minutter.** Du fyller ett brett, og så er spillet over. En biltur Oslo–Trondheim er sju timer. | Tre lag som bygger på hverandre — se under. |

## Tre lag, tre tidsskalaer

**Brettet (2–10 minutter).** Vanlig bingo. Se noe, trykk på det, fyll en rekke.

**Turen (hele bilturen).** Poengene blir kilometer på en ekte norsk strekning.
Oslo–Trondheim over Dovre, Bodø–Tromsø gjennom Lofoten, eller bare «Til hytta».
Hvert fullførte brett flytter dere videre, og hver milepæl har en liten sann
opplysning om stedet. Det gir sju timer i bil en form.

**Spottboka (på tvers av turer).** Alt dere noen gang har funnet blir liggende,
sortert etter sjeldenhet. 30 merker å ta. Det er dette som gjør at tur nummer
tolv fortsatt har noe å strekke seg etter.

## Det som faktisk er vanskelig

### En på fire og en på ni skal kunne spille mot hverandre

Dette er problemet ingen av de eksisterende appene løser. Den største er bedre
til å se, og vinner hver gang. Etter tredje tap gidder ikke den minste mer.

To svar, og **samarbeid er standardvalget**:

- **Sammen** — ett felles brett. Hver ting får fargen til den som fant den, så
  alle ser hva de bidro med, men ingen taper. Forskning på barn og spill er
  entydig her: samarbeidsspill gir mindre aggresjon og mer deling enn
  konkurransespill, særlig mellom søsken.
- **Mot hverandre** — hvert sitt brett, med hvert sitt nivå. En 4-åring får 3×3
  med store, vanlige ting. En 9-åring får 4×4 med sjeldenheter. Ligger noen mer
  enn 30 % bak, tilbyr appen et gratisfelt til den som henger etter.

### Juks

Spotte-leker har alltid samme svakhet: ingen kan sjekke om du virkelig så den.
Løsningen her er ikke en knapp, men lyd. **Appen sier tingen høyt på norsk** når
noen krysser av. Hele bilen hører «Brøytebil!», og da kan ingen krysse av i
stillhet. Samme mekanisme løser at den som ikke kan lese ennå får vite hva
feltet er.

### Bilsyke

Barn mellom 2 og 12 blir kvalme av å se ned i bilen. Hele spillet er derfor
utovervendt: store ikoner som kan leses på et halvt sekund, ingen tekst som må
leses, og ingenting som krever at du sitter bøyd over skjermen.

### 1 260 tunneler

Norge har over 1 200 veitunneler. Lærdalstunnelen alene tar tjue minutter der
det ikke finnes noe å se. **Pauseknappen** setter brettet på vent og gir tre
spill som virker uten utsikt:

- **Gjett tiden** — alle gjetter hvor mange sekunder tunnelen varer, så tas tida.
- **Quiz** — 46 spørsmål om veier, dyr, skilt og Norge, i tre vanskelighetsgrader.
- **Husker du?** — hvilke av disse krysset dere av i dag? Spørsmålene lages av
  det dere faktisk har funnet på turen.

Det samme gjelder på ferje.

### Flere nettbrett uten nett

Hver tur har en firebokstavskode. Skriver dere samme kode på et annet nettbrett,
trekkes brettene fra samme stokk — men hver enhet får fortsatt sitt eget brett.
Ingen server, ingen Bluetooth, ingen dekning nødvendig. Koden er frøet til en
tilfeldighetsgenerator, og resten faller ut av seg selv.

### Årstid og landsdel

Snømann om sommeren gir ingen mening, og reinsdyr på Sørlandet gjør ikke det
heller. Ting er merket med årstid, tid på døgnet og landsdel, og brettet fylles
bare med det som kan sees der dere er, nå.

## Om merkene

Det finnes 30 merker, og ingen av dem er daglige. Ingen streaks, ingenting som
forsvinner hvis dere lar appen ligge i tre måneder. Et merke dere har tatt,
beholder dere. Helsedirektoratets skjermråd fra 2026 setter en time om dagen for
en seksåring — en app som skal bruke av den tiden bør fortjene den, ikke mase
seg til den.

## Teknisk

Ren HTML, CSS og JavaScript. Ingen rammeverk, ingen byggesteg, ingen
avhengigheter, ingen nedlastede fonter eller bilder.

```
index.html            skallet
sw.js                 service worker — legger hele appen i hurtiglager
css/stil.css          designsystemet
js/app.js             oppstart og navigering
js/data/ting.js       katalogen: 202 ting med sjeldenhet, alder, årstid, sted
js/data/tegning.js    grunnformer for ikonene (bil, firbeint dyr, skilt, hus …)
js/data/ikoner.js     202 SVG-ikoner bygget på grunnformene
js/data/ruter.js      sju norske strekninger med milepæler
js/data/merker.js     30 merker
js/data/quiz.js       46 quizspørsmål
js/kjerne/brett.js    brettgenerering, nivåer, bingo-logikk
js/kjerne/spill.js    spilltilstand
js/kjerne/lager.js    lagring i localStorage
js/kjerne/lyd.js      lyd laget med Web Audio, tale med Web Speech
js/kjerne/tilfeldig.js frø-styrt tilfeldighet og spillkoder
js/kjerne/ui.js       små byggeklosser for skjermene
js/skjerm/*.js        én fil per skjerm
```

Alle ikoner er tegnet i kode som SVG, ikke hentet fra et bibliotek. Det er
gjort med vilje: emoji ser forskjellig ut på hver plattform, og et ikonbibliotek
ville ikke hatt stabbur.

### Kjøre lokalt

```bash
node .dev/server.mjs
```

Så åpne http://localhost:5190/. Service workeren registreres bare over https,
så offline-delen må testes på den publiserte adressen.

### Sjekk før publisering

```bash
node .dev/sjekk.mjs
```

Laster hver modul, finner ubrukte importer, sjekker at hver ting har et ikon, at
rutene er sortert og ender der de skal, at ingen quiz har doble svar, og at
service workeren ikke peker på filer som ikke finnes.

### Verktøy i `.dev/`

- `server.mjs` — utviklingsserver
- `sjekk.mjs` — sjekkene over
- `lagIkoner.mjs` — genererer app-ikonene (PNG skrives direkte med zlib)
- `lagArk.mjs`, `lagArkStor.mjs` — kontaktark for å se alle ikonene samlet

### Ved ny versjon

Tell opp `VERSJON` i `sw.js`. Uten det henger GitHub Pages igjen med de gamle
filene.

## Lisens

Laget for mine egne barn. Bruk det gjerne.
