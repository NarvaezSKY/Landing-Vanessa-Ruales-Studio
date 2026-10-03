/**
 * Slow-drifting gold motes confined to the page gutters (the space outside
 * .container), so the decorative layer never sits on top of body copy.
 *
 * Rendering notes:
 *  - Each mote is a drawImage() of one pre-rendered radial-gradient sprite.
 *    Building a gradient per mote per frame was the obvious approach and is
 *    roughly an order of magnitude more expensive.
 *  - Depth is faked with a small scroll-linked offset rather than a real
 *    3D setup; motes wrap through a padded band so they never pop.
 */

const canvas = document.querySelector<HTMLCanvasElement>('[data-particles]')
const ctx = canvas?.getContext('2d', { alpha: true })

interface Mote {
  x: number
  y: number
  r: number
  vy: number
  depth: number
  alpha: number
  twinkle: number
  phase: number
}

const CONTAINER_MAX = 1180 // .container max-width in global.css
const GUTTER_MIN = 16 // below this the side margin is too thin to bother
const PARALLAX_BAND = 140 // vertical slack so wrapping is never visible
const SPRITE = 32
const MAX_MOTES = 44
const FRAME_MS = 1000 / 30
const SCROLL_IDLE_MS = 150

if (canvas && ctx && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const motes: Mote[] = []
  let width = 0
  let height = 0
  let frame = 0
  let running = false
  let lastDraw = 0
  let scrollIdleTimer = 0
  let scrolling = false
  let blocked = false

  const sprite = document.createElement('canvas')
  sprite.width = SPRITE
  sprite.height = SPRITE
  const spriteCtx = sprite.getContext('2d')!
  const halo = spriteCtx.createRadialGradient(
    SPRITE / 2,
    SPRITE / 2,
    0,
    SPRITE / 2,
    SPRITE / 2,
    SPRITE / 2,
  )
  halo.addColorStop(0, 'rgba(255, 232, 186, 1)')
  halo.addColorStop(0.35, 'rgba(229, 167, 47, 0.5)')
  halo.addColorStop(1, 'rgba(229, 167, 47, 0)')
  spriteCtx.fillStyle = halo
  spriteCtx.fillRect(0, 0, SPRITE, SPRITE)

  /** Half-width of the empty margin on each side of the content column. */
  const gutter = () => {
    const total = (width - CONTAINER_MAX) / 2
    return total >= GUTTER_MIN ? total : 0
  }

  const randomX = () => {
    const g = gutter()
    return Math.random() < 0.5 ? Math.random() * g : width - g + Math.random() * g
  }

  const seed = () => {
    motes.length = 0
    const g = gutter()
    if (!g) return

    // Density scales with gutter area and viewport height, but stays capped.
    const count = Math.min(MAX_MOTES, Math.round(g * 1.8 * (height / 900)))
    for (let i = 0; i < count; i++) {
      motes.push({
        x: randomX(),
        y: Math.random() * (height + PARALLAX_BAND * 2) - PARALLAX_BAND,
        r: 0.5 + Math.random() * 1.7,
        vy: -(0.05 + Math.random() * 0.2),
        depth: 0.02 + Math.random() * 0.05,
        alpha: 0.14 + Math.random() * 0.38,
        twinkle: 0.004 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
      })
    }
  }

  /**
   * Motes are soft glows a few pixels across, so the extra resolution of a 2x
   * backing store buys nothing visible while making the full-viewport clearRect
   * up to four times more expensive. At 120Hz the frame budget is 8.3ms and
   * that clear lands squarely on scroll frames.
   */
  const resize = () => {
    const dpr = 1
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    seed()

    // Narrow viewports have no gutter, hence no motes: park the loop instead of
    // spinning rAF against an empty canvas. Growing past the breakpoint again
    // has to explicitly restart it, which the old resize path never did.
    if (isActive()) start()
    else stop()
  }

  const draw = (now: number) => {
    if (!running) return

    // rAF fires at the display rate, but the expensive half of a frame (a
    // viewport-sized clearRect plus one drawImage per mote) only runs at
    // ~30fps. The motes drift a fraction of a pixel per frame and the twinkle is
    // slow, so the halved cadence is invisible while saving half the fill rate.
    if (now - lastDraw < FRAME_MS) {
      frame = requestAnimationFrame(draw)
      return
    }

    const delta = Math.min(now - lastDraw, 48) // clamp after tab-switch stalls
    lastDraw = now

    if (!motes.length) {
      stop()
      return
    }

    ctx.clearRect(0, 0, width, height)

    const scroll = window.scrollY
    const span = height + PARALLAX_BAND * 2

    for (const mote of motes) {
      mote.y += mote.vy * (delta / 16)
      mote.phase += mote.twinkle * delta

      if (mote.y < -PARALLAX_BAND) mote.y += span
      else if (mote.y > height + PARALLAX_BAND) mote.y -= span

      const screenY = ((((mote.y - scroll * mote.depth) + PARALLAX_BAND) % span) + span) % span - PARALLAX_BAND

      ctx.globalAlpha = mote.alpha * (0.55 + 0.45 * Math.sin(mote.phase))
      const size = mote.r * 7
      ctx.drawImage(sprite, mote.x - size / 2, screenY - size / 2, size, size)
    }
    ctx.globalAlpha = 1

    frame = requestAnimationFrame(draw)
  }

  const isActive = () => !blocked && !scrolling && motes.length > 0

  const start = () => {
    if (running || !isActive()) return
    running = true
    lastDraw = performance.now()
    frame = requestAnimationFrame(draw)
  }

  const stop = () => {
    if (!running) return
    running = false
    cancelAnimationFrame(frame)
  }

  /**
   * The canvas sits over the whole viewport, so every scroll frame has to
   * composite it. The motes drift a fraction of a pixel per frame and the
   * scroll-linked offset is imperceptible mid-scroll, so the loop parks while
   * the user is scrolling and picks up again once they settle.
   */
  const onScroll = () => {
    if (!motes.length || blocked) return
    scrolling = true
    stop()
    window.clearTimeout(scrollIdleTimer)
    scrollIdleTimer = window.setTimeout(() => {
      scrolling = false
      start()
    }, SCROLL_IDLE_MS)
  }

  // No point burning frames on a background tab.
  document.addEventListener('visibilitychange', () => {
    blocked = document.hidden
    if (isActive()) start()
    else stop()
  })

  // A service dialog covers the page with a near-opaque veil, so the motes are
  // invisible while one is up. Pausing keeps the rAF loop from competing with
  // the dialog's own paint work.
  document.addEventListener('modal', (event) => {
    const { open } = (event as CustomEvent<{ open: boolean }>).detail
    blocked = open
    if (isActive()) start()
    else stop()
  })

  window.addEventListener('scroll', onScroll, { passive: true })

  let resizeTimer = 0
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(resize, 150)
  })

  resize()
}
