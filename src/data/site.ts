import type { ImageMetadata } from 'astro'

import logo from '@/assets/logo-vanessa-ruales.png'
import portrait from '@/assets/vanessa-portrait.png'
import team from '@/assets/team.png'
import hairImage from '@/assets/services-hair.png'
import nailsImage from '@/assets/services-nails.png'
import work1 from '@/assets/work1.jpg'

export const logoImage = logo
export const portraitImage = portrait
export const teamImage = team
export const work1Image = work1

/**
 * Hero slideshow.
 *
 * team and work1 get `box`, which sizes the element box to exactly the painted
 * area (`height:100%` + `width:auto` preserves the intrinsic ratio). That makes
 * their `mask` percentages stable: with a full-viewport box, a contained image's
 * left edge lands at a fraction that drifts with the window ratio -- 37.5% at
 * 1440x900 but 43.75% at 1920x1080 -- so any viewport-relative fade misses it.
 *
 *   portrait  1024x1245 (0.82)  full box, contain, flush right
 *   team       852x614  (1.39)  box left, flush left, fades out at its right end
 *   work1     1440x1440 (1.00)  box right, flush right, fades in at its left end
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
]

export const mapsUrl =
  'https://www.google.com/maps/place/Vanessa+Ruales+studio/@2.4413805,-76.6114596,710m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8e3003203c16ba7f:0xc5a20ad8fabbe27e!8m2!3d2.4413805!4d-76.6088847!16s%2Fg%2F11wh3jww6f?entry=ttu&g_ep=EgoyMDI2MDkyOS4wIKXMDSoASAFQAw%3D%3D'

export interface Service {
  title: string
  label: string
  image: ImageMetadata
}

export const services: Service[] = [
  { title: 'Hair styling', label: 'Corte · Color · Brushing', image: hairImage },
  { title: 'Manicure', label: 'Nail art · Esmaltado · Spa', image: nailsImage },
  // Carried over from the original: Makeup reuses the hair photo because no
  // dedicated asset exists. Drop a `services-makeup` image in to replace it.
  { title: 'Makeup', label: 'Social · Novias · Editorial', image: hairImage },
]

export const prices: ReadonlyArray<readonly [string, string]> = [
  ['Corte + brushing', '$65.000'],
  ['Color completo', 'Desde $180.000'],
  ['Manicure semipermanente', '$55.000'],
  ['Maquillaje social', '$120.000'],
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
