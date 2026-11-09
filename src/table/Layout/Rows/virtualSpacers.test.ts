import { getSpacerHeights } from './virtualSpacers'

describe('getSpacerHeights', () => {
  it('has no spacers when nothing is rendered', () => {
    expect(getSpacerHeights([], 0, 0)).toEqual({ before: 0, after: 0 })
  })

  it('fills the space above and below the rendered window', () => {
    // 100 rows of 30px; rows 10-19 rendered; the list starts 80px into the scroll content.
    const items = Array.from({ length: 10 }, (_, i) => ({ start: 80 + (10 + i) * 30, end: 80 + (11 + i) * 30 }))
    expect(getSpacerHeights(items, 3000, 80)).toEqual({ before: 300, after: 2400 })
  })

  it('has no top spacer for the first rows', () => {
    const items = [{ start: 80, end: 110 }]
    expect(getSpacerHeights(items, 300, 80).before).toBe(0)
  })

  it('never returns negative heights', () => {
    expect(getSpacerHeights([{ start: 10, end: 500 }], 100, 80)).toEqual({ before: 0, after: 0 })
  })
})
