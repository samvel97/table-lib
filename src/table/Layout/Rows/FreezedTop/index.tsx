import type { TableIcon } from '../../../../Models/table.models'
import { type RowId } from '../../../../utils/rowId'
import React, { useEffect, useRef, useState } from 'react'
import {
  type IColumnConfig,
  type IColumnConfigStructure,
  type ILinksList,
  type IrowActions,
} from '../../../../Models/table.models'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import Checkbox from '../../../../components/checkbox'
import FreezedRightColumns from '../FreezedRigthColumns'
import FreezedLeftColumns from '../FreezedLeftColumns'
import { CheckedItems, StructureConfig } from '../../../../Models/table.enum'
import FreezeRowSvgIcon from '../../../../svgIcons/FrameSvgIcon'
import EditSvgIcon from '../../../../svgIcons/EditSvgIcon'
import DeleteSvgIcon from '../../../../svgIcons/DeleteSvgIcon'
import { hasScroll } from '../../../../utils'
interface IFreezedRows<T extends object> {
  freezedRows: T[]
  columnsConfigStructure: IColumnConfigStructure<T>
  rightFreezeConfig?: IColumnConfig<T>[]
  multipleCheck?: boolean
  columnMinWidth?: number
  rowActions?: IrowActions[]
  FreezeIcon?: TableIcon
  links?: ILinksList[]
  checkedLink?: T
  freezedLeftSideColor?: string
  freezedRightSideColor?: string
  freezedRightSide?: string
  freezedRightSideVisible?: boolean
  isStickyFirstColumn?: boolean
  RightSideIcon?: TableIcon
  leftFreezedColumnWidth?: number
  rightFreezedColumnWidth?: number
  headerHeight?: number
  selectedType: string
  hasOrdering?: boolean
  isLoadedData?: boolean
  getRow?(options: any): any
  RightSideSelfAction?: (option: number | string) => void
  getRowForDropdown(id: RowId): void
  dragDropFreezeRow(option: T[]): void
  unFreezeRow(e: any, option: number): void
  isCheckedRows(id: RowId): boolean
  handleCheck(id: RowId): void
}
const FreezedRows = <T extends object>({
  freezedRows,
  columnsConfigStructure,
  rightFreezeConfig,
  multipleCheck,
  columnMinWidth,
  rowActions,
  FreezeIcon,
  links,
  checkedLink,
  freezedLeftSideColor,
  freezedRightSideColor,
  freezedRightSide,
  freezedRightSideVisible,
  isStickyFirstColumn,
  RightSideIcon,
  leftFreezedColumnWidth,
  rightFreezedColumnWidth,
  headerHeight,
  selectedType,
  isLoadedData,
  getRow,
  RightSideSelfAction,
  getRowForDropdown,
  dragDropFreezeRow,
  unFreezeRow,
  isCheckedRows,
  handleCheck,
}: IFreezedRows<T>) => {
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(freezedRows)
    const [reOrderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reOrderedItem)

    dragDropFreezeRow(items)
  }
  const [width, setWidth] = useState<number>(0)
  function pickBackGroundColor(option: number) {
    if (option % 2 == 0) {
      return 'G-dark-background'
    }
    return 'G-light-background'
  }
  const myRef = useRef<any>(null)
  useEffect(() => {
    if (myRef?.current) {
      setWidth(myRef?.current.offsetWidth)
    }
  }, [])
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='characters'>
        {(provided) => (
          <div
            className='G-FreezedRow'
            style={{ top: headerHeight ? `${headerHeight}px` : 48 }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {freezedRows.map((item: any, index) => {
              return (
                <Draggable
                  key={item.id}
                  draggableId={typeof item.id === 'string' ? item.id : '' + item.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      onClick={() => getRow && getRow(item)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div style={{ display: 'flex', width: hasScroll() ? 'max-content' : 'auto' }} className='G-row'>
                        {/* HOVERED ROWS */}
                        <ul
                          className='G-rows-icons'
                          style={{
                            left: `calc(100% - ${(width || 60) + 50}px)`,
                          }}
                        >
                          <li className='G-rows-icons' style={{ left: !isStickyFirstColumn ? '50%' : '' }}>
                            <div className='G-icons-group'>
                              {rowActions && rowActions.length
                                ? rowActions.map((elem, index) => {
                                    if (index < 3)
                                      return (
                                        <div
                                          key={index}
                                          onClick={(e) => elem.action(e, item, index)}
                                          style={{ cursor: 'pointer' }}
                                          className={index === 0 ? 'G-first-action' : 'G-action-nth'}
                                        >
                                          {elem.icon ? (
                                            <elem.icon />
                                          ) : index === 0 ? (
                                            <EditSvgIcon />
                                          ) : (
                                            <DeleteSvgIcon />
                                          )}
                                        </div>
                                      )
                                  })
                                : null}
                              <div onClick={(e) => unFreezeRow && unFreezeRow(e, index)} className='G-freeze-Icon'>
                                {!FreezeIcon ? <FreezeRowSvgIcon /> : <FreezeIcon />}
                              </div>
                            </div>
                          </li>
                        </ul>
                        {/* FREEZED LEFT */}

                        <ul style={{ position: 'sticky', left: 0, zIndex: 45 }} className={pickBackGroundColor(index)}>
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
                                isCheck={isCheckedRows(item.id)}
                                onClick={() => handleCheck(item.id)}
                                customClass='G-checkbox'
                              />
                            </li>
                          ) : null}
                          <FreezedLeftColumns
                            columnsConfigStructure={columnsConfigStructure}
                            columnMinWidth={columnMinWidth}
                            item={item}
                            freezedLeftSideColor={freezedLeftSideColor}
                            isLoadedData={isLoadedData}
                          />
                        </ul>
                        {/* MAIN */}
                        <ul style={{ flex: 1 }} className={pickBackGroundColor(index)}>
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
                                isCheck={isCheckedRows(item.id)}
                                onClick={() => handleCheck(item.id)}
                                customClass='G-checkbox'
                              />
                            </li>
                          ) : null}
                          {columnsConfigStructure[StructureConfig.Main].items.map((column) => {
                            return (
                              column.isVisible && (
                                <li
                                  style={{
                                    ...column.customStyle,
                                    // Same sizing as regular rows and the header, so frozen rows stay aligned.
                                    maxWidth: (column.width || columnMinWidth) + 'px',
                                  }}
                                  key={column.id}
                                >
                                  {column.setRow(item, isLoadedData)}
                                </li>
                              )
                            )
                          })}
                        </ul>
                        {/* FREEZED RIGHT */}
                        {freezedRightSideVisible ? (
                          <ul
                            ref={myRef}
                            className={pickBackGroundColor(index)}
                            style={{
                              position: 'sticky',
                              zIndex: 12,
                              right: 0,
                              boxShadow: '7px 0px 9px -1px rgba(0,0,0,0.08)',
                            }}
                          >
                            {rightFreezeConfig ? (
                              rightFreezeConfig.map((elem, i) => {
                                if (i < 4)
                                  return (
                                    <li
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        maxWidth: rightFreezedColumnWidth
                                          ? `${rightFreezedColumnWidth}px`
                                          : `${elem.width}px`,
                                        minWidth: rightFreezedColumnWidth
                                          ? `${rightFreezedColumnWidth}px`
                                          : `${elem.width}px`,
                                        backgroundColor: freezedRightSideColor && freezedRightSideColor,
                                      }}
                                    >
                                      {elem.setRow(item)}
                                      {/* <FreezedRightColumns
                                item={item}
                                checkedLink={checkedLink}
                                links={links}
                                freezedRightSide={freezedRightSide}
                                RightSideIcon={RightSideIcon}
                                RightSideSelfAction={RightSideSelfAction}
                                getRowForDropdown={getRowForDropdown}
                              /> */}
                                    </li>
                                  )
                              })
                            ) : (
                              <li
                                style={{
                                  maxWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `60px`,
                                  minWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `60px`,
                                  backgroundColor: freezedRightSideColor && freezedRightSideColor,
                                }}
                              >
                                {/* {elem.setRow(item)} */}
                                <FreezedRightColumns
                                  item={item}
                                  checkedLink={checkedLink}
                                  links={links}
                                  freezedRightSide={freezedRightSide}
                                  RightSideIcon={RightSideIcon}
                                  RightSideSelfAction={RightSideSelfAction}
                                  getRowForDropdown={getRowForDropdown}
                                />
                              </li>
                            )}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default FreezedRows
