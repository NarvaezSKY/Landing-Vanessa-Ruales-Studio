/** Trim a `widths` ladder to the source image's intrinsic width.
 *
 * Astro happily renders a variant wider than the source, so an ask for 1560px
 * from an 828px photo ships a larger file that also looks worse. Whenever a
 * source gets re-encoded at a smaller resolution its ladder has to shrink with
 * it, and forgetting that is the whole bug: the numbers in the components look
 * reasonable on their own and are only wrong next to the actual asset.
 *
 * Clamping on read keeps that relationship automatic, so replacing an image is
 * the only step needed. Duplicates are dropped because clamping collapses
 * several rungs onto the source width, and Astro would otherwise emit the same
 * file two or three times under different names. */
export function fitWidths(widths: readonly number[], intrinsic: number): number[] {
  const max = Math.max(1, Math.round(intrinsic))
  return [...new Set(widths.map((w) => Math.min(Math.round(w), max)))].sort((a, b) => a - b)
}