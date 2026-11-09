const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Value for `<input type="datetime-local" step="1">`: `YYYY-MM-DDTHH:mm:ss` in local time.
 * Empty or invalid input returns `''`.
 */
export function toLocalInputValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return ''
  const date = value instanceof Date ? value : new Date(value as string | number)
  if (Number.isNaN(date.getTime())) return ''
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  )
}

/**
 * Parse a `datetime-local` value as local time. The parts are read manually because `new Date('2026-11-02')`
 * would be parsed as UTC. Returns `null` for an empty or invalid value.
 */
export function fromLocalInputValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(value)
  if (!match) return null
  const [, year, month, day, hours, minutes, seconds = '0'] = match
  const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)
  // Reject values the Date constructor silently rolls over (e.g. Feb 30).
  return date.getMonth() === +month - 1 && date.getDate() === +day ? date : null
}
