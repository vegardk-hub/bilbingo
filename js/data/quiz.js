// Spørsmål til tunnel- og fergepausen. Riktig svar står alltid først i lista —
// alternativene stokkes når de vises.
// niv: 1 = de minste kan svare, 2 = skolealder, 3 = for de store

export const SPORSMAL = [
  // --- nivå 1
  { niv: 1, q: 'Hvilken farge har et stoppskilt?', svar: ['Rødt', 'Grønt', 'Blått'] },
  { niv: 1, q: 'Hvor mange bein har en elg?', svar: ['Fire', 'To', 'Seks'] },
  { niv: 1, q: 'Hva heter babyen til en sau?', svar: ['Lam', 'Kalv', 'Føll'] },
  { niv: 1, q: 'Hva heter babyen til en ku?', svar: ['Kalv', 'Lam', 'Kje'] },
  { niv: 1, q: 'Hva heter babyen til en hest?', svar: ['Føll', 'Valp', 'Kje'] },
  { niv: 1, q: 'Hva spiser en ku?', svar: ['Gress', 'Fisk', 'Pølser'] },
  { niv: 1, q: 'Hvilken farge er en typisk norsk låve?', svar: ['Rød', 'Lilla', 'Svart'] },
  { niv: 1, q: 'Hva må alle ha på seg i bilen?', svar: ['Bilbelte', 'Badedrakt', 'Hjelm'] },
  { niv: 1, q: 'Hva heter huset der kua bor?', svar: ['Fjøs', 'Garasje', 'Hytte'] },
  { niv: 1, q: 'Hvor mange årstider har vi?', svar: ['Fire', 'To', 'Sju'] },
  { niv: 1, q: 'Hva kalles det når veien går under et fjell?', svar: ['Tunnel', 'Bru', 'Ferje'] },
  { niv: 1, q: 'Hva kalles det når veien går over et vann?', svar: ['Bru', 'Tunnel', 'Bakke'] },
  { niv: 1, q: 'Hvilket dyr er størst?', svar: ['Elg', 'Hare', 'Rev'] },
  { niv: 1, q: 'Hvilke kjøretøy har blålys?', svar: ['Politi og ambulanse', 'Traktor og buss', 'Sykkel og moped'] },
  { niv: 1, q: 'Hvilken farge er midtstripa på norske veier?', svar: ['Gul', 'Grønn', 'Rosa'] },
  { niv: 1, q: 'Hva lager en vindmølle?', svar: ['Strøm', 'Mel', 'Vann'] },
  { niv: 1, q: 'Hva er en bil du kan sove i?', svar: ['Bobil', 'Lastebil', 'Sportsbil'] },
  { niv: 1, q: 'Hvilken dag er Norges nasjonaldag?', svar: ['17. mai', '24. desember', '1. januar'] },

  // --- nivå 2
  { niv: 2, q: 'Hva betyr et trekantet skilt med rød kant?', svar: ['Pass på — fare', 'Det er forbudt', 'Her er det parkering'] },
  { niv: 2, q: 'Hva betyr et rundt skilt med rød kant?', svar: ['Noe er forbudt', 'Noe er påbudt', 'Her er det fint'] },
  { niv: 2, q: 'Hvor mange sider har et stoppskilt?', svar: ['Åtte', 'Seks', 'Fire'] },
  { niv: 2, q: 'Hva betyr et blått skilt med en hvit P?', svar: ['Parkering', 'Politi', 'Post'] },
  { niv: 2, q: 'Hvor mange meter er én kilometer?', svar: ['1000', '100', '10 000'] },
  { niv: 2, q: 'Hvilket dyr advarer viltskiltet oftest om i Norge?', svar: ['Elg', 'Løve', 'Pingvin'] },
  { niv: 2, q: 'Hva heter Norges hovedstad?', svar: ['Oslo', 'Bergen', 'Trondheim'] },
  { niv: 2, q: 'Hvilket land ligger øst for Norge?', svar: ['Sverige', 'Island', 'Skottland'] },
  { niv: 2, q: 'Hva heter det når to veier møtes i en sirkel?', svar: ['Rundkjøring', 'Lyskryss', 'Fotgjengerfelt'] },
  { niv: 2, q: 'Hva er Norges største innsjø?', svar: ['Mjøsa', 'Femunden', 'Randsfjorden'] },
  { niv: 2, q: 'Hva heter Norges høyeste fjell?', svar: ['Galdhøpiggen', 'Gaustatoppen', 'Preikestolen'] },
  { niv: 2, q: 'Hvilket tre er grønt hele året?', svar: ['Gran', 'Bjørk', 'Eik'] },
  { niv: 2, q: 'Hva gjør at en elbil går?', svar: ['Strøm fra et batteri', 'Bensin', 'Damp'] },
  { niv: 2, q: 'Hvilken farge blir bjørkebladene om høsten?', svar: ['Gule', 'Blå', 'Svarte'] },
  { niv: 2, q: 'Hva er en foss?', svar: ['Vann som faller ned fra en høyde', 'En dyp dal', 'En stor stein'] },
  { niv: 2, q: 'Hvor mange farger er det i det norske flagget?', svar: ['Tre', 'To', 'Fem'] },
  { niv: 2, q: 'Hva heter den store bilen som måker snø om vinteren?', svar: ['Brøytebil', 'Søppelbil', 'Betongbil'] },
  { niv: 2, q: 'Hvorfor står det brøytestikker langs veien om vinteren?', svar: ['Så brøytebilen ser hvor veien går', 'For å måle snødybden', 'Som pynt'] },

  // --- nivå 3
  { niv: 3, q: 'Hva heter verdens lengste veitunnel?', svar: ['Lærdalstunnelen', 'Gotthardtunnelen', 'Oslofjordtunnelen'] },
  { niv: 3, q: 'Omtrent hvor lang er Lærdalstunnelen?', svar: ['24 kilometer', '7 kilometer', '60 kilometer'] },
  { niv: 3, q: 'Hvilken vei er Norges lengste?', svar: ['E6', 'E18', 'E39'] },
  { niv: 3, q: 'Omtrent hvor mange veitunneler har Norge?', svar: ['Over 1 200', 'Rundt 100', 'Rundt 40'] },
  { niv: 3, q: 'Hva heter Norges lengste fjord?', svar: ['Sognefjorden', 'Geirangerfjorden', 'Oslofjorden'] },
  { niv: 3, q: 'Hva skjer nord for polarsirkelen om sommeren?', svar: ['Sola går ikke ned', 'Det snør hele tiden', 'Det blir mørkt hele døgnet'] },
  { niv: 3, q: 'Hva er fartsgrensen i tettbygd strøk når ingenting annet er skiltet?', svar: ['50 km/t', '30 km/t', '80 km/t'] },
  { niv: 3, q: 'Hva er fartsgrensen utenfor tettbygd strøk når ingenting annet er skiltet?', svar: ['80 km/t', '60 km/t', '100 km/t'] },
  { niv: 3, q: 'Hva betyr et gult skilt med svart kant på veiarbeid?', svar: ['Midlertidig skilting', 'Permanent skilting', 'Skiltet gjelder ikke'] },
  { niv: 3, q: 'Hvilket dyr lever på Dovrefjell og har vært her siden istiden?', svar: ['Moskus', 'Bison', 'Kamel'] },
  { niv: 3, q: 'Hva heter det sterkeste tidevannsstrømmen i verden, like ved Bodø?', svar: ['Saltstraumen', 'Malstrømmen', 'Trollstigen'] },
  { niv: 3, q: 'Hva var Norges vanligste bilmodell i 2025?', svar: ['Tesla Model Y', 'Volkswagen Golf', 'Toyota Corolla'] },
  { niv: 3, q: 'Hva betyr det at en bil har grønne skilt?', svar: ['Den er registrert som varebil', 'Den er en elbil', 'Den er utenlandsk'] },
  { niv: 3, q: 'Hvorfor står det speil i noen svinger?', svar: ['Så du ser om det kommer noen rundt svingen', 'For å se din egen bil', 'For å måle farten'] },
];

export const NIVAA_NAVN = { 1: 'Lett', 2: 'Middels', 3: 'Vanskelig' };

/** Pausespill — tilgjengelig i tunnel og på ferje. */
export const PAUSESPILL = [
  {
    id: 'tid',
    navn: 'Gjett tiden',
    ikon: 'tunnel',
    kort: 'Hvor lenge varer tunnelen? Gjett, så tar vi tida.',
    bare: 'tunnel',
  },
  {
    id: 'quiz',
    navn: 'Quiz',
    ikon: 'fart80',
    kort: 'Spørsmål om veier, dyr og Norge.',
  },
  {
    id: 'husker',
    navn: 'Husker du?',
    ikon: 'speilSving',
    kort: 'Hvilke av disse har dere krysset av i dag?',
  },
];
