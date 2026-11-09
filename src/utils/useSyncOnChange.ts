import { useState } from 'react'

/**
 * Run `sync` on the first render and whenever `value` changes, during render.
 *
 * This is React's recommended way to adjust local state when a prop changes
 * (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
 * Unlike `useEffect(() => setState(...), [value])` it does not paint stale state for a frame
 * and does not trigger an extra render pass. `sync` may only update this component's own state.
 */
export function useSyncOnChange<T>(value: T, sync: (value: T) => void) {
  const [previous, setPrevious] = useState<{ value: T } | null>(null)
  if (previous === null || !Object.is(previous.value, value)) {
    setPrevious({ value })
    sync(value)
  }
}
