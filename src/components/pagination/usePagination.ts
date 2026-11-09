import { useMemo } from 'react'

export const DOTS = '...'
export type PaginationItem = number | typeof DOTS

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

interface PaginationOptions {
  /** Total number of rows (not pages). */
  totalCount: number
  pageSize: number
  currentPage: number
  /** Pages shown on each side of the current page. */
  siblingCount?: number
}

/**
 * Page buttons to render, e.g. `[1, '...', 4, 5, 6, '...', 20]`.
 * Always returns an array; v7 could return `undefined`.
 */
export function getPaginationRange({ totalCount, pageSize, currentPage, siblingCount = 1 }: PaginationOptions) {
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)))
  // first + last + current + 2 * siblings + 2 * dots
  const maxButtons = siblingCount * 2 + 5
  if (totalPages <= maxButtons) return range(1, totalPages) as PaginationItem[]

  const left = Math.max(currentPage - siblingCount, 1)
  const right = Math.min(currentPage + siblingCount, totalPages)
  const showLeftDots = left > 2
  const showRightDots = right < totalPages - 2
  const edgeCount = 3 + 2 * siblingCount

  if (!showLeftDots) return [...range(1, edgeCount), DOTS, totalPages] as PaginationItem[]
  if (!showRightDots) return [1, DOTS, ...range(totalPages - edgeCount + 1, totalPages)] as PaginationItem[]
  return [1, DOTS, ...range(left, right), DOTS, totalPages] as PaginationItem[]
}

export const usePagination = ({
  totalCount,
  pageSizeStructure,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number
  pageSizeStructure: number
  siblingCount?: number
  currentPage: number
}) =>
  useMemo(
    () => getPaginationRange({ totalCount, pageSize: pageSizeStructure, currentPage, siblingCount }),
    [totalCount, pageSizeStructure, siblingCount, currentPage],
  )
