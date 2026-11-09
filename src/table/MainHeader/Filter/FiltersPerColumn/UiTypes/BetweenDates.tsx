import { useState, type ChangeEvent } from 'react'
import type { IComparisonType, ItemFields } from '../../../../../Models/table.models'
import type { inputSize } from '../../../../../Models/table.enum'
import { validateRangeColumns } from '../../../../../utils'
import { fromLocalInputValue, toLocalInputValue } from '../../../../../utils/localDateTime'
import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import { TextField } from '../../../../../ui/TextField'

type RangeSide = 'from' | 'to'
type RangeValue = Date | string | undefined

interface IBetweenDates {
  columnsSizes: string
  item: IComparisonType
  advancedSettings: boolean
  filterTyping: ItemFields
  columnName: string
  isDisabled: boolean
  inputSizes: inputSize
  translations?: Record<string, any>
  /** @deprecated The browser formats the native date input in the user's locale. */
  locale?: string | null
  setColumnName: (name: string) => void
  checkIsDisabled: (option: boolean) => void
  /** Receives `Date` objects (or `''` for an empty side). */
  handleChangeRange(from: RangeValue, to: RangeValue): void
}

/** Date range filter ("Between"): two native date-time inputs that limit each other. */
const BetweenDates = ({
  columnsSizes,
  item,
  advancedSettings,
  columnName,
  filterTyping,
  isDisabled,
  translations,
  checkIsDisabled,
  setColumnName,
  handleChangeRange,
}: IBetweenDates) => {
  const [range, setRange] = useState<Record<RangeSide, RangeValue>>({ from: undefined, to: undefined })
  const [errors, setErrors] = useState<Record<RangeSide, string>>({ from: '', to: '' })

  // Show the applied filter values when the filter changes.
  useSyncOnChange(filterTyping, (filter) => {
    if (item.ColumnName === filter.PropertyName) setRange({ from: filter.Values[0], to: filter.Values[1] })
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>, side: RangeSide) => {
    setColumnName(item.ColumnName)
    const raw = event.target.value
    const parsed = raw ? fromLocalInputValue(raw) : null
    // An unparsable value is passed on as an Invalid Date so the range validation reports it.
    const value: Date | '' = raw ? (parsed ?? new Date(NaN)) : ''
    const next = { from: range.from ?? '', to: range.to ?? '', [side]: value }

    setErrors({ from: '', to: '' })
    const hasErrors = validateRangeColumns(next.from, next.to, item, setErrors, translations?.filterAction?.validations)
    if (hasErrors) {
      checkIsDisabled(true)
    } else {
      handleChangeRange(next.from, next.to)
    }
    setRange((previous) => ({ ...previous, [side]: value || undefined }))
  }

  const fromValue = toLocalInputValue(range.from)
  const toValue = toLocalInputValue(range.to)
  const disabled = isDisabled && item.ColumnName !== columnName
  const handleBlur = () => {
    if (!isDisabled) setColumnName('')
  }

  return (
    <div
      className={`brt-range ${item.IsBold ? 'IsBold' : ''}`}
      style={{ width: advancedSettings ? columnsSizes : '100%' }}
    >
      <TextField
        type='datetime-local'
        step={1}
        label={translations?.filterAction?.from || 'From'}
        value={fromValue}
        // Each side limits the other.
        max={toValue || undefined}
        error={errors.from}
        disabled={disabled}
        onFocus={() => setColumnName(item.ColumnName)}
        onBlur={handleBlur}
        onChange={(event) => handleChange(event, 'from')}
      />
      <span className='brt-range__separator' aria-hidden='true'>
        –
      </span>
      <TextField
        type='datetime-local'
        step={1}
        label={translations?.filterAction?.to || 'To'}
        value={toValue}
        min={fromValue || undefined}
        error={errors.to}
        disabled={disabled}
        onFocus={() => setColumnName(item.ColumnName)}
        onBlur={handleBlur}
        onChange={(event) => handleChange(event, 'to')}
      />
    </div>
  )
}

export default BetweenDates
