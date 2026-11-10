import { memo, useCallback } from 'react'
import { type IProps } from '../Models/table.models'
import Footer from './Layout/Footer'
import Header from './Layout/Header'
import Rows from './Layout/Rows'
import MainFooter from './MainFooter'
import MainHeader from './MainHeader'
import '../styles/index.scss'
import './index.scss'
import useTable from './useTable'
import { TableLayoutContext, useTableLayoutState } from './layoutContext'

/** Resolve the `virtualized` prop into concrete options, or null when off. */
const resolveVirtualization = (virtualized: IProps<object>['virtualized']) =>
  virtualized
    ? {
        overscan: (typeof virtualized === 'object' && virtualized.overscan) || 10,
        estimateRowHeight: (typeof virtualized === 'object' && virtualized.estimateRowHeight) || 32,
      }
    : null
function Table<T extends object>({
  data = [],
  virtualized,
  pageSizeStructure,
  pagesTotalCount,
  currentPage,
  multipleCheck,
  isStickyFirstColumn,
  columnMinWidth,
  columnsConfigStructure = {} as any,
  columnsHeaderStructure = {} as any,
  rightFreezeConfig,
  rowActions,
  FreezeIcon,
  isHoveredRow,
  links,
  headerColor,
  footerColor,
  freezedLeftSideColor,
  freezedRightSideColor,
  draggableColumns,
  freezedRightSideVisible,
  freezedRightSide,
  RightSideIcon,
  footerHeight,
  leftFreezedColumnWidth,
  rightFreezedColumnWidth,
  headerHeight,
  filterDataForRequest,
  filterColumns,
  filtersTypes,
  rowsFreezeAction,
  EmptyDataContainer,
  perColumnTotalCount,
  selectedPageSizeId,
  hasFilters,
  isEnableAggregates,
  aggregates,
  isLoadedData,
  translations,
  hasOrdering,
  handleChangePagePerFilterField,
  getRow,
  RightSideSelfAction,
  setColumnsConfigStructure,
  setColumnHeaderStructure,
  handleEdit,
  handleDelete,
  getPageRowsCountAndCurrentPage,
  storeStructure,
  getFilteredData,
  getFilteredDataWithDebounce,
  getFilteredDataForTable,
  getDownloadType,
  customHeaderAction,
  handleSorting,
  handleArgChange,
  staticAction,
}: IProps<T>) {
  const {
    freezedRows,
    unFreezedRows,
    checkedRows,
    checkedLink,
    selectedType,
    scrollRef,
    freezeRow,
    unFreezeRow,
    dragDropFreezeRow,
    getRowForDropdown,
    handleCheckAll,
    handleCheck,
    isCheckedRows,
    unCheck,
    checkAllDataFromDb,
    handleActionKey,
  } = useTable(data, freezedRightSide, RightSideSelfAction)
  const { scrollElement, setScrollElement, hasHorizontalScroll } = useTableLayoutState()
  // One ref callback feeds both the row-state hook (scroll reset) and the layout state (virtualization).
  const setScrollContainer = useCallback(
    (element: HTMLDivElement | null) => {
      scrollRef.current = element
      setScrollElement(element)
    },
    [scrollRef, setScrollElement],
  )
  const virtualization = resolveVirtualization(virtualized)

  return (
    <TableLayoutContext.Provider value={{ scrollElement, hasHorizontalScroll }}>
      <div id='table-wrapper' className='brt-root'>
        {!isLoadedData && !data.length ? <div className='empty-container'>{EmptyDataContainer}</div> : null}
        {multipleCheck || draggableColumns || hasFilters || getDownloadType ? (
          <MainHeader
            columnsConfigStructure={columnsConfigStructure}
            columnsHeaderStructure={columnsHeaderStructure}
            multipleCheck={multipleCheck}
            data={data}
            checkedRows={checkedRows}
            draggableColumns={draggableColumns}
            filterColumns={filterColumns}
            filterDataForRequest={filterDataForRequest}
            filtersTypes={filtersTypes}
            selectedType={selectedType}
            perColumnTotalCount={perColumnTotalCount}
            hasFilters={hasFilters}
            translations={translations}
            handleCheckAll={handleCheckAll}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            setColumnsConfigStructure={setColumnsConfigStructure}
            setColumnHeaderStructure={setColumnHeaderStructure}
            storeStructure={storeStructure}
            unCheck={unCheck}
            checkAllDataFromDb={checkAllDataFromDb}
            getFilteredData={getFilteredData}
            getFilteredDataWithDebounce={getFilteredDataWithDebounce}
            getFilteredDataForTable={getFilteredDataForTable}
            handleChangePagePerFilterField={handleChangePagePerFilterField}
            getDownloadType={getDownloadType}
            customHeaderAction={customHeaderAction}
            staticAction={staticAction}
          />
        ) : null}

        <div
          ref={setScrollContainer}
          className={`G-data-table G-data-scroll ${!isLoadedData && !data.length ? 'G-empty-data-wrapper' : ''}`}
        >
          <>
            <div
              className='G-header'
              style={{
                minHeight: headerHeight ? `${headerHeight}px` : 48,
                width: hasHorizontalScroll ? 'max-content' : 'auto',
              }}
            >
              <Header
                columnsConfigStructure={columnsConfigStructure}
                columnsHeaderStructure={columnsHeaderStructure}
                rightFreezeConfig={rightFreezeConfig}
                headerColor={headerColor}
                multipleCheck={multipleCheck}
                isStickyFirstColumn={isStickyFirstColumn}
                columnMinWidth={columnMinWidth}
                freezedRightSideVisible={freezedRightSideVisible}
                leftFreezedColumnWidth={leftFreezedColumnWidth}
                rightFreezedColumnWidth={rightFreezedColumnWidth}
                hasOrdering={hasOrdering}
                handleSorting={(option) => {
                  handleActionKey('sort')
                  handleSorting?.(option)
                }}
              />
            </div>
            <div className='G-data-table-body'>
              <Rows
                freezedRows={freezedRows}
                rightFreezeConfig={rightFreezeConfig}
                columnsConfigStructure={columnsConfigStructure}
                multipleCheck={multipleCheck}
                columnMinWidth={columnMinWidth}
                rowActions={rowActions}
                FreezeIcon={FreezeIcon}
                links={links}
                checkedLink={checkedLink}
                unFreezedRows={unFreezedRows}
                isHoveredRow={isHoveredRow}
                freezedLeftSideColor={freezedLeftSideColor}
                freezedRightSideColor={freezedRightSideColor}
                freezedRightSideVisible={freezedRightSideVisible}
                freezedRightSide={freezedRightSide}
                isStickyFirstColumn={isStickyFirstColumn}
                RightSideIcon={RightSideIcon}
                leftFreezedColumnWidth={leftFreezedColumnWidth}
                rightFreezedColumnWidth={rightFreezedColumnWidth}
                headerHeight={headerHeight}
                rowsFreezeAction={rowsFreezeAction}
                selectedType={selectedType}
                hasOrdering={hasOrdering}
                isLoadedData={isLoadedData}
                getRow={getRow}
                freezeRow={freezeRow}
                getRowForDropdown={getRowForDropdown}
                isCheckedRows={isCheckedRows}
                handleCheck={handleCheck}
                dragDropFreezeRow={dragDropFreezeRow}
                unFreezeRow={unFreezeRow}
                virtualization={virtualization}
              />
            </div>

            {isEnableAggregates ? (
              <div
                className='G-total-footer'
                style={{
                  minHeight: footerHeight ? `${footerHeight}px` : 48,
                  width: hasHorizontalScroll ? 'max-content' : 'auto',
                }}
              >
                <Footer
                  rightFreezeConfig={rightFreezeConfig}
                  columnsHeaderStructure={columnsHeaderStructure}
                  columnsConfigStructure={columnsConfigStructure}
                  columnMinWidth={columnMinWidth}
                  footerColor={footerColor}
                  freezedRightSideVisible={freezedRightSideVisible}
                  isStickyFirstColumn={isStickyFirstColumn}
                  leftFreezedColumnWidth={leftFreezedColumnWidth}
                  rightFreezedColumnWidth={rightFreezedColumnWidth}
                  aggregates={aggregates}
                  isLoadedData={isLoadedData}
                  hasOrdering={hasOrdering}
                  multipleCheck={multipleCheck}
                  handleArgChange={handleArgChange}
                />
              </div>
            ) : null}
          </>
        </div>
        {data.length && currentPage && pagesTotalCount && selectedPageSizeId ? (
          <MainFooter
            translations={translations}
            pageSizeStructure={pageSizeStructure}
            currPage={currentPage}
            pagesTotalCount={pagesTotalCount}
            selectedPageSizeId={selectedPageSizeId}
            getPageRowsCountAndCurrentPage={getPageRowsCountAndCurrentPage}
          />
        ) : null}
      </div>
    </TableLayoutContext.Provider>
  )
}

// memo() erases generics; the cast keeps <Table<Row>> typed for consumers.
export default memo(Table) as typeof Table
