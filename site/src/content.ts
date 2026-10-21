/**
 * Conținutul demo-ului Ramura Cafe (cafenea fictivă).
 *
 * Meniul, prețurile și recenziile nu sunt inventate: le introduce proprietarul din
 * panoul admin (`#admin`). Imaginile sunt grafică abstractă generată; videoclipul
 * este CC0, de pe Wikimedia Commons (vezi `credits`).
 */

export const venue = {
  name: 'Ramura Cafe',
  street: 'Str. Exemplului nr. 9',
  city: 'Constanța',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Constan%C8%9Ba',
  tagline: 'Cafea pentru părinți, colț de joacă pentru cei mici',
} as const

export type Picture = {
  src: string
  alt: string
  width: number
  height: number
}

export const pictures = {
  nest: {
    src: '/img/nest.jpg',
    alt: 'Un cuib de pasăre împletit din fire subțiri, cu trei ouă roșiatice.',
    width: 1200,
    height: 1380,
  },
  cafe: {
    src: '/img/cafe.jpg',
    alt: 'Două cești de cafea pe o masă lungă din lemn, într-o cafenea luminoasă.',
    width: 1200,
    height: 1440,
  },
  raspberries: {
    src: '/img/raspberries.jpg',
    alt: 'Un castron alb plin cu zmeură proaspătă.',
    width: 1200,
    height: 1440,
  },
  mugs: {
    src: '/img/mugs.jpg',
    alt: 'Căni emailate și o ceainică pe o masă de lemn, în lumină caldă.',
    width: 1600,
    height: 1000,
  },
  teapot: {
    src: '/img/teapot.jpg',
    alt: 'Ceainic de sticlă cu ceai de plante lângă un buchet de flori galbene.',
    width: 1600,
    height: 1000,
  },
  golden: {
    src: '/img/golden.jpg',
    alt: 'Câteva fructe de zmeură pe o margine albă, în lumină aurie.',
    width: 1600,
    height: 1000,
  },
} satisfies Record<string, Picture>

export const heroVideo = {
  src: '/img/latte.webm',
  poster: '/img/latte-poster.jpg',
  caption: 'Video de atmosferă, nu filmat la Ramura Cafe',
}

/** Cele trei teme ale cafenelei. */
export type EggId = 'cafea' | 'joaca' | 'bucurii'

export const eggs: { id: EggId; label: string; line: string; picture: Picture }[] = [
  {
    id: 'cafea',
    label: 'Cafea',
    line: 'O ceașcă băută fără grabă, la o masă din centrul Constanței.',
    picture: pictures.cafe,
  },
  {
    id: 'joaca',
    label: 'Joacă',
    line: 'Cei mici au un colț al lor, iar voi rămâneți la doi pași de ei.',
    picture: pictures.nest,
  },
  {
    id: 'bucurii',
    label: 'Prieteni',
    line: 'Prieteni, vecini, o după-amiază care se lungește puțin peste plan.',
    picture: pictures.raspberries,
  },
]

export const family = {
  heading: 'Loc și pentru cei mici',
  blocks: [
    {
      title: 'Un colț pentru joacă',
      text: 'Ramura Cafe e gândită pentru familii cu bebeluși și copii mici. Cei mici își găsesc locul, iar părinții își pot bea cafeaua fără să plece de lângă ei.',
    },
    {
      title: 'Voi rămâneți alături',
      text: 'Colțul de joacă nu este un serviciu de supraveghere. Copiii stau în grija adulților care îi însoțesc, la vedere, cât timp vă bucurați de vizită.',
    },
  ],
}

export const menu = {
  heading: 'Meniul Ramura Cafe',
  emptyNote: 'Băuturile și prețurile apar aici după ce Ramura Cafe le confirmă. Nu publicăm o listă inventată.',
  aside: 'Întreabă la cafenea ce e nou azi.',
}

export const reviews = {
  heading: 'Ce spun oaspeții',
  emptySlot: 'Loc pentru o recenzie reală. Se adaugă din panoul admin, cu acordul autorului.',
}

export const visit = {
  heading: 'Vino în cuib',
  hoursNote: 'Programul: în curs de confirmare',
  picturesNote: 'Imagini de atmosferă, nu fotografii ale cafenelei.',
  pictures: [pictures.mugs, pictures.teapot, pictures.golden],
}

export type Credit = {
  title: string
  author?: string
  licence: string
  licenceUrl: string
  page: string
  via: string
}

export const credits: Credit[] = [
  { title: 'Latte art flower', author: 'Anna Frodesiak', licence: 'CC0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.en', page: 'https://commons.wikimedia.org/wiki/File:Latte_art_flower_-_01.webm', via: 'Wikimedia Commons' },
]

/** Ce așteptăm de la proprietar (afișat în nota demo din footer). */
export const pendingFromOwner = [
  'logo și fotografii reale ale cafenelei',
  'meniul cu prețuri (se introduce din admin)',
  'recenzii reale, cu acordul autorilor',
  'programul de funcționare',
  'telefon și rețele sociale',
]
