import { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react'

export interface TableLayout {
  /** The table's own scroll container (`.G-data-scroll`). */
  scrollElement: HTMLDivElement | null
  /** True when columns overflow horizontally; rows then use `max-content` width. */
  hasHorizontalScroll: boolean
}

export const TableLayoutContext = createContext<TableLayout>({ scrollElement: null, hasHorizontalScroll: false })

export const useTableLayout = () => useContext(TableLayoutContext)

/**
 * Tracks the scroll container and whether it scrolls horizontally.
 * Replaces v7's `hasScroll()`, which read the first `.G-data-scroll` on the page once per row on every render.
 */
export function useTableLayoutState() {
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null)
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false)

  const measure = useCallback(() => {
    if (!scrollElement) return
    setHasHorizontalScroll(scrollElement.scrollWidth > scrollElement.clientWidth)
  }, [scrollElement])

  // Columns can change on any render (visibility, order); one layout read per table render is cheap.
  // Measuring layout and storing the result is what useLayoutEffect is for; React bails out when unchanged.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(measure)

  useLayoutEffect(() => {
    if (!scrollElement || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(scrollElement)
    return () => observer.disconnect()
  }, [scrollElement, measure])

  return { scrollElement, setScrollElement, hasHorizontalScroll }
}
