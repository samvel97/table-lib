import { useState, type ChangeEvent, type KeyboardEvent } from 'react'
import ArrowLeftSvgIcon from '../../svgIcons/ArrowLeftSvgIcon'
import ArrowRightSvgIcon from '../../svgIcons/ArrowRightSvgIcon'
import { DOTS, usePagination } from './usePagination'
import './style.scss'

interface IPagination {
  onPageChange(page: number): void
  /** Total number of rows. */
  totalCount: number
  siblingCount?: number
  currentPage: number
  /** Rows per page. */
  pageSizeStructure: number
  className?: string
  translations?: Record<string, any>
}

/** Page buttons plus a "go to page" input. Hidden when everything fits on one page. */
const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSizeStructure,
  className = '',
  translations,
}: IPagination) => {
  const pages = usePagination({ currentPage, totalCount, siblingCount, pageSizeStructure })
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSizeStructure)))
  const [goTo, setGoTo] = useState('')
  // Clear the "go to" field whenever the page or page size changes (state reset during render, no effect needed).
  const resetKey = `${currentPage}-${pageSizeStructure}-${totalCount}`
  const [lastResetKey, setLastResetKey] = useState(resetKey)
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey)
    setGoTo('')
  }

  if (currentPage === 0 || pages.length === 1) return null

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) onPageChange(page)
  }

  const handleGoToChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value === '' || (/^\d+$/.test(value) && +value <= totalPages)) setGoTo(value)
  }

  const handleGoToKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && goTo && goTo !== '0') goToPage(+goTo)
  }

  const goToLabel = translations?.pagination?.to || 'Go to'

  return (
    <nav className='G-flex G-align-center' aria-label='Pagination'>
      <ul className={`pagination-container ${className} G-flex G-align-center G-justify-between`}>
        <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            type='button'
            className='pagination-button'
            aria-label='Previous page'
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ArrowLeftSvgIcon />
          </button>
        </li>
        {pages.map((page, index) =>
          page === DOTS ? (
            <li key={`dots-${index}`} className='pagination-item dots' aria-hidden='true'>
              &#8230;
            </li>
          ) : (
            <li key={page} className={`pagination-item ${page === currentPage ? 'selected' : ''}`}>
              <button
                type='button'
                className='pagination-button'
                aria-current={page === currentPage ? 'page' : undefined}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            </li>
          ),
        )}
        <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            type='button'
            className='pagination-button'
            aria-label='Next page'
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <ArrowRightSvgIcon />
          </button>
        </li>
      </ul>
      <label className='G-align-center pagination-goto'>
        <span>{goToLabel}</span>
        <input
          inputMode='numeric'
          aria-label={`${goToLabel} page`}
          value={goTo}
          onChange={handleGoToChange}
          onKeyDown={handleGoToKeyDown}
          style={{ width: `${24 + (goTo.length > 3 ? goTo.length * 3 : 0)}px` }}
        />
      </label>
    </nav>
  )
}

export default Pagination
