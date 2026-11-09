/** Small inline loading indicator. */
export function Spinner({ size = 16, label = 'Loading' }: { size?: number; label?: string }) {
  return <span className='brt-spinner' role='status' aria-label={label} style={{ width: size, height: size }} />
}

/** Grey placeholder bar shown while content loads. */
export function Skeleton({ width = '100%', height = 14 }: { width?: number | string; height?: number }) {
  return <span className='brt-skeleton' aria-hidden='true' style={{ width, height }} />
}
