/**
 * Hero slideshow: crossfades the stacked .hero-shot images every 8s.
 *
 * The images are all server-rendered, so this only toggles a class -- there is
 * no fetching and no layout work per swap.
 *
 * Two things keep this from costing anything while the user is not looking at
 * the hero: the timer is torn down when the hero scrolls out of view or the tab
 * goes to the background, and under `prefers-reduced-motion: reduce` the extra
 * shots are dropped from the DOM entirely instead of being fetched and cycled.
 */

const ROTATE_MS = 8000

const rotator = document.querySelector<HTMLElement>('[data-hero-rotator]')

if (rotator) {
  const shots = Array.from(rotator.querySelectorAll<HTMLElement>('.hero-shot'))
  let index = Math.max(
    shots.findIndex((shot) => shot.classList.contains('is-active')),
    0,
  )

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (calm) {
    // Nobody is going to see them, so stop paying for them: the <img> nodes go
    // away and their requests are cancelled if still in flight.
    shots.slice(1).forEach((shot) => shot.remove())
  } else if (shots.length > 1) {
    let timer = 0

    const show = (next: number) => {
      shots.forEach((shot, i) => shot.classList.toggle('is-active', i === next))
      index = next
    }

    const start = () => {
      window.clearInterval(timer)
      timer = window.setInterval(() => show((index + 1) % shots.length), ROTATE_MS)
    }

    const stop = () => window.clearInterval(timer)

    // Only rotate while the hero is actually on screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0 },
      ).observe(rotator)
    } else {
      start()
    }

    // Same reason: a background tab has no reason to keep a timer alive.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop()
      else start()
    })
  }
}