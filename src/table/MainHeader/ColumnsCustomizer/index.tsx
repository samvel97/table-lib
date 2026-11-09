import { memo, useMemo, useState, type MouseEvent, type ReactElement } from 'react'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Button } from '../../../ui/Button'
import { StructureConfig } from '../../../Models/table.enum'
import type { IColumnConfig, IColumnConfigStructure, IColumnHeaderStructure } from '../../../Models/table.models'
import Checkbox from '../../../components/checkbox'
import PopUp from '../../../components/popUp'
import ColumnsSvgIcon from '../../../svgIcons/ColumnsSvgIcon'
import GroupSvgIcons from '../../../svgIcons/GroupSvgIcon'
import { MAX_PINNED_COLUMNS, moveColumn, toColumnMove, type ColumnList } from './moveColumn'
import './style.scss'

interface IColumnsCustomizer<T extends object> {
  translations?: Record<string, any>
  columnsConfigStructure: IColumnConfigStructure<T>
  setColumnsConfigStructure?: (option: IColumnConfigStructure<T>) => void
  columnsHeaderStructure: IColumnHeaderStructure
  setColumnHeaderStructure?: (options: IColumnHeaderStructure) => void
  storeStructure?: () => void
}

const LISTS: ColumnList[] = [StructureConfig.Main, StructureConfig.Freezed]

/** "Customize columns" popup: show/hide columns, reorder them and pin up to three. */
function ColumnsCustomizer<T extends object>({
  columnsConfigStructure,
  setColumnsConfigStructure,
  columnsHeaderStructure,
  setColumnHeaderStructure,
  storeStructure,
  translations,
}: IColumnsCustomizer<T>) {
  const texts = translations?.customizationAction
  const [pinnedLimitReached, setPinnedLimitReached] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const allColumns = useMemo(
    () => [...columnsConfigStructure.Main.items, ...columnsConfigStructure.Freezed.items],
    [columnsConfigStructure],
  )
  const visibleColumnsCount = allColumns.filter((column) => column.isVisible).length

  const handleDragEnd = (result: DropResult) => {
    const columnMove = toColumnMove(result)
    if (!columnMove) return
    const moved = moveColumn(columnsConfigStructure, columnsHeaderStructure, columnMove)
    setPinnedLimitReached(!moved.ok)
    if (!moved.ok) return
    setColumnsConfigStructure?.(moved.config)
    setColumnHeaderStructure?.(moved.header)
  }

  const toggleVisibility = (list: ColumnList, index: number, isVisible: boolean) => {
    // At least one column must stay visible.
    if (isVisible && visibleColumnsCount === 1) return
    const items = columnsConfigStructure[list].items.map((column, i) =>
      i === index ? { ...column, isVisible: !column.isVisible } : column,
    )
    setColumnsConfigStructure?.({ ...columnsConfigStructure, [list]: { ...columnsConfigStructure[list], items } })
  }

  /** Column label: explicit `columnName`, otherwise the header title of the same column. */
  const columnLabel = (list: ColumnList, column: IColumnConfig<T>, index: number) =>
    String(column.columnName ?? columnsHeaderStructure[list]?.items[index]?.title ?? '')

  const handleSave = () => {
    storeStructure?.()
    setAnchorEl(null)
  }

  return (
    <div className='G-costumize-wrapper'>
      <PopUp
        style={{ textTransform: 'capitalize' }}
        ActiveIcon={ColumnsSvgIcon}
        open={open}
        anchorEl={anchorEl}
        handleClick={(event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
        handleClose={() => setAnchorEl(null)}
        modalName={texts?.modalName || 'Customize Columns'}
      >
        <div className='G-costumize-modal'>
          <div className='G-align-center G-costumize-header'>
            <div className='G-flex-column'>
              <div>
                {texts?.info || 'Visible columns are '}
                {visibleColumnsCount} - {allColumns.length}
              </div>
              <div role='alert'>
                {pinnedLimitReached
                  ? texts?.validationMessage || `The maximum number of freezing columns can be ${MAX_PINNED_COLUMNS}`
                  : ''}
              </div>
            </div>
          </div>
          <div className='G-flex G-columns-header'>
            <div className='G-flex' style={{ width: '50%' }}>
              {texts?.columns || 'Columns'}
            </div>
            <div className='G-flex' style={{ width: '50%' }}>
              {texts?.pinnedColumns || 'Pinned Columns'}
            </div>
          </div>
          <div className='G-align-center' style={{ height: '100%' }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              {LISTS.map((list) => (
                <div className='G-column-center' key={list}>
                  <div style={{ margin: list === StructureConfig.Freezed ? '8px 24px 8px 8px' : 8 }}>
                    <Droppable droppableId={list}>
                      {(droppable) => (
                        <div
                          {...droppable.droppableProps}
                          ref={droppable.innerRef}
                          className='G-left-column'
                          style={{ background: list === StructureConfig.Freezed ? '#F6F6F6' : 'white' }}
                        >
                          {columnsConfigStructure[list].items.map((column, index) => {
                            const label = columnLabel(list, column, index)
                            return (
                              <Draggable key={column.id} draggableId={String(column.id)} index={index}>
                                {(draggable, snapshot) => (
                                  <div
                                    ref={draggable.innerRef}
                                    {...draggable.draggableProps}
                                    {...draggable.dragHandleProps}
                                    style={{
                                      userSelect: 'none',
                                      padding: 13,
                                      width: 235,
                                      backgroundColor: snapshot.isDragging ? '#F0F4F6' : 'transparent',
                                      ...draggable.draggableProps.style,
                                    }}
                                    className='G-justify-between'
                                  >
                                    <div className='G-justify-start' style={{ alignItems: 'center', height: 24 }}>
                                      <div className='G-justify-center' style={{ marginRight: 8 }}>
                                        <GroupSvgIcons />
                                      </div>
                                      <Checkbox
                                        isCheck={column.isVisible}
                                        onClick={() => toggleVisibility(list, index, column.isVisible)}
                                        customClass='G-checkbox'
                                        ariaLabel={label}
                                      />
                                    </div>
                                    <div className='G-item-name'>
                                      <div className='G-item-name-text' title={label}>
                                        {label}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })}
                          {droppable.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              ))}
            </DragDropContext>
          </div>
          {storeStructure && (
            <div style={{ padding: 8 }}>
              <Button variant='contained' fullWidth onClick={handleSave}>
                {texts?.actionButtonName || 'Save'}
              </Button>
            </div>
          )}
        </div>
      </PopUp>
    </div>
  )
}

export default memo(ColumnsCustomizer) as <T extends object>(props: IColumnsCustomizer<T>) => ReactElement
