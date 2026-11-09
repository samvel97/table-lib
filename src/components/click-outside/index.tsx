import { useEffect, useRef, type ReactNode } from 'react'

interface IClickOutSide {
  onClickOutside(event: MouseEvent): void
  children: ReactNode
}

/** True when the click happened inside one of the table's floating layers (listbox, menu) rendered in a portal. */
const isInsideFloatingLayer = (target: Element | null) => Boolean(target?.closest('[data-brt-floating]'))

/** Calls `onClickOutside` for clicks outside its children. */
const ClickOutside = ({ onClickOutside, children }: IClickOutSide) => {
  const containerRef = useRef<HTMLDivElement>(null)
  // Keep the latest callback without re-subscribing the document listener on every render.
  const callbackRef = useRef(onClickOutside)
  useEffect(() => {
    callbackRef.current = onClickOutside
  })

  useEffect(() => {
    const handle = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (!containerRef.current || containerRef.current.contains(target)) return
      if (isInsideFloatingLayer(target)) return
      callbackRef.current(event)
    }
    document.addEventListener('click', handle, true)
    return () => document.removeEventListener('click', handle, true)
  }, [])

  return (
    <div className='E-click-outside' ref={containerRef}>
      {children}
    </div>
  )
}

export default ClickOutside
