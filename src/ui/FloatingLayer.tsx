import type { CSSProperties, ReactNode, Ref } from 'react'
import { FloatingPortal } from '@floating-ui/react'

/** Marks floating layers so outside-click handlers (e.g. the filters panel) ignore clicks inside them. */
export const FLOATING_ATTRIBUTE = 'data-brt-floating'

interface FloatingLayerProps {
  floatingRef: Ref<HTMLDivElement>
  style: CSSProperties
  className?: string
  children: ReactNode
  props?: Record<string, unknown>
}

/**
 * Portaled container for menus and listboxes. Carries `brt-root` so the table's scoped styles
 * and design tokens apply even though it renders outside the table element.
 */
export function FloatingLayer({ floatingRef, style, className = '', children, props }: FloatingLayerProps) {
  return (
    <FloatingPortal>
      <div
        ref={floatingRef}
        style={style}
        className={`brt-root brt-floating ${className}`}
        {...{ [FLOATING_ATTRIBUTE]: '' }}
        {...props}
      >
        {children}
      </div>
    </FloatingPortal>
  )
}
