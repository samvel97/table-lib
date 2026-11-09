/**
 * Heights of the empty spacers above and below the rendered rows.
 * Virtual item positions include `scrollMargin`; the virtualizer's total size does not.
 */
export function getSpacerHeights(items: { start: number; end: number }[], totalSize: number, scrollMargin: number) {
  if (!items.length) return { before: 0, after: 0 }
  const before = Math.max(0, items[0].start - scrollMargin)
  const after = Math.max(0, totalSize - (items[items.length - 1].end - scrollMargin))
  return { before, after }
}
