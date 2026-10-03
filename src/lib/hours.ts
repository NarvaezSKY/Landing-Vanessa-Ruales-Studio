/**
 * Open/closed logic for the studio's schedule.
 *
 * Everything here is a pure function so the same code can run at build time
 * (to render a correct-first-paint tag) and in the browser (to keep it fresh).
 *
 * All comparisons happen on the wall clock in `America/Bogota`, never on the
 * visitor's local time. Colombia is UTC-5 year-round, so the studio's 18:30 is
 * 18:30 for everyone regardless of where the page is being read.
 */

import type { DayHours } from '@/data/site'

// Re-exported so the browser-side script can type the JSON it reads off the DOM
// without importing `@/data/site`, which would pull the image assets into the
// client bundle. Type-only, so it is erased at compile time.
export type { DayHours }

const TIME_ZONE = 'America/Bogota'

/** `Intl` weekday abbreviations for `en-US`, in `Date.getDay()` order. */
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

/** `hours` is Monday-first for display; `getDay()` is Sunday-first. */
const JS_DAY_TO_INDEX = [6, 0, 1, 2, 3, 4, 5]

export interface StudioNow {
  /** Index into the Monday-first `hours` array. */
  dayIndex: number
  minutes: number
}

export interface StudioStatus {
  isOpen: boolean
  /** e.g. `Ahora mismo estamos ABIERTOS` */
  label: string
  /** e.g. `Cierra a las 6:30 p. m.` or `Abre el lunes a las 8:00 a. m.` */
  next: string
}

/** Minutes since midnight for an `HH:MM` string. */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** `18:30` -> `6:30 p. m.`, matching the schedule list's own formatting. */
export function formatTime(hhmm: string): string {
  const total = toMinutes(hhmm)
  const h24 = Math.floor(total / 60)
  const m = total % 60
  const suffix = h24 < 12 ? 'a. m.' : 'p. m.'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

/**
 * Wall-clock time in the studio's timezone for an arbitrary instant.
 *
 * `hourCycle: 'h23'` rather than `hour12: false`: the latter renders midnight
 * as hour `24` in several engines, which would push 00:30 past the 18:30 close.
 */
export function getStudioNow(date: Date = new Date()): StudioNow {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const read = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const weekday = WEEKDAYS.indexOf(read('weekday') as (typeof WEEKDAYS)[number])
  const dayIndex = JS_DAY_TO_INDEX[weekday === -1 ? 0 : weekday]

  return {
    dayIndex,
    minutes: Number(read('hour')) * 60 + Number(read('minute')),
  }
}

/** Next day (wrapping) that has any hours, searching forward from `from`. */
function nextOpenDay(hours: DayHours[], from: number): { index: number; entry: DayHours } {
  for (let step = 1; step <= hours.length; step++) {
    const index = (from + step) % hours.length
    if (hours[index].open) return { index, entry: hours[index] }
  }
  throw new Error('hours: no day is open')
}

export function evaluate(hours: DayHours[], date: Date = new Date()): StudioStatus {
  const { dayIndex, minutes } = getStudioNow(date)
  const today = hours[dayIndex]

  if (today.open && today.close) {
    const open = toMinutes(today.open)
    const close = toMinutes(today.close)

    if (minutes >= open && minutes < close) {
      return {
        isOpen: true,
        label: 'Ahora mismo estamos ABIERTOS',
        next: `Cierra a las ${formatTime(today.close)}`,
      }
    }

    // Closed today: either not yet open, or already shut for the day.
    const when = minutes < open ? `Abre hoy a las ${formatTime(today.open)}` : null
    if (when) return { isOpen: false, label: 'Ahora mismo estamos CERRADOS', next: when }
  }

  const { entry } = nextOpenDay(hours, dayIndex)
  return {
    isOpen: false,
    label: 'Ahora mismo estamos CERRADOS',
    next: `Abre el ${entry.day.toLowerCase()} a las ${formatTime(entry.open!)}`,
  }
}