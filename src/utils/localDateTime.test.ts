import { fromLocalInputValue, toLocalInputValue } from './localDateTime'

describe('toLocalInputValue', () => {
  it('formats a Date in local time with seconds', () => {
    expect(toLocalInputValue(new Date(2026, 10, 2, 9, 5, 7))).toBe('2026-11-02T09:05:07')
  })

  it('accepts ISO strings and timestamps', () => {
    const date = new Date(2026, 0, 31, 23, 59, 59)
    expect(toLocalInputValue(date.toISOString())).toBe('2026-01-31T23:59:59')
    expect(toLocalInputValue(date.getTime())).toBe('2026-01-31T23:59:59')
  })

  it('returns an empty string for empty or invalid values', () => {
    expect(toLocalInputValue(undefined)).toBe('')
    expect(toLocalInputValue('')).toBe('')
    expect(toLocalInputValue('not a date')).toBe('')
  })
})

describe('fromLocalInputValue', () => {
  it('parses as local time, not UTC', () => {
    const date = fromLocalInputValue('2026-11-02T00:00:00')!
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([2026, 10, 2, 0])
  })

  it('accepts values without seconds (browsers omit :00)', () => {
    expect(fromLocalInputValue('2026-11-02T10:30')!.getMinutes()).toBe(30)
  })

  it('round-trips with toLocalInputValue', () => {
    expect(toLocalInputValue(fromLocalInputValue('2026-06-15T14:30:15'))).toBe('2026-06-15T14:30:15')
  })

  it('rejects empty and impossible dates', () => {
    expect(fromLocalInputValue('')).toBeNull()
    expect(fromLocalInputValue('2026-02-30T10:00:00')).toBeNull()
  })
})
