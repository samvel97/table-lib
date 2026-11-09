import { StructureConfig } from '../../../Models/table.enum'
import type { IColumnConfigStructure, IColumnHeaderStructure } from '../../../Models/table.models'

/** Pinned columns are limited, so the frozen area never covers the whole table. */
export const MAX_PINNED_COLUMNS = 3

export type ColumnList = `${StructureConfig}`

export interface ColumnMove {
  from: { list: ColumnList; index: number }
  to: { list: ColumnList; index: number }
}

export type MoveColumnResult<T extends object> =
  | { ok: true; config: IColumnConfigStructure<T>; header: IColumnHeaderStructure }
  | { ok: false; reason: 'pinned-limit' }

const isColumnList = (value: string): value is ColumnList =>
  value === StructureConfig.Main || value === StructureConfig.Freezed

const move = <Item>(source: Item[], target: Item[], fromIndex: number, toIndex: number, sameList: boolean) => {
  const nextSource = [...source]
  const [moved] = nextSource.splice(fromIndex, 1)
  const nextTarget = sameList ? nextSource : [...target]
  nextTarget.splice(toIndex, 0, moved)
  return { source: nextSource, target: nextTarget }
}

/**
 * Move a column between (or within) the "Main" and "Freezed" lists.
 * Column config and header lists are kept in sync: index `i` in one always describes index `i` in the other.
 */
export function moveColumn<T extends object>(
  config: IColumnConfigStructure<T>,
  header: IColumnHeaderStructure,
  { from, to }: ColumnMove,
): MoveColumnResult<T> {
  const sameList = from.list === to.list
  if (!sameList && to.list === StructureConfig.Freezed && config.Freezed.items.length >= MAX_PINNED_COLUMNS) {
    return { ok: false, reason: 'pinned-limit' }
  }

  const configItems = move(config[from.list].items, config[to.list].items, from.index, to.index, sameList)
  const headerItems = move(header[from.list].items, header[to.list].items, from.index, to.index, sameList)

  return {
    ok: true,
    config: {
      ...config,
      [from.list]: { ...config[from.list], items: configItems.source },
      [to.list]: { ...config[to.list], items: configItems.target },
    },
    header: {
      ...header,
      [from.list]: { ...header[from.list], items: headerItems.source },
      [to.list]: { ...header[to.list], items: headerItems.target },
    },
  }
}

/** Convert a drag-and-drop result into a column move, or `null` when nothing should change. */
export function toColumnMove(result: {
  source: { droppableId: string; index: number }
  destination?: { droppableId: string; index: number } | null
}): ColumnMove | null {
  const { source, destination } = result
  if (!destination || !isColumnList(source.droppableId) || !isColumnList(destination.droppableId)) return null
  if (source.droppableId === destination.droppableId && source.index === destination.index) return null
  return {
    from: { list: source.droppableId, index: source.index },
    to: { list: destination.droppableId, index: destination.index },
  }
}
