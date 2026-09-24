// Turen — mellomlaget som gir en lang biltur en form.
// Poengene dere samler blir kilometer på en ekte norsk strekning.
// Én full 4x4-plate er rundt 60 poeng, så en rute på 500 km varer
// omtrent en hel biltur.

export const RUTER = [
  {
    id: 'hytta',
    navn: 'Til hytta',
    undertittel: 'Kort tur — passer på en vanlig kjøretur',
    lengde: 220,
    stopp: [
      { km: 0, navn: 'Hjemmefra', fakta: 'Alle er i bilen. Noen har allerede glemt noe.' },
      { km: 35, navn: 'Ut av byen', fakta: 'Husene blir lavere og jordene større.' },
      { km: 75, navn: 'Bensinstasjonen', fakta: 'Det obligatoriske stoppet. Pølse eller softis?' },
      { km: 120, navn: 'Over fjellet', fakta: 'Her er det alltid ti grader kaldere.' },
      { km: 160, navn: 'Grusveien', fakta: 'Nå begynner det å rumle i bilen.' },
      { km: 195, navn: 'Siste bakke', fakta: 'Herfra ser dere nesten fram.' },
      { km: 220, navn: 'Framme!', fakta: 'Ut av bilen, strekk på beina.' },
    ],
  },
  {
    id: 'oslo-trondheim',
    navn: 'Oslo – Trondheim',
    undertittel: 'E6 nordover over Dovre',
    lengde: 500,
    stopp: [
      { km: 0, navn: 'Oslo', fakta: 'Herfra går E6 helt til Kirkenes, nesten 2 600 km unna.' },
      { km: 50, navn: 'Gardermoen', fakta: 'Norges største flyplass. Se opp etter fly!' },
      { km: 70, navn: 'Eidsvoll', fakta: 'Her ble Grunnloven skrevet i 1814.' },
      { km: 130, navn: 'Hamar', fakta: 'Vikingskipet er en skøytehall formet som en båt snudd opp ned.' },
      { km: 185, navn: 'Lillehammer', fakta: 'Her var det vinter-OL i 1994.' },
      { km: 250, navn: 'Ringebu', fakta: 'Stavkirka her er fra 1200-tallet og er malt rød.' },
      { km: 310, navn: 'Otta', fakta: 'Inn i Gudbrandsdalen, en av Norges lengste daler.' },
      { km: 370, navn: 'Dovrefjell', fakta: 'Her lever moskus — et dyr som har vært her siden istiden.' },
      { km: 430, navn: 'Oppdal', fakta: 'Nå går det nedover igjen, mot Trøndelag.' },
      { km: 500, navn: 'Trondheim', fakta: 'Nidarosdomen er Norges største kirke.' },
    ],
  },
  {
    id: 'oslo-bergen',
    navn: 'Oslo – Bergen',
    undertittel: 'Over Hardangervidda',
    lengde: 460,
    stopp: [
      { km: 0, navn: 'Oslo', fakta: 'Vestover nå. Det blir høyere jo lenger dere kommer.' },
      { km: 60, navn: 'Hønefoss', fakta: 'Byen har en foss midt i sentrum.' },
      { km: 140, navn: 'Gol', fakta: 'Midt i Hallingdal.' },
      { km: 210, navn: 'Geilo', fakta: 'Et skisted som ligger 800 meter over havet.' },
      { km: 280, navn: 'Hardangervidda', fakta: 'Norges største fjellvidde. Her går det villrein.' },
      { km: 340, navn: 'Eidfjord', fakta: 'Nå bærer det bratt ned mot fjorden.' },
      { km: 400, navn: 'Voss', fakta: 'Kjent for folk som hopper i fallskjerm.' },
      { km: 460, navn: 'Bergen', fakta: 'Det regner omtrent 200 dager i året her.' },
    ],
  },
  {
    id: 'sorlandet',
    navn: 'Kristiansand – Stavanger',
    undertittel: 'E39 langs sørkysten',
    lengde: 230,
    stopp: [
      { km: 0, navn: 'Kristiansand', fakta: 'Herfra går ferja til Danmark.' },
      { km: 40, navn: 'Mandal', fakta: 'Norges sørligste by, med en lang badestrand.' },
      { km: 75, navn: 'Lindesnes', fakta: 'Norges sørligste punkt. Fyret her er det eldste i landet.' },
      { km: 120, navn: 'Flekkefjord', fakta: 'Den gamle bydelen heter Hollenderbyen.' },
      { km: 175, navn: 'Egersund', fakta: 'Her er det flatt og vindfullt — se etter vindmøller.' },
      { km: 230, navn: 'Stavanger', fakta: 'Preikestolen stuper 600 meter rett ned i fjorden.' },
    ],
  },
  {
    id: 'nordover',
    navn: 'Trondheim – Bodø',
    undertittel: 'Over polarsirkelen',
    lengde: 700,
    stopp: [
      { km: 0, navn: 'Trondheim', fakta: 'Nå begynner den lange biten nordover.' },
      { km: 120, navn: 'Steinkjer', fakta: 'Innerst i Trondheimsfjorden.' },
      { km: 230, navn: 'Grong', fakta: 'Her deler veien seg — E6 fortsetter nordover.' },
      { km: 340, navn: 'Mosjøen', fakta: 'Sjøgata her har Nord-Norges lengste rekke av trehus.' },
      { km: 420, navn: 'Mo i Rana', fakta: 'Like ved ligger Svartisen, en av Norges største isbreer.' },
      { km: 500, navn: 'Polarsirkelen', fakta: 'Nord for denne streken går ikke sola ned om sommeren.' },
      { km: 590, navn: 'Fauske', fakta: 'Kjent for marmor — det er fauskemarmor i FN-bygningen.' },
      { km: 640, navn: 'Saltstraumen', fakta: 'Verdens sterkeste tidevannsstrøm går gjennom dette sundet.' },
      { km: 700, navn: 'Bodø', fakta: 'Havørna er vanlig her. Se opp!' },
    ],
  },
  {
    id: 'nord',
    navn: 'Bodø – Tromsø',
    undertittel: 'Gjennom Lofoten og Vesterålen',
    lengde: 560,
    stopp: [
      { km: 0, navn: 'Bodø', fakta: 'Herfra går ferja til Lofoten.' },
      { km: 100, navn: 'Moskenes', fakta: 'Ytterst i Lofoten. Fiskehjeller overalt.' },
      { km: 190, navn: 'Svolvær', fakta: 'Lofotveggen er en rekke fjell som stikker rett opp av havet.' },
      { km: 290, navn: 'Narvik', fakta: 'Herfra går det malmtog med jern fra Sverige.' },
      { km: 400, navn: 'Bardufoss', fakta: 'Et av de kaldeste stedene i Norge om vinteren.' },
      { km: 480, navn: 'Nordkjosbotn', fakta: 'Veikrysset der alle stopper for å spise.' },
      { km: 560, navn: 'Tromsø', fakta: 'Om vinteren kan dere se nordlys herfra.' },
    ],
  },
  {
    id: 'hele-norge',
    navn: 'Hele Norge',
    undertittel: 'Den lange — varer over mange turer',
    lengde: 2600,
    stopp: [
      { km: 0, navn: 'Lindesnes', fakta: 'Helt sør. Nå skal dere hele veien opp.' },
      { km: 300, navn: 'Stavanger', fakta: 'Fjordene begynner.' },
      { km: 600, navn: 'Bergen', fakta: 'Sju fjell rundt byen.' },
      { km: 900, navn: 'Ålesund', fakta: 'Byen brant i 1904 og ble bygd opp igjen i jugendstil.' },
      { km: 1200, navn: 'Trondheim', fakta: 'Omtrent halvveis.' },
      { km: 1600, navn: 'Polarsirkelen', fakta: 'Nå er dere i Nord-Norge.' },
      { km: 1900, navn: 'Narvik', fakta: 'Fjell og fjord om hverandre.' },
      { km: 2200, navn: 'Alta', fakta: 'Her finnes helleristninger som er 7 000 år gamle.' },
      { km: 2600, navn: 'Nordkapp', fakta: 'Så langt nord kommer man ikke på vei i Norge.' },
    ],
  },
];

export const RUTE_ETTER_ID = Object.fromEntries(RUTER.map((r) => [r.id, r]));

/** Hvor er vi på ruta, og hva er neste stopp? */
export function posisjon(rute, km) {
  const nadd = rute.stopp.filter((s) => s.km <= km);
  const neste = rute.stopp.find((s) => s.km > km) || null;
  const forrige = nadd[nadd.length - 1] || rute.stopp[0];
  return {
    forrige,
    neste,
    antallNadd: nadd.length,
    ferdig: km >= rute.lengde,
    andel: Math.min(1, km / rute.lengde),
    tilNeste: neste ? neste.km - km : 0,
  };
}
