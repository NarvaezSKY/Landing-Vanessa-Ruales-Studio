import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // Registered so React/shadcn components are available in .astro files on
  // demand. Nothing is hydrated right now, so the page ships 0 bytes of
  // framework JS -- only a `client:*` directive pulls React into the browser.
  integrations: [react()],
  // Tailwind v4 via its Vite plugin rather than the PostCSS one. The PostCSS
  // route resolves `@import 'tailwindcss'` as a filesystem path and fails;
  // the Vite plugin honours the package `exports`/`style` conditions, which is
  // what makes the bare `@import`s in src/styles/global.css resolve.
  vite: {
    plugins: [tailwindcss()],
  },
})
