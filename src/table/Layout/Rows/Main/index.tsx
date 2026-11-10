import type { TableIcon } from '../../../../Models/table.models'
import { type RowId } from '../../../../utils/rowId'
import { Fragment, forwardRef, memo, useEffect, useRef, useState, type ForwardedRef } from 'react'
import {
  type IColumnConfig,
  type IColumnConfigStructure,
  type ILinksList,
  type IrowActions,
} from '../../../../Models/table.models'

import FreezedRightColumns from '../FreezedRigthColumns'
import Checkbox from '../../../../components/checkbox'
import FreezedLeftColumns from '../FreezedLeftColumns'
import { CheckedItems, StructureConfig } from '../../../../Models/table.enum'
import HoveredRow from '../HoveredRow'
import { useTableLayout } from '../../../layoutContext'
import { VirtualRows } from '../VirtualRows'
import type { VirtualizationOptions } from '../../../../Models/table.models'
interface IMainRows<T extends object> {
  unFreezedRows: T[]
  freezedRows: T[]
  rightFreezeConfig?: IColumnConfig<T>[]
  columnsConfigStructure: IColumnConfigStructure<T>
  multipleCheck?: boolean
  columnMinWidth?: number
  rowActions?: IrowActions[]
  FreezeIcon?: TableIcon
  isStickyFirstColumn?: boolean
  tableWidth?: number
  links?: ILinksList[]
  checkedLink?: T
  isHoveredRow?: boolean
  freezedLeftSideColor?: string
  freezedRightSideColor?: string
  freezedRightSide?: string
  freezedRightSideVisible?: boolean
  RightSideIcon?: TableIcon
  leftFreezedColumnWidth?: number
  rightFreezedColumnWidth?: number
  rowsFreezeAction?: boolean
  selectedType: string
  hasOrdering?: boolean
  isLoadedData?: boolean
  getRow?(options: any): void
  freezeRow(e: any, option: number): void
  getRowForDropdown(id: RowId): void
  isCheckedRows(id: RowId): boolean
  /** Render only visible rows (see the `virtualized` table prop). */
  virtualization?: Required<VirtualizationOptions> | null
  handleCheck(id: RowId): void
}
/** Everything a row needs besides its own data. Rebuilt only when the table re-renders, not on scroll. */
interface RowContext {
  freezedRows: any
  columnsConfigStructure: any
  rightFreezeConfig: any
  multipleCheck: any
  columnMinWidth: any
  rowActions: any
  FreezeIcon: any
  links: any
  checkedLink: any
  isHoveredRow: any
  freezedLeftSideColor: any
  freezedRightSideColor: any
  freezedRightSide: any
  freezedRightSideVisible: any
  isStickyFirstColumn: any
  RightSideIcon: any
  leftFreezedColumnWidth: any
  rightFreezedColumnWidth: any
  rowsFreezeAction: any
  selectedType: any
  isLoadedData: any
  getRow: any
  freezeRow: any
  getRowForDropdown: any
  isCheckedRows: any
  handleCheck: any
  hasHorizontalScroll: any
  myRef: any
  width: any
  forwardedRef: ForwardedRef<any>
}

const pickBackGroundColor = (index: number) => (index % 2 === 0 ? 'G-dark-background' : 'G-light-background')

/**
 * One table row. Memoized: while scrolling a virtualized table, rows that stay on screen are skipped and
 * only newly visible rows render (each row renders checkboxes, hover actions and sticky columns).
 */
const MainRow = memo(function MainRow({
  item,
  index,
  measureRef,
  ctx,
}: {
  item: any
  index: number
  measureRef?: (element: HTMLElement | null) => void
  ctx: RowContext
}) {
  const {
    freezedRows,
    columnsConfigStructure,
    rightFreezeConfig,
    multipleCheck,
    columnMinWidth,
    rowActions,
    FreezeIcon,
    links,
    checkedLink,
    isHoveredRow,
    freezedLeftSideColor,
    freezedRightSideColor,
    freezedRightSide,
    freezedRightSideVisible,
    isStickyFirstColumn,
    RightSideIcon,
    leftFreezedColumnWidth,
    rightFreezedColumnWidth,
    rowsFreezeAction,
    selectedType,
    isLoadedData,
    getRow,
    freezeRow,
    getRowForDropdown,
    isCheckedRows,
    handleCheck,
    hasHorizontalScroll,
    myRef,
    width,
    forwardedRef: ref,
  } = ctx
  return (
    <div
      ref={measureRef}
      data-index={measureRef ? index : undefined}
      className='G-flex G-row'
      style={{ width: hasHorizontalScroll ? 'max-content' : 'auto' }}
      onClick={() => getRow?.(item)}
    >
      <ul
        className='G-rows-icons'
        style={{
          left: `calc(100% - ${(width || 60) + 50}px)`,
        }}
      >
        {isHoveredRow ? (
          <HoveredRow
            rowActions={rowActions}
            item={item}
            index={index}
            freezedRows={freezedRows}
            FreezeIcon={FreezeIcon}
            rowsFreezeAction={rowsFreezeAction}
            freezeRow={freezeRow}
          />
        ) : null}
      </ul>
      <ul
        className={pickBackGroundColor(index)}
        style={{
          position: 'sticky',
          left: 0,
          zIndex: 20,
          boxShadow: '10px 1px 9px -2px  rgba(0,0,0,0.02)',
        }}
      >
        {isStickyFirstColumn && multipleCheck ? (
          <li
            style={{
              maxWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : '60px',
              minWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : '60px',
              backgroundColor: freezedLeftSideColor && freezedLeftSideColor,
            }}
          >
            <Checkbox
              isDisable={selectedType === CheckedItems.SELECTED_ALL}
              isCheck={selectedType === CheckedItems.SELECTED_ALL || isCheckedRows(item.id)}
              onClick={() => handleCheck(item.id)}
              customClass='G-checkbox'
            />
          </li>
        ) : null}
        {columnsConfigStructure[StructureConfig.Freezed].items.length ? (
          <FreezedLeftColumns
            ref={ref}
            columnsConfigStructure={columnsConfigStructure}
            columnMinWidth={columnMinWidth}
            item={item}
            freezedLeftSideColor={freezedLeftSideColor}
            isLoadedData={isLoadedData}
          />
        ) : null}
      </ul>
      <ul
        style={{
          flex: 1,
          cursor: 'pointer',
        }}
        className={pickBackGroundColor(index)}
      >
        {!isStickyFirstColumn && multipleCheck ? (
          <li
            style={{
              maxWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : '60px',
              minWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : '60px',
              backgroundColor: freezedLeftSideColor && freezedLeftSideColor,
            }}
          >
            <Checkbox
              isDisable={selectedType === CheckedItems.SELECTED_ALL}
              isCheck={selectedType === CheckedItems.SELECTED_ALL || isCheckedRows(item.id)}
              onClick={() => handleCheck(item.id)}
              customClass='G-checkbox'
            />
          </li>
        ) : null}

        {/* Columns */}
        {columnsConfigStructure[StructureConfig.Main].items.map((column: IColumnConfig<any>) => {
          return (
            <Fragment key={column.id}>
              {column.isVisible ? (
                <li
                  style={{
                    ...column.customStyle,
                    maxWidth: (column.width || columnMinWidth) + 'px',
                  }}
                >
                  {column.setRow(item, isLoadedData)}
                </li>
              ) : null}
            </Fragment>
          )
        })}
      </ul>
      {freezedRightSideVisible ? (
        <ul
          ref={myRef}
          style={{
            position: 'sticky',
            zIndex: 12,
            right: 0,
            boxShadow: '-6px 0px 8px 0px rgba(0,0,0,0.02)',
          }}
          className={pickBackGroundColor(index)}
        >
          {rightFreezeConfig ? (
            rightFreezeConfig.map((elem: IColumnConfig<any>, i: number) => {
              if (i < 4) {
                return (
                  <li
                    key={elem.id}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      maxWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `${elem.width}px`,
                      minWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `${elem.width}px`,
                      backgroundColor: freezedRightSideColor && freezedRightSideColor,
                    }}
                  >
                    {elem.setRow(item)}
                  </li>
                )
              }
            })
          ) : (
            <li
              style={{
                maxWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `60px`,
                minWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `60px`,
                backgroundColor: freezedRightSideColor && freezedRightSideColor,
              }}
            >
              <FreezedRightColumns
                item={item}
                checkedLink={checkedLink}
                links={links}
                freezedRightSide={freezedRightSide}
                RightSideIcon={RightSideIcon}
                getRowForDropdown={getRowForDropdown}
              />
            </li>
          )}
        </ul>
      ) : null}
    </div>
  )
})

const MainRows = forwardRef<any, IMainRows<any>>(
  (
    {
      unFreezedRows,
      freezedRows,
      columnsConfigStructure,
      rightFreezeConfig,
      multipleCheck,
      columnMinWidth,
      rowActions,
      FreezeIcon,
      links,
      checkedLink,
      isHoveredRow,
      freezedLeftSideColor,
      freezedRightSideColor,
      freezedRightSide,
      freezedRightSideVisible,
      isStickyFirstColumn,
      RightSideIcon,
      leftFreezedColumnWidth,
      rightFreezedColumnWidth,
      rowsFreezeAction,
      selectedType,
      isLoadedData,
      getRow,
      freezeRow,
      getRowForDropdown,
      isCheckedRows,
      handleCheck,
      virtualization,
    },
    ref,
  ) => {
    const { hasHorizontalScroll } = useTableLayout()
    const myRef = useRef<any>(null)
    const [width, setWidth] = useState<number>(0)

    useEffect(() => {
      if (myRef?.current) {
        setWidth(myRef?.current.offsetWidth)
      }
    }, [])
    const rows = unFreezedRows.length
      ? unFreezedRows
      : Array.from(
          Array.from({ length: isLoadedData ? 10 : 0 }, (_, index) => ({
            id: index + 1,
          })),
        )

    const ctx: RowContext = {
      freezedRows,
      columnsConfigStructure,
      rightFreezeConfig,
      multipleCheck,
      columnMinWidth,
      rowActions,
      FreezeIcon,
      links,
      checkedLink,
      isHoveredRow,
      freezedLeftSideColor,
      freezedRightSideColor,
      freezedRightSide,
      freezedRightSideVisible,
      isStickyFirstColumn,
      RightSideIcon,
      leftFreezedColumnWidth,
      rightFreezedColumnWidth,
      rowsFreezeAction,
      selectedType,
      isLoadedData,
      getRow,
      freezeRow,
      getRowForDropdown,
      isCheckedRows,
      handleCheck,
      hasHorizontalScroll,
      myRef,
      width,
      forwardedRef: ref,
    }
    const renderRow = (item: any, index: number, measureRef?: (element: HTMLElement | null) => void) => (
      <MainRow key={item.id} item={item} index={index} measureRef={measureRef} ctx={ctx} />
    )

    // Real row index is passed through, so freezing, row actions and striping act on the right row.
    return virtualization ? (
      <VirtualRows
        count={rows.length}
        estimateRowHeight={virtualization.estimateRowHeight}
        overscan={virtualization.overscan}
        renderRow={(index, measureRef) => renderRow(rows[index], index, measureRef)}
      />
    ) : (
      <>{rows.map((item: any, index: number) => renderRow(item, index))}</>
    )
  },
)

export default MainRows
