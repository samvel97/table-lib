import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { CheckedItems } from '../Models/table.enum'
import { getRowId, type RowId } from '../utils/rowId'
import { useSyncOnChange } from '../utils/useSyncOnChange'

type ScrollReason = 'sort' | ''

/**
 * Row state for the table: which rows are frozen (pinned to the top), which are checked,
 * and which row's dropdown is open. Every update is immutable.
 */
const useTable = <T extends object>(data: T[], freezedRightSide?: string, RightSideSelfAction?: (row: T) => void) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const scrollReasonRef = useRef<ScrollReason>('')
  const [freezedRows, setFreezedRows] = useState<T[]>([])
  const [unFreezedRows, setUnFreezedRows] = useState<T[]>(data)
  const [checkedRows, setCheckedRows] = useState<T[]>([])
  const [checkedLink, setCheckedLink] = useState<T>()
  const [selectedType, setSelectedType] = useState<string>('none')

  /** Remember why the next data change happens (e.g. sorting), to pick the scroll behavior. */
  const handleActionKey = useCallback((reason: ScrollReason) => {
    scrollReasonRef.current = reason
  }, [])

  /** Pin the unfrozen row at `index` to the top. */
  const freezeRow = (event: MouseEvent, index: number) => {
    event.stopPropagation()
    const row = unFreezedRows[index]
    if (!row) return
    setFreezedRows((previous) => [...previous, row])
    setUnFreezedRows((previous) => previous.filter((_, i) => i !== index))
  }

  /** Move the frozen row at `index` back to the top of the regular rows. */
  const unFreezeRow = (event: MouseEvent, index: number) => {
    event.stopPropagation()
    const row = freezedRows[index]
    if (!row) return
    // v7 used `splice(index, index)`, which removed `index` rows and lost all but the first.
    setFreezedRows((previous) => previous.filter((_, i) => i !== index))
    setUnFreezedRows((previous) => [row, ...previous])
  }

  /** New order of frozen rows after drag and drop. */
  const dragDropFreezeRow = (rows: T[]) => {
    setFreezedRows(rows)
  }

  const findRow = (id: RowId) => [...freezedRows, ...unFreezedRows].find((row) => getRowId(row) === id)

  /** Open the right-side dropdown for a row, or run the custom right-side action. */
  const getRowForDropdown = (id: RowId) => {
    const row = findRow(id)
    if (!row) return
    if (freezedRightSide === 'dropdown') {
      setCheckedLink(row)
    } else {
      RightSideSelfAction?.(row)
    }
  }

  /** Check every visible row (frozen + the given or current page rows). */
  const handleCheckAll = useCallback(
    (pageRows?: T[]) => {
      setCheckedRows([...freezedRows, ...(pageRows ?? unFreezedRows)])
      setSelectedType(CheckedItems.SELECTED_VISIBLE)
    },
    [freezedRows, unFreezedRows],
  )

  const unCheck = useCallback(() => {
    setCheckedRows([])
    setSelectedType(CheckedItems.NONE)
  }, [])

  /** "Select all" across pages: the consumer receives the string marker instead of rows. */
  const checkAllDataFromDb = useCallback(() => {
    setCheckedRows([...freezedRows, ...unFreezedRows])
    setSelectedType(CheckedItems.SELECTED_ALL)
  }, [freezedRows, unFreezedRows])

  const isCheckedRows = (id: RowId): boolean => checkedRows.some((row) => getRowId(row) === id)

  /** Toggle one row's checkbox. */
  const handleCheck = (id: RowId) => {
    if (isCheckedRows(id)) {
      setCheckedRows((previous) => previous.filter((row) => getRowId(row) !== id))
      return
    }
    const row = findRow(id)
    if (row) setCheckedRows((previous) => [...previous, row])
  }

  // New data (page change, sorting, filtering): reset rows and selection during render...
  useSyncOnChange(data, (rows) => {
    setUnFreezedRows(rows)
    setCheckedRows([])
  })

  // ...and scroll back to the top once it is on screen.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      // Sorting keeps the horizontal position, so the sorted column stays in view.
      ...(scrollReasonRef.current === 'sort' ? {} : { left: 0 }),
      behavior: 'smooth',
    })
    scrollReasonRef.current = ''
  }, [data])

  return {
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
  }
}

export default useTable
