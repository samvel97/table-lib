import { act, renderHook } from '@testing-library/react'
import type { MouseEvent } from 'react'
import { CheckedItems } from '../Models/table.enum'
import useTable from './useTable'

interface Row {
  id: number
  name: string
}

const rows: Row[] = [
  { id: 1, name: 'Anna' },
  { id: 2, name: 'Daniel' },
  { id: 3, name: 'Mary' },
  { id: 4, name: 'Aram' },
  { id: 5, name: 'Sofia' },
]

const click = { stopPropagation: () => undefined } as unknown as MouseEvent
const ids = (list: Row[]) => list.map((row) => row.id)

const setup = (data: Row[] = rows) => renderHook(({ data }) => useTable<Row>(data), { initialProps: { data } })

describe('useTable: freezing rows', () => {
  it('moves a row to the frozen list', () => {
    const { result } = setup()
    act(() => result.current.freezeRow(click, 1))
    expect(ids(result.current.freezedRows)).toEqual([2])
    expect(ids(result.current.unFreezedRows)).toEqual([1, 3, 4, 5])
  })

  it('unfreezes exactly the clicked row, wherever it is in the frozen list', () => {
    const { result } = setup()
    // Freeze rows 1, 2, 3, 4 (always freezing the first unfrozen row).
    for (let i = 0; i < 4; i++) act(() => result.current.freezeRow(click, 0))
    expect(ids(result.current.freezedRows)).toEqual([1, 2, 3, 4])

    // Unfreeze the row at frozen index 2 (id 3): only that row must move back.
    act(() => result.current.unFreezeRow(click, 2))
    expect(ids(result.current.freezedRows)).toEqual([1, 2, 4])
    expect(ids(result.current.unFreezedRows)).toEqual([3, 5])
  })

  it('does not lose rows when unfreezing (frozen + unfrozen always contain every row)', () => {
    const { result } = setup()
    for (let i = 0; i < 4; i++) act(() => result.current.freezeRow(click, 0))
    act(() => result.current.unFreezeRow(click, 3))
    const all = [...result.current.freezedRows, ...result.current.unFreezedRows]
    expect(ids(all).sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('replaces the frozen list after drag and drop', () => {
    const { result } = setup()
    act(() => result.current.freezeRow(click, 0))
    act(() => result.current.freezeRow(click, 0))
    act(() => result.current.dragDropFreezeRow([rows[1], rows[0]]))
    expect(ids(result.current.freezedRows)).toEqual([2, 1])
  })
})

describe('useTable: checking rows', () => {
  it('toggles a row on and off', () => {
    const { result } = setup()
    act(() => result.current.handleCheck(2))
    expect(result.current.isCheckedRows(2)).toBe(true)
    act(() => result.current.handleCheck(2))
    expect(result.current.isCheckedRows(2)).toBe(false)
  })

  it('does not mutate the previously returned checked list', () => {
    const { result } = setup()
    act(() => result.current.handleCheck(1))
    act(() => result.current.handleCheck(2))
    const before = result.current.checkedRows
    const snapshot = [...before]
    act(() => result.current.handleCheck(1))
    expect(before).toEqual(snapshot)
    expect(ids(result.current.checkedRows)).toEqual([2])
  })

  it('checks visible rows, all rows, and none', () => {
    const { result } = setup()
    act(() => result.current.handleCheckAll())
    expect(result.current.checkedRows).toHaveLength(5)
    expect(result.current.selectedType).toBe(CheckedItems.SELECTED_VISIBLE)

    act(() => result.current.unCheck())
    expect(result.current.checkedRows).toHaveLength(0)
    expect(result.current.selectedType).toBe(CheckedItems.NONE)

    act(() => result.current.checkAllDataFromDb())
    expect(result.current.selectedType).toBe(CheckedItems.SELECTED_ALL)
  })

  it('clears the selection when new data arrives', () => {
    const { result, rerender } = setup()
    act(() => result.current.handleCheck(1))
    rerender({ data: rows.slice(0, 2) })
    expect(result.current.checkedRows).toHaveLength(0)
    expect(ids(result.current.unFreezedRows)).toEqual([1, 2])
  })

  it('keeps frozen rows out of the regular list when new data arrives', () => {
    const { result, rerender } = setup()
    act(() => result.current.freezeRow(click, 1))
    rerender({ data: [...rows] })
    expect(ids(result.current.freezedRows)).toEqual([2])
    expect(ids(result.current.unFreezedRows)).toEqual([1, 3, 4, 5])
    rerender({ data: rows.slice(2) })
    expect(result.current.freezedRows).toHaveLength(0)
    expect(ids(result.current.unFreezedRows)).toEqual([3, 4, 5])
  })
})
