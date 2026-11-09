import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useTableLayout } from '../../layoutContext'
import { getSpacerHeights } from './virtualSpacers'

interface VirtualRowsProps {
  count: number
  estimateRowHeight: number
  overscan: number
  /** measureRef must be attached to the row element (it is stable, so memoized rows are not re-rendered). */
  renderRow(index: number, measureRef: (element: HTMLElement | null) => void): ReactNode
}

/**
 * Renders only the rows near the viewport of the table's scroll container.
 * Spacer elements keep the full scroll height, so sticky columns and the flex row layout keep working.
 */
export function VirtualRows({ count, estimateRowHeight, overscan, renderRow }: VirtualRowsProps) {
  const { scrollElement } = useTableLayout()
  const listRef = useRef<HTMLDivElement>(null)
  // Distance from the top of the scroll content to the first row (header + frozen rows).
  const [scrollMargin, setScrollMargin] = useState(0)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list || !scrollElement) return
    const update = () => {
      const offset =
        list.getBoundingClientRect().top - scrollElement.getBoundingClientRect().top + scrollElement.scrollTop
      setScrollMargin((previous) => (Math.abs(previous - offset) < 1 ? previous : offset))
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    // Header height and frozen rows change the offset.
    const observer = new ResizeObserver(update)
    Array.from(scrollElement.children).forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [scrollElement])

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollElement,
    estimateSize: () => estimateRowHeight,
    overscan,
    scrollMargin,
  })

  const items = virtualizer.getVirtualItems()
  const { before, after } = getSpacerHeights(items, virtualizer.getTotalSize(), scrollMargin)

  return (
    <div ref={listRef} className='brt-virtual-rows'>
      {before > 0 ? <div aria-hidden='true' style={{ height: before }} /> : null}
      {items.map((item) => renderRow(item.index, virtualizer.measureElement))}
      {after > 0 ? <div aria-hidden='true' style={{ height: after }} /> : null}
    </div>
  )
}
