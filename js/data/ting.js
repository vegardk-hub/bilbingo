// Katalogen over alt man kan spotte fra en bil i Norge.
//
// sjelden: 1 = ser du hele tiden, 2 = ofte, 3 = av og til, 4 = sjelden, 5 = legendarisk
// alder:   laveste alder som kjenner igjen tingen uten hjelp
// sesong:  null = hele året, ellers liste av 'var' 'sommer' 'host' 'vinter'
// tid:     null = alltid, 'dag' eller 'natt'
// sted:    null = overalt, ellers liste av 'kyst' 'fjell' 'by' 'bygd'

export const KATEGORIER = {
  kjoretoy: { navn: 'Kjøretøy', farge: '#E63946' },
  dyr:      { navn: 'Dyr',      farge: '#2A9D5C' },
  skilt:    { navn: 'Skilt',    farge: '#F77F00' },
  bygg:     { navn: 'Hus',      farge: '#8B5E3C' },
  natur:    { navn: 'Natur',    farge: '#1B7F5C' },
  vei:      { navn: 'Vei',      farge: '#4A4E69' },
  folk:     { navn: 'Folk',     farge: '#C9184A' },
  himmel:   { navn: 'Himmel',   farge: '#4EA8DE' },
};

// Kortform for å holde tabellen lesbar:
// [id, navn, ikon, kat, sjelden, alder, sesong, tid, sted]
const RAD = [
  // ---------- KJØRETØY ----------
  ['rod-bil',         'Rød bil',            'bilRod',        'kjoretoy', 1, 3],
  ['bla-bil',         'Blå bil',            'bilBla',        'kjoretoy', 1, 3],
  ['hvit-bil',        'Hvit bil',           'bilHvit',       'kjoretoy', 1, 3],
  ['svart-bil',       'Svart bil',          'bilSvart',      'kjoretoy', 1, 3],
  ['gronn-bil',       'Grønn bil',          'bilGronn',      'kjoretoy', 3, 3],
  ['gul-bil',         'GUL BIL!',           'bilGul',        'kjoretoy', 4, 3],
  ['oransje-bil',     'Oransje bil',        'bilOransje',    'kjoretoy', 4, 4],
  ['rosa-bil',        'Rosa bil',           'bilRosa',       'kjoretoy', 5, 4],
  ['lastebil',        'Lastebil',           'lastebil',      'kjoretoy', 2, 3],
  ['vogntog',         'Vogntog',            'vogntog',       'kjoretoy', 2, 5],
  ['buss',            'Buss',               'buss',          'kjoretoy', 2, 3],
  ['skolebuss',       'Skolebuss',          'skolebuss',     'kjoretoy', 4, 5],
  ['bobil',           'Bobil',              'bobil',         'kjoretoy', 3, 4, ['var', 'sommer', 'host']],
  ['campingvogn',     'Campingvogn',        'campingvogn',   'kjoretoy', 3, 4, ['var', 'sommer', 'host']],
  ['tilhenger',       'Bil med henger',     'tilhenger',     'kjoretoy', 3, 5],
  ['takboks',         'Bil med takboks',    'takboks',       'kjoretoy', 3, 5],
  ['sykkelstativ',    'Sykler bak på bil',  'sykkelstativ',  'kjoretoy', 4, 5],
  ['traktor',         'Traktor',            'traktor',       'kjoretoy', 2, 3],
  ['gravemaskin',     'Gravemaskin',        'gravemaskin',   'kjoretoy', 3, 3],
  ['hjullaster',      'Hjullaster',         'hjullaster',    'kjoretoy', 4, 5],
  ['broytebil',       'Brøytebil',          'broytebil',     'kjoretoy', 3, 4, ['vinter']],
  ['politibil',       'Politibil',          'politibil',     'kjoretoy', 4, 3],
  ['ambulanse',       'Ambulanse',          'ambulanse',     'kjoretoy', 4, 3],
  ['brannbil',        'Brannbil',           'brannbil',      'kjoretoy', 5, 3],
  ['blalys',          'Blålys på!',         'blalys',        'kjoretoy', 5, 3],
  ['taxi',            'Taxi',               'taxi',          'kjoretoy', 4, 5, null, null, ['by']],
  ['motorsykkel',     'Motorsykkel',        'motorsykkel',   'kjoretoy', 3, 3, ['var', 'sommer', 'host']],
  ['moped',           'Moped',              'moped',         'kjoretoy', 4, 5],
  ['sykkel',          'Sykkel',             'sykkel',        'kjoretoy', 2, 3],
  ['elsparkesykkel',  'El-sparkesykkel',    'sparkesykkel',  'kjoretoy', 4, 5, null, null, ['by']],
  ['postbil',         'Postbil',            'postbil',       'kjoretoy', 3, 4],
  ['soppelbil',       'Søppelbil',          'soppelbil',     'kjoretoy', 4, 3],
  ['betongbil',       'Betongbil',          'betongbil',     'kjoretoy', 4, 5],
  ['tankbil',         'Tankbil',            'tankbil',       'kjoretoy', 4, 5],
  ['varebil',         'Varebil',            'varebil',       'kjoretoy', 2, 4],
  ['veteranbil',      'Veteranbil',         'veteranbil',    'kjoretoy', 5, 5],
  ['cabriolet',       'Cabriolet',          'cabriolet',     'kjoretoy', 5, 5, ['sommer']],
  ['tesla',           'Tesla',              'tesla',         'kjoretoy', 2, 7],
  ['elbil-lader',     'Bil som lader',      'elbilLader',    'kjoretoy', 3, 5],
  ['hestehenger',     'Hestehenger',        'hestehenger',   'kjoretoy', 5, 5],
  ['baattilhenger',   'Båt på henger',      'baatHenger',    'kjoretoy', 4, 4, ['var', 'sommer', 'host']],
  ['traktor-henger',  'Traktor med henger', 'traktorHenger', 'kjoretoy', 3, 4],
  ['militaer',        'Militærkjøretøy',    'militaer',      'kjoretoy', 5, 5],
  ['bulk',            'Bil med bulk',       'bulk',          'kjoretoy', 4, 5],
  ['hund-i-bil',      'Hund i en bil',      'hundIBil',      'kjoretoy', 4, 4],
  ['svensk-skilt',    'Svensk bilskilt',    'skiltSverige',  'kjoretoy', 4, 7],
  ['utenlandsk',      'Utenlandsk skilt',   'skiltUtland',   'kjoretoy', 3, 7],
  ['el-skilt',        'Bilskilt som er EL', 'skiltEl',       'kjoretoy', 3, 7],

  // ---------- DYR ----------
  ['sau',             'Sau',                'sau',           'dyr', 2, 3, ['var', 'sommer', 'host']],
  ['ku',              'Ku',                 'ku',            'dyr', 2, 3, ['var', 'sommer', 'host']],
  ['hest',            'Hest',               'hest',          'dyr', 3, 3],
  ['geit',            'Geit',               'geit',          'dyr', 4, 3, ['var', 'sommer', 'host']],
  ['gris',            'Gris',               'gris',          'dyr', 5, 3],
  ['hone',            'Høne',               'hone',          'dyr', 4, 3],
  ['elg',             'ELG!',               'elg',           'dyr', 5, 3],
  ['radyr',           'Rådyr',              'radyr',         'dyr', 4, 4],
  ['hjort',           'Hjort',              'hjort',         'dyr', 5, 5],
  ['rein',            'Reinsdyr',           'rein',          'dyr', 5, 4, null, null, ['fjell']],
  ['hund',            'Hund',               'hund',          'dyr', 2, 3],
  ['katt',            'Katt',               'katt',          'dyr', 3, 3],
  ['hare',            'Hare',               'hare',          'dyr', 5, 4],
  ['ekorn',           'Ekorn',              'ekorn',         'dyr', 5, 4],
  ['rev',             'Rev',                'rev',           'dyr', 5, 4],
  ['maake',           'Måke',               'maake',         'dyr', 2, 3, null, null, ['kyst']],
  ['kraake',          'Kråke',              'kraake',        'dyr', 2, 4],
  ['and',             'And',                'and',           'dyr', 3, 3],
  ['svane',           'Svane',              'svane',         'dyr', 4, 3],
  ['gaas',            'Gås',                'gaas',          'dyr', 4, 4],
  ['due',             'Due',                'due',           'dyr', 3, 4, null, null, ['by']],
  ['skjaere',         'Skjære',             'skjaere',       'dyr', 3, 5],
  ['fugl-paa-ledning','Fugl på ledningen',  'fuglLedning',   'dyr', 3, 4],
  ['fugleflokk',      'Fugleflokk',         'fugleflokk',    'dyr', 3, 4, ['host', 'var']],
  ['fugl-i-luften',   'Fugl som flyr',      'fuglFlyr',      'dyr', 1, 3],
  ['hest-med-rytter', 'Hest med rytter',    'rytter',        'dyr', 5, 4],
  ['sau-paa-veien',   'Sau på veien',       'sauVei',        'dyr', 5, 4, ['sommer'], null, ['fjell']],

  // ---------- SKILT ----------
  ['fart-30',         '30-skilt',           'fart30',        'skilt', 3, 5],
  ['fart-40',         '40-skilt',           'fart40',        'skilt', 3, 5],
  ['fart-50',         '50-skilt',           'fart50',        'skilt', 2, 5],
  ['fart-60',         '60-skilt',           'fart60',        'skilt', 2, 5],
  ['fart-70',         '70-skilt',           'fart70',        'skilt', 2, 5],
  ['fart-80',         '80-skilt',           'fart80',        'skilt', 1, 5],
  ['fart-90',         '90-skilt',           'fart90',        'skilt', 4, 5],
  ['fart-100',        '100-skilt',          'fart100',       'skilt', 4, 5],
  ['fart-110',        '110-skilt',          'fart110',       'skilt', 5, 5],
  ['stopp',           'Stoppskilt',         'stopp',         'skilt', 3, 3],
  ['vikeplikt',       'Vikeplikt',          'vikeplikt',     'skilt', 2, 5],
  ['forkjorsvei',     'Forkjørsvei',        'forkjorsvei',   'skilt', 2, 7],
  ['innkjoring-forbudt', 'Innkjøring forbudt', 'innkjoringForbudt', 'skilt', 3, 5],
  ['elgskilt',        'Elg-skilt',          'elgskilt',      'skilt', 3, 3],
  ['barneskilt',      'Barn-skilt',         'barneskilt',    'skilt', 3, 3],
  ['gangfelt-skilt',  'Gangfelt-skilt',     'gangfeltSkilt', 'skilt', 2, 3],
  ['rundkjoring-skilt', 'Rundkjøring-skilt', 'rundkjoringSkilt', 'skilt', 2, 5],
  ['glatt',           'Glatt vei-skilt',    'glatt',         'skilt', 4, 5, ['host', 'vinter']],
  ['veiarbeid-skilt', 'Veiarbeid-skilt',    'veiarbeidSkilt', 'skilt', 3, 3],
  ['steinsprang',     'Steinsprang-skilt',  'steinsprang',   'skilt', 4, 5],
  ['tunnelskilt',     'Tunnel-skilt',       'tunnelSkilt',   'skilt', 3, 5],
  ['bensin-skilt',    'Bensin-skilt',       'bensinSkilt',   'skilt', 2, 5],
  ['rasteplass-skilt', 'Rasteplass-skilt',  'rasteplassSkilt', 'skilt', 2, 5],
  ['camping-skilt',   'Camping-skilt',      'campingSkilt',  'skilt', 4, 5],
  ['motorvei-skilt',  'Motorvei-skilt',     'motorveiSkilt', 'skilt', 3, 5],
  ['bom-skilt',       'Bomstasjon-skilt',   'bomSkilt',      'skilt', 3, 5],
  ['ferje-skilt',     'Ferje-skilt',        'ferjeSkilt',    'skilt', 4, 5],
  ['stedsnavn',       'Stedsnavn-skilt',    'stedsnavn',     'skilt', 1, 7],
  ['fylkesgrense',    'Fylkesgrense',       'fylkesgrense',  'skilt', 5, 7],
  ['hoyde',           'Høyde-begrensning',  'hoyde',         'skilt', 5, 7],
  ['sykehus-skilt',   'Sykehus-skilt',      'sykehusSkilt',  'skilt', 4, 5],

  // ---------- HUS OG BYGG ----------
  ['rodt-hus',        'Rødt hus',           'husRodt',       'bygg', 1, 3],
  ['hvitt-hus',       'Hvitt hus',          'husHvitt',      'bygg', 1, 3],
  ['gult-hus',        'Gult hus',           'husGult',       'bygg', 3, 3],
  ['blatt-hus',       'Blått hus',          'husBlatt',      'bygg', 4, 3],
  ['laave',           'Låve',               'laave',         'bygg', 2, 3],
  ['stabbur',         'Stabbur',            'stabbur',       'bygg', 4, 5],
  ['hytte',           'Hytte',              'hytte',         'bygg', 3, 3],
  ['kirke',           'Kirke',              'kirke',         'bygg', 3, 3],
  ['stavkirke',       'Stavkirke',          'stavkirke',     'bygg', 5, 7],
  ['bensinstasjon',   'Bensinstasjon',      'bensinstasjon', 'bygg', 2, 3],
  ['ladestasjon',     'Ladestasjon',        'ladestasjon',   'bygg', 3, 5],
  ['butikk',          'Dagligvarebutikk',   'butikk',        'bygg', 2, 3],
  ['skole',           'Skole',              'skole',         'bygg', 3, 5],
  ['fyrtaarn',        'Fyrtårn',            'fyrtaarn',      'bygg', 5, 3, null, null, ['kyst']],
  ['silo',            'Silo',               'silo',          'bygg', 4, 5],
  ['fabrikk',         'Fabrikk med pipe',   'fabrikk',       'bygg', 4, 5],
  ['kran',            'Byggekran',          'kran',          'bygg', 4, 3],
  ['drivhus',         'Drivhus',            'drivhus',       'bygg', 4, 5],
  ['naust',           'Naust',              'naust',         'bygg', 4, 5, null, null, ['kyst']],
  ['brygge',          'Brygge',             'brygge',        'bygg', 4, 4, null, null, ['kyst']],
  ['solcelle',        'Solcellepanel',      'solcelle',      'bygg', 4, 5],
  ['lekeplass',       'Lekeplass',          'lekeplass',     'bygg', 3, 3],
  ['fotballbane',     'Fotballbane',        'fotballbane',   'bygg', 3, 3],
  ['busskur',         'Busskur',            'busskur',       'bygg', 2, 4],
  ['melkerampe',      'Melkerampe',         'melkerampe',    'bygg', 5, 7],
  ['postkasser',      'Postkasser på rad',  'postkasser',    'bygg', 3, 4],

  // ---------- NATUR ----------
  ['fjell',           'Fjell',              'fjell',         'natur', 1, 3],
  ['snofjell',        'Fjell med snø',      'snofjell',      'natur', 3, 3],
  ['fjord',           'Fjord',              'fjord',         'natur', 2, 4, null, null, ['kyst']],
  ['innsjo',          'Innsjø',             'innsjo',        'natur', 2, 3],
  ['elv',             'Elv',                'elv',           'natur', 2, 3],
  ['foss',            'Foss',               'foss',          'natur', 3, 3],
  ['skog',            'Skog',               'skog',          'natur', 1, 3],
  ['stort-tre',       'Kjempestort tre',    'stortTre',      'natur', 3, 3],
  ['bjork',           'Bjørketre',          'bjork',         'natur', 2, 5],
  ['aaker',           'Åker',               'aaker',         'natur', 2, 4],
  ['rundballer',      'Rundballer',         'rundballer',    'natur', 2, 3, ['sommer', 'host']],
  ['steingjerde',     'Steingjerde',        'steingjerde',   'natur', 4, 4],
  ['stor-stein',      'Kjempestein',        'storStein',     'natur', 3, 3],
  ['strand',          'Strand',             'strand',        'natur', 4, 3, null, null, ['kyst']],
  ['holme',           'Holme i vannet',     'holme',         'natur', 4, 4, null, null, ['kyst']],
  ['blomstereng',     'Blomstereng',        'blomstereng',   'natur', 3, 3, ['var', 'sommer']],
  ['lupiner',         'Lupiner',            'lupiner',       'natur', 4, 5, ['sommer']],
  ['hostfarger',      'Gule høstblader',    'hostfarger',    'natur', 2, 3, ['host']],
  ['sno-bakken',      'Snø på bakken',      'snoBakken',     'natur', 1, 3, ['vinter']],
  ['is-vann',         'Is på vannet',       'isVann',        'natur', 3, 4, ['vinter']],
  ['snomann',         'Snømann',            'snomann',       'natur', 5, 3, ['vinter']],
  ['baat',            'Båt på vannet',      'baat',          'natur', 3, 3],
  ['seilbaat',        'Seilbåt',            'seilbaat',      'natur', 4, 3, ['sommer'], null, ['kyst']],
  ['ferje',           'Ferje',              'ferje',         'natur', 4, 3, null, null, ['kyst']],

  // ---------- VEI OG INFRASTRUKTUR ----------
  ['bru',             'Bru',                'bru',           'vei', 2, 3],
  ['tunnel',          'Tunnel',             'tunnel',        'vei', 2, 3],
  ['rundkjoring',     'Rundkjøring',        'rundkjoring',   'vei', 2, 4],
  ['bomstasjon',      'Bomstasjon',         'bomstasjon',    'vei', 3, 5],
  ['fotoboks',        'Fotoboks',           'fotoboks',      'vei', 4, 5],
  ['hoyspent',        'Høyspentmast',       'hoyspent',      'vei', 2, 4],
  ['vindmolle',       'Vindmølle',          'vindmolle',     'vei', 4, 3],
  ['demning',         'Demning',            'demning',       'vei', 5, 7],
  ['jernbane',        'Jernbanespor',       'jernbane',      'vei', 3, 3],
  ['tog',             'TOG!',               'tog',           'vei', 5, 3],
  ['planovergang',    'Planovergang',       'planovergang',  'vei', 5, 5],
  ['flagg',           'Norsk flagg',        'flagg',         'vei', 2, 3],
  ['flaggstang',      'Tom flaggstang',     'flaggstang',    'vei', 2, 3],
  ['rasteplass',      'Rasteplass',         'rasteplass',    'vei', 3, 4],
  ['veiarbeid',       'Veiarbeid',          'veiarbeid',     'vei', 3, 3],
  ['kjegler',         'Trafikkjegler',      'kjegler',       'vei', 3, 3],
  ['lyskryss',        'Lyskryss',           'lyskryss',      'vei', 3, 3],
  ['gangfelt',        'Fotgjengerfelt',     'gangfelt',      'vei', 2, 3],
  ['fartshump',       'Fartshump',          'fartshump',     'vei', 4, 5],
  ['autovern',        'Autovern',           'autovern',      'vei', 1, 5],
  ['broytestikke',    'Brøytestikker',      'broytestikke',  'vei', 2, 5, ['vinter']],
  ['speil-sving',     'Speil i svingen',    'speilSving',    'vei', 5, 5],
  ['gatelys',         'Gatelys',            'gatelys',       'vei', 1, 3],
  ['gul-stripe',      'Gul midtstripe',     'gulStripe',     'vei', 1, 4],
  ['km-stolpe',       'Kilometerstolpe',    'kmStolpe',      'vei', 4, 7],

  // ---------- FOLK ----------
  ['syklist',         'Syklist',            'syklist',       'folk', 2, 3],
  ['jogger',          'Noen som løper',     'jogger',        'folk', 3, 3],
  ['hundelufter',     'Noen som går med hund', 'hundelufter', 'folk', 3, 3],
  ['barnevogn',       'Barnevogn',          'barnevogn',     'folk', 3, 3],
  ['refleksvest',     'Gul refleksvest',    'refleksvest',   'folk', 3, 3],
  ['bonde',           'Bonde på jordet',    'bonde',         'folk', 4, 4],
  ['fisker',          'Noen som fisker',    'fisker',        'folk', 5, 3],
  ['vinker',          'Noen som vinker',    'vinker',        'folk', 5, 3],
  ['iskrem',          'Noen som spiser is', 'iskrem',        'folk', 5, 3, ['var', 'sommer']],
  ['paraply',         'Paraply',            'paraply',       'folk', 4, 3],

  // ---------- HIMMEL OG VÆR ----------
  ['sol',             'Sola',               'sol',           'himmel', 1, 3],
  ['regn',            'Regn',               'regn',          'himmel', 2, 3],
  ['regnbue',         'Regnbue',            'regnbue',       'himmel', 5, 3],
  ['taake',           'Tåke',               'taake',         'himmel', 4, 3],
  ['morke-skyer',     'Mørke skyer',        'morkeSkyer',    'himmel', 2, 3],
  ['fly',             'Fly på himmelen',    'fly',           'himmel', 3, 3],
  ['kondensstripe',   'Kondensstripe',      'kondensstripe', 'himmel', 3, 5],
  ['helikopter',      'Helikopter',         'helikopter',    'himmel', 5, 3],
  ['maane',           'Månen',              'maane',         'himmel', 5, 4],
  ['stjerner',        'Stjerner',           'stjerner',      'himmel', 3, 3, null, 'natt'],
  ['rar-sky',         'Sky som ligner noe', 'rarSky',        'himmel', 3, 3, null, 'dag'],
];

export const TING = RAD.map(([id, navn, ikon, kat, sjelden, alder, sesong, tid, sted]) => ({
  id,
  navn,
  ikon,
  kat,
  sjelden,
  alder,
  sesong: sesong || null,
  tid: tid || null,
  sted: sted || null,
}));

export const TING_ETTER_ID = Object.fromEntries(TING.map((t) => [t.id, t]));

// Poeng per sjeldenhetsgrad. Sjeldne ting er verdt mye mer, slik at den som
// jakter på det vanskelige kan hente inn den som bare krysser av det enkle.
// Ett poeng er én kilometer på ruta, så en vanlig biltur med familien lander
// på et par hundre kilometer. Toppen er dempet fra 15 til 12: et elgfunn skal
// være stort, men ikke tilsvare en hel bygd.
export const POENG = { 1: 1, 2: 2, 3: 3, 4: 6, 5: 12 };

export const SJELDENHET = {
  1: { navn: 'Overalt', farge: '#8D99AE' },
  2: { navn: 'Vanlig', farge: '#2A9D5C' },
  3: { navn: 'Av og til', farge: '#4EA8DE' },
  4: { navn: 'Sjelden', farge: '#9D4EDD' },
  5: { navn: 'Legendarisk', farge: '#F77F00' },
};

export function sesongNa(dato = new Date()) {
  const m = dato.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'var';
  if (m >= 6 && m <= 8) return 'sommer';
  if (m >= 9 && m <= 10) return 'host';
  return 'vinter';
}

export function tidNa(dato = new Date()) {
  const t = dato.getHours();
  return t >= 7 && t < 20 ? 'dag' : 'natt';
}
