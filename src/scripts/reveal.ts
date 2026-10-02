/**
 * Reveals [data-reveal] elements as they scroll into view.
 *
 * The hiding state lives in CSS (`.has-js [data-reveal]`), keyed off a class
 * the layout sets inline in <head>. This script only adds `.is-visible`.
 */
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')

if (targets.length) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-visible'))
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      // Start the fade slightly before the element reaches the fold, and
      // require a sliver of it to be visible so tall blocks do not fire early.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    targets.forEach((el) => observer.observe(el))
  }
}
