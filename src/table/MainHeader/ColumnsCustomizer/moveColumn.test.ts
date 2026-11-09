import type { IColumnConfig, IColumnConfigStructure, IColumnHeaderStructure } from '../../../Models/table.models'
import { MAX_PINNED_COLUMNS, moveColumn, toColumnMove } from './moveColumn'

const column = (id: number): IColumnConfig<object> => ({ id, title: () => null, setRow: () => null, isVisible: true })
const header = (id: number) => ({ id, order: id, title: `Column ${id}` })

const structures = (mainIds: number[], pinnedIds: number[] = []) => ({
  config: {
    Main: { name: 'Columns', items: mainIds.map(column) },
    Freezed: { name: 'Freezed', items: pinnedIds.map(column) },
  } satisfies IColumnConfigStructure<object>,
  header: {
    Main: { name: 'Columns', items: mainIds.map(header) },
    Freezed: { name: 'Freezed', items: pinnedIds.map(header) },
  } satisfies IColumnHeaderStructure,
})

const ids = (items: { id?: string | number }[]) => items.map((item) => item.id)

describe('moveColumn', () => {
  it('reorders columns within a list and keeps headers in sync', () => {
    const { config, header } = structures([1, 2, 3])
    const result = moveColumn(config, header, { from: { list: 'Main', index: 0 }, to: { list: 'Main', index: 2 } })
    if (!result.ok) throw new Error('expected ok')
    expect(ids(result.config.Main.items)).toEqual([2, 3, 1])
    expect(ids(result.header.Main.items)).toEqual([2, 3, 1])
  })

  it('pins a column and keeps the list names of both structures', () => {
    const { config, header } = structures([1, 2, 3])
    const result = moveColumn(config, header, { from: { list: 'Main', index: 1 }, to: { list: 'Freezed', index: 0 } })
    if (!result.ok) throw new Error('expected ok')
    expect(ids(result.config.Main.items)).toEqual([1, 3])
    expect(ids(result.config.Freezed.items)).toEqual([2])
    expect(ids(result.header.Freezed.items)).toEqual([2])
    expect(result.header.Freezed.name).toBe('Freezed')
    expect(result.header.Main.name).toBe('Columns')
  })

  it(`refuses to pin more than ${MAX_PINNED_COLUMNS} columns`, () => {
    const { config, header } = structures([4, 5], [1, 2, 3])
    const result = moveColumn(config, header, { from: { list: 'Main', index: 0 }, to: { list: 'Freezed', index: 0 } })
    expect(result).toEqual({ ok: false, reason: 'pinned-limit' })
  })

  it('still allows reordering inside a full pinned list and unpinning', () => {
    const { config, header } = structures([4], [1, 2, 3])
    const reorder = moveColumn(config, header, {
      from: { list: 'Freezed', index: 0 },
      to: { list: 'Freezed', index: 2 },
    })
    expect(reorder.ok && ids(reorder.config.Freezed.items)).toEqual([2, 3, 1])
    const unpin = moveColumn(config, header, { from: { list: 'Freezed', index: 0 }, to: { list: 'Main', index: 0 } })
    expect(unpin.ok && ids(unpin.config.Main.items)).toEqual([1, 4])
  })

  it('does not mutate its input', () => {
    const { config, header } = structures([1, 2, 3])
    const before = JSON.stringify({ config, header })
    moveColumn(config, header, { from: { list: 'Main', index: 0 }, to: { list: 'Freezed', index: 0 } })
    expect(JSON.stringify({ config, header })).toBe(before)
  })
})

describe('toColumnMove', () => {
  it('ignores drops outside a list, onto the same spot, or onto unknown lists', () => {
    expect(toColumnMove({ source: { droppableId: 'Main', index: 0 }, destination: null })).toBeNull()
    expect(
      toColumnMove({ source: { droppableId: 'Main', index: 1 }, destination: { droppableId: 'Main', index: 1 } }),
    ).toBeNull()
    expect(
      toColumnMove({ source: { droppableId: 'Main', index: 1 }, destination: { droppableId: 'Other', index: 0 } }),
    ).toBeNull()
  })
})
