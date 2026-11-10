import { memo, useId, useState } from 'react'
import type { IPageSizes, ISelected } from '../../Models/table.models'
import Pagination from '../../components/pagination'
import './index.scss'

interface IFooterPagination {
  pageSizeStructure?: IPageSizes[]
  /** Total number of rows (named `pagesTotalCount` on the Table for backwards compatibility). */
  pagesTotalCount?: number
  currPage?: number
  selectedPageSizeId?: ISelected
  translations?: Record<string, any>
  getPageRowsCountAndCurrentPage?(pageNumber: number, rowsCount: IPageSizes): void
}

/** "1-10 of 57", page-size select and page buttons. */
const FooterPagination = ({
  pageSizeStructure,
  pagesTotalCount = 0,
  currPage = 1,
  selectedPageSizeId = { id: 1 },
  translations,
  getPageRowsCountAndCurrentPage,
}: IFooterPagination) => {
  const pageSizeId = useId()
  // The page and page size are controlled by the parent; local state only covers the moment between
  // a click and the parent re-rendering with the new value.
  const [pendingPage, setPendingPage] = useState<number | null>(null)
  const [pendingSizeId, setPendingSizeId] = useState<number | null>(null)
  const [lastProps, setLastProps] = useState({ currPage, sizeId: selectedPageSizeId.id })
  if (lastProps.currPage !== currPage || lastProps.sizeId !== selectedPageSizeId.id) {
    setLastProps({ currPage, sizeId: selectedPageSizeId.id })
    setPendingPage(null)
    setPendingSizeId(null)
  }

  const currentPage = pendingPage ?? currPage
  const sizeId = pendingSizeId ?? selectedPageSizeId.id
  const pageSize = pageSizeStructure?.find((size) => size.id === sizeId) ?? pageSizeStructure?.[0]

  const changePageSize = (size: IPageSizes) => {
    setPendingSizeId(size.id)
    setPendingPage(1)
    getPageRowsCountAndCurrentPage?.(1, size)
  }

  const changePage = (page: number) => {
    setPendingPage(page)
    if (pageSize) getPageRowsCountAndCurrentPage?.(page, pageSize)
  }

  const rangeText = (() => {
    if (!pageSize) return null
    const first = (currentPage - 1) * pageSize.count + 1
    const last = Math.min(currentPage * pageSize.count, pagesTotalCount)
    const of = translations?.pagination?.from ?? 'from'
    return `${first}-${last} ${of} ${pagesTotalCount}`
  })()

  return (
    <div className='brt-footer'>
      <div className='brt-footer__range' aria-live='polite'>
        {rangeText}
      </div>
      {pageSizeStructure && pageSize ? (
        <>
          <label className='brt-footer__page-size' htmlFor={pageSizeId}>
            {translations?.pagination?.show || 'Show'}
            <select
              id={pageSizeId}
              className='brt-select brt-select--compact'
              value={pageSize.id}
              onChange={(event) => {
                const size = pageSizeStructure.find((option) => String(option.id) === event.target.value)
                if (size) changePageSize(size)
              }}
            >
              {pageSizeStructure.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.count}
                </option>
              ))}
            </select>
            {translations?.pagination?.rows || 'Rows'}
          </label>
          <Pagination
            onPageChange={changePage}
            totalCount={pagesTotalCount}
            currentPage={currentPage}
            translations={translations}
            pageSizeStructure={pageSize.count}
          />
        </>
      ) : null}
    </div>
  )
}

export default memo(FooterPagination)
