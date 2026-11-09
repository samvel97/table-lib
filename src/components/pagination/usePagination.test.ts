import { DOTS, getPaginationRange } from './usePagination'

describe('getPaginationRange', () => {
  it('lists every page when there are few', () => {
    expect(getPaginationRange({ totalCount: 57, pageSize: 10, currentPage: 1 })).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('shows dots on the right near the start', () => {
    expect(getPaginationRange({ totalCount: 200, pageSize: 10, currentPage: 2 })).toEqual([1, 2, 3, 4, 5, DOTS, 20])
  })

  it('shows dots on both sides in the middle', () => {
    expect(getPaginationRange({ totalCount: 200, pageSize: 10, currentPage: 10 })).toEqual([
      1,
      DOTS,
      9,
      10,
      11,
      DOTS,
      20,
    ])
  })

  it('shows dots on the left near the end', () => {
    expect(getPaginationRange({ totalCount: 200, pageSize: 10, currentPage: 19 })).toEqual([
      1,
      DOTS,
      16,
      17,
      18,
      19,
      20,
    ])
  })

  it('always returns at least one page', () => {
    expect(getPaginationRange({ totalCount: 0, pageSize: 10, currentPage: 1 })).toEqual([1])
    expect(getPaginationRange({ totalCount: 5, pageSize: 0, currentPage: 1 })).toEqual([1, 2, 3, 4, 5])
  })
})
