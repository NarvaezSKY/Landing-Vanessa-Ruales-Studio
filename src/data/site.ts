import type { ImageMetadata } from 'astro'

import logo from '@/assets/brand/logo.png'
import portrait from '@/assets/hero/vanessa-portrait.png'
import aboutPortrait from '@/assets/about/portrait.png'
import team from '@/assets/hero/team.png'
import nails1 from '@/assets/services/nails1.jpeg'
import nails2 from '@/assets/services/nails2.jpeg'
import nails3 from '@/assets/services/nails3.jpeg'
import nails4 from '@/assets/services/nails4.jpeg'
import nails5 from '@/assets/services/nails5.jpeg'
import skin1 from '@/assets/services/skin1.jpg'
import skin2 from '@/assets/services/skin2.jpg'
import skin3 from '@/assets/services/skin3.jpg'
import skin4 from '@/assets/services/skin4.png'
import skin5 from '@/assets/services/skin5.png'
import work1 from '@/assets/hero/work1.jpg'
import work2 from '@/assets/hero/work2.jpg'
import work3 from '@/assets/hero/work3.png'

export const logoImage = logo
export const portraitImage = aboutPortrait
export const teamImage = team
export const work1Image = work1

/**
 * Hero slideshow.
 *
 * team and the square shots get `box`, which sizes the element box to exactly
 * the painted area (`height:100%` + `width:auto` preserves the intrinsic ratio).
 * That makes their `mask` percentages stable: with a full-viewport box, a
 * contained image's left edge lands at a fraction that drifts with the window
 * ratio -- 37.5% at 1440x900 but 43.75% at 1920x1080 -- so any viewport-relative
 * fade misses it.
 *
 *   portrait  1024x1245 (0.82)  full box, contain, flush right
 *   team       852x614  (1.39)  box left, flush left, fades out at its right end
 *   work1     1440x1440 (1.00)  box right, flush right, fades in at its left end
 *   work2      943x940  (1.00)  same as work1
 *   work3     1080x1134 (0.95)  box right, flush right, fades in at its left end
 *
 * Text legibility comes from `.hero:before`; the masks only soften photo edges.
 */
export interface HeroShot {
  src: ImageMetadata
  alt: string
  /** Placement inside the box. */
  position: string
  fit: 'cover' | 'contain'
  /** Anchor to a box sized like the painted image instead of the viewport. */
  box?: 'left' | 'right'
  /** Fade, in this shot's own box coordinates. */
  mask?: string
  /**
   * Candidate widths. Defaults to the shared [800, 1200, 1600] ladder, but a
   * source narrower than that must not be asked for a larger variant: work3 is
   * 671px wide, and upscaling it would ship three blurry files instead of one
   * sharp one.
   */
  widths?: number[]
}

export const heroShots: HeroShot[] = [
  { src: portrait, alt: 'Vanessa Ruales en el estudio', position: '100% 50%', fit: 'contain' },
  {
    src: team,
    alt: 'El equipo de Vanessa Ruales Studio',
    position: '50% 50%',
    fit: 'contain',
    box: 'right',
    mask: 'linear-gradient(90deg,transparent 0%,rgba(0,0,0,.45) 6%,#000 16%)',
  },
  {
    src: work1,
    alt: 'Trabajo realizado en el estudio',
    position: '50% 50%',
    fit: 'contain',
    box: 'right',
    mask: 'linear-gradient(90deg,transparent 0%,rgba(0,0,0,.45) 6%,#000 16%)',
  },
  {
    src: work2,
    alt: 'Trabajo realizado en el estudio',
    position: '50% 50%',
    fit: 'contain',
    box: 'right',
    mask: 'linear-gradient(90deg,transparent 0%,rgba(0,0,0,.45) 6%,#000 16%)',
    widths: [480, 720, 943],
  },
  {
    src: work3,
    alt: 'Trabajo realizado en el estudio',
    position: '50% 50%',
    fit: 'contain',
    box: 'right',
    mask: 'linear-gradient(90deg,transparent 0%,rgba(0,0,0,.45) 6%,#000 16%)',
    widths: [520, 800, 1080],
  },
]

export const address = 'Cra. 9 #5-85, Centro, Popayán, Cauca'

/** Canonical origin. Drives the canonical link, Open Graph URLs, the sitemap
 *  and `Astro.site`, so a wrong value here is the one thing that can actively
 *  hurt: Google is told to index `siteUrl` as the real address of the page.
 *  Must be the live https domain with no trailing slash. */
export const siteUrl = 'https://vanessarualesstudio.com'

/** Split out of `address` so the postal markup is structured rather than a
 *  blob of text, which is what local results actually read. */
export const postalAddress = {
  streetAddress: 'Cra. 9 #5-85, Centro',
  addressLocality: 'Popayán',
  addressRegion: 'Cauca',
  addressCountry: 'CO',
}

/** `Salón de belleza` is the category term people type, so it goes in the
 *  markup; the visible copy stays as it is. */
export const businessCategory = 'Salón de belleza'
export const businessType = ['BeautySalon']

/** Neighbouring towns and regions worth surfacing for. Typed because
 *  `areaServed` accepts a mix: a town is a `City`, a department an
 *  `AdministrativeArea` and the country a `Country`. Flattening them all into
 *  one type is the kind of thing that reads fine and means nothing. */
export const areaServed = [
  { '@type': 'City', name: 'Popayán' },
  { '@type': 'AdministrativeArea', name: 'Cauca' },
  { '@type': 'City', name: 'Pasto' },
  { '@type': 'AdministrativeArea', name: 'Nariño' },
  { '@type': 'City', name: 'Cali' },
  { '@type': 'Country', name: 'Colombia' },
]

/** Coordinates are the single source of truth: both the link and the embed
 *  derive from them, so they cannot drift apart the way the old hardcoded
 *  place URL did. */
export const coords = { lat: 2.4413805, lng: -76.6088847 }

/** Google's own record for the studio carries this CID, so the link resolves to
 *  the business itself instead of running a coordinate search that can snap to a
 *  neighbouring listing. Drop the CID and it lands across the street. */
const placeId = '0x8e3003203c16ba7f:0xc5a20ad8fabbe27e'

export const mapsUrl =
  'https://www.google.com/maps/place/Vanessa+Ruales+studio/@' +
  `${coords.lat},${coords.lng},17z/data=!4m6!3m5!1s${placeId}!8m2!3d${coords.lat}!4d${coords.lng}` +
  '!16s%2Fg%2F11wh3jww6f'

/**
 * No-key embed. Google does not officially support this outside of an API-key
 * project, so the visible "VER EN MAPS" CTA is the guaranteed fallback if the
 * frame ever comes back blank. Swap `mapsEmbedUrl` for an OpenStreetMap embed
 * to drop that dependency entirely.
 *
 * `ll` is what keeps the frame on the storefront: on its own `q=lat,lng` is run
 * as a place search, and the resolver lands on a nearby listing a couple of
 * dozen metres away. `ll` sets the viewport centre outright, so the resolution
 * can no longer drag the map off the door.
 */
export const mapsEmbedUrl =
  `https://www.google.com/maps?q=${coords.lat},${coords.lng}&ll=${coords.lat},${coords.lng}&z=19&hl=es&output=embed`

export interface DayHours {
  /** Monday-first, matching the order shown in the schedule list. */
  day: string
  /** `null` means closed all day. */
  open: string | null
  close: string | null
}

/** Popayán is UTC-5 with no daylight saving, so these wall-clock strings hold
 *  all year. The open/closed tag converts them with the same offset. */
export const hours: DayHours[] = [
  { day: 'Lunes', open: '08:00', close: '18:30' },
  { day: 'Martes', open: '08:00', close: '18:30' },
  { day: 'Miércoles', open: '08:00', close: '18:30' },
  { day: 'Jueves', open: '08:00', close: '18:30' },
  { day: 'Viernes', open: '08:00', close: '18:30' },
  { day: 'Sábado', open: '08:00', close: '18:30' },
  { day: 'Domingo', open: null, close: null },
]

export interface Service {
  title: string
  label: string
  // The card shows `preview`; the dialog cycles the whole set. Keeping them in
  // one array means a new photo only has to be appended to the right category.
  images: ImageMetadata[]
}

export const services: Service[] = [
  {
    title: 'Manicure',
    label: 'Nail art · Esmaltado · Spa',
    images: [nails1, nails2, nails3, nails4, nails5],
  },
  {
    title: 'Skin',
    label: 'Cera · Facial · Depilación',
    images: [skin1, skin2, skin3, skin4, skin5],
  },
]

export interface PriceGroup {
  label: string
  icon: string
  items: ReadonlyArray<readonly [string, string]>
}

export const prices: PriceGroup[] = [
  {
    label: 'Cera',
    icon: '🧴',
    items: [
      ['Cejas', '$18.000'],
      ['Bikini spa', '$100.000'],
      ['Bikini', '$50.000'],
      ['Despigmentación axilar', '$50.000'],
      ['Pierna completa', '$50.000'],
      ['Media pierna', '$25.000'],
      ['Axila normal', '$20.000'],
      ['Bozo', '$8.000'],
      ['Semi hombre', '$30.000'],
      ['Brazo', '$25.000'],
      ['Nariz', '$6.000'],
      ['Facial', '$45.000'],
      ['Patilla', '$7.000'],
      ['Frente', '$6.000'],
      ['Mentón', '$7.000'],
      ['Sombreado', '$35.000'],
      ['Pestañas punto', '$35.000'],
    ],
  },
  {
    label: 'Uñas',
    icon: '💅',
    items: [
      ['Poly gel', '$130.000'],
      ['Acrílico', '$130.000'],
      ['Recubrimiento en poly gel', '$80.000'],
      ['Recubrimiento en acrílico', '$80.000'],
      ['Press on', '$90.000'],
      ['Semipermanente manos', '$50.000'],
      ['Semipermanente pies', '$45.000'],
      ['Dipping', '$70.000'],
      ['Semi hombre', '$30.000'],
      ['Pies', '$30.000'],
      ['Base rubber', '$60.000'],
      ['Retoque de acrílico y poly', '$80.000'],
      ['Tradicional manos', '$20.000'],
      ['Tradicional pies', '$25.000'],
      ['Limpieza manos', '$18.000'],
      ['Limpieza pies', '$23.000'],
      ['Retiro semi', '$10.000'],
      ['Retiro acrílico, press y poly gel', '$15.000'],
    ],
  },
]

export interface NavLink {
  href: string
  label: string
}

export const navLinks: NavLink[] = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#precios', label: 'Precios' },
  { href: '#conocenos', label: 'Conócenos' },
  { href: '#ubicacion', label: 'Ubicación' },
]

export interface SocialLink {
  href: string
  label: string
  glyph: string
}

export const socials: SocialLink[] = [
  { href: 'https://instagram.com/vanessa_ruales_studio2', label: '@vanessa_ruales_studio2', glyph: '◎' },
  { href: 'https://facebook.com/vane.ruales.3', label: 'Vanessa Ruales', glyph: 'f' },
]

/* --- SEO helpers ---------------------------------------------------------- */

/** The seven day names mapped to their schema.org counterparts, since the
 *  visible list is Spanish and `openingHoursSpecification` is not. */
const daySchema: Record<string, string> = {
  Lunes: 'Monday',
  Martes: 'Tuesday',
  Miércoles: 'Wednesday',
  Jueves: 'Thursday',
  Viernes: 'Friday',
  Sábado: 'Saturday',
  Domingo: 'Sunday',
}

/** Hours straight from the same array the schedule list renders, so the markup
 *  cannot claim the studio is open when the page says otherwise. Closed days
 *  are simply left out of the graph. */
export const openingHoursSchema = hours
  .filter((h) => h.open !== null && h.close !== null)
  .map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${daySchema[h.day]}`,
    opens: h.open,
    closes: h.close,
  }))

/** Prices are stored as formatted strings (`$130.000`), so the currency digits
 *  get pulled out for `priceRange`. Copied from the list, not retyped. */
const toNumber = (formatted: string) => Number(formatted.replace(/[^\d]/g, ''))

export const priceNumbers = prices.flatMap((group) => group.items.map(([, value]) => toNumber(value)))

export const priceMin = Math.min(...priceNumbers)
export const priceMax = Math.max(...priceNumbers)

/** Compact form for `priceRange`, which search engines read as a hint, not a
 *  contract. `$$` is the conventional marker; the exact figures are already in
 *  the catalog markup below. */
export const priceRange = `$$${Math.round(priceMin / 1000)} - $${Math.round(priceMax / 1000)} COP`
