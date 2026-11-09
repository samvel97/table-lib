import { memo, useState } from 'react'
import type { IPageSizes, ISelected } from '../../Models/table.models'
import Pagination from '../../components/pagination'
import Select from '../../components/select/select'
import DropdownSvgIcon from '../../svgIcons/DropdownSvgIcon'
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
  const [isOpenList, setIsOpenList] = useState(false)
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
  // Look sizes up by id; v7 used `pageSizeStructure[id - 1]`, which assumed ids 1..n in order.
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
    // v7 printed "undefined" here when no translations were passed.
    const of = translations?.pagination?.from ?? 'from'
    return `${first}-${last} ${of} ${pagesTotalCount}`
  })()

  return (
    <>
      <div className='G-count-info' aria-live='polite'>
        {rangeText}
      </div>
      {pageSizeStructure && pageSize ? (
        <div className='G-justify-between G-align-center'>
          <div className='G-select-text'>{translations?.pagination?.show || 'Show'}</div>
          <Select
            optionsList={pageSizeStructure}
            value={pageSize.id}
            selectedNameKey='count'
            selectedValueKey='id'
            onChange={changePageSize}
            isOpenList={isOpenList}
            setIsOpenList={() => setIsOpenList((open) => !open)}
            customClass='G-Select-container'
            ButtonSvg={DropdownSvgIcon}
          />
          <div className='G-select-text'>{translations?.pagination?.rows || 'Rows'}</div>
          <Pagination
            onPageChange={changePage}
            totalCount={pagesTotalCount}
            currentPage={currentPage}
            translations={translations}
            pageSizeStructure={pageSize.count}
            className='G-pagionation'
          />
        </div>
      ) : null}
    </>
  )
}

export default memo(FooterPagination)
