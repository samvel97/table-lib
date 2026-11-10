import { memo, useMemo, useState, type MouseEvent, type ReactElement } from 'react'
import { Columns3, GripVertical } from 'lucide-react'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Button } from '../../../ui/Button'
import { StructureConfig } from '../../../Models/table.enum'
import type { IColumnConfig, IColumnConfigStructure, IColumnHeaderStructure } from '../../../Models/table.models'
import Checkbox from '../../../components/checkbox'
import PopUp from '../../../components/popUp'
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
    <PopUp
      ActiveIcon={Columns3}
      triggerClassName='brt-popup-trigger--outlined'
      open={open}
      anchorEl={anchorEl}
      handleClick={(event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
      handleClose={() => setAnchorEl(null)}
      modalName={texts?.modalName || 'Columns'}
    >
      <div className='brt-columns'>
        <div className='brt-columns__header'>
          <div className='brt-columns__title-row'>
            <span className='brt-columns__title'>{texts?.modalName || 'Customize columns'}</span>
            <span className='brt-columns__count' aria-label='Visible columns'>
              {visibleColumnsCount} / {allColumns.length}
            </span>
          </div>
          {texts?.info ? <div className='brt-columns__info'>{texts.info}</div> : null}
          {pinnedLimitReached ? (
            <div className='brt-columns__error' role='alert'>
              {texts?.validationMessage || `You can pin up to ${MAX_PINNED_COLUMNS} columns`}
            </div>
          ) : null}
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='brt-columns__lists'>
            {LISTS.map((list) => (
              <section key={list} className='brt-columns__section'>
                <h3 className='brt-columns__section-title'>
                  {list === StructureConfig.Freezed ? texts?.pinnedColumns || 'Pinned' : texts?.columns || 'Columns'}
                </h3>
                <Droppable droppableId={list}>
                  {(droppable, droppableSnapshot) => (
                    <div
                      {...droppable.droppableProps}
                      ref={droppable.innerRef}
                      className={`brt-columns__list ${list === StructureConfig.Freezed ? 'is-pinned' : ''} ${
                        droppableSnapshot.isDraggingOver ? 'is-over' : ''
                      }`}
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
                                className={`brt-columns__item ${snapshot.isDragging ? 'is-dragging' : ''}`}
                              >
                                <GripVertical size={16} className='brt-columns__grip' aria-hidden='true' />
                                <Checkbox
                                  isCheck={column.isVisible}
                                  onClick={() => toggleVisibility(list, index, column.isVisible)}
                                  customClass='G-checkbox'
                                  ariaLabel={label}
                                />
                                <span className='brt-columns__label' title={label}>
                                  {label}
                                </span>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {droppable.placeholder}
                    </div>
                  )}
                </Droppable>
              </section>
            ))}
          </div>
        </DragDropContext>
        {storeStructure ? (
          <div className='brt-columns__footer'>
            <Button variant='contained' onClick={handleSave}>
              {texts?.actionButtonName || 'Save'}
            </Button>
          </div>
        ) : null}
      </div>
    </PopUp>
  )
}

export default memo(ColumnsCustomizer) as <T extends object>(props: IColumnsCustomizer<T>) => ReactElement
