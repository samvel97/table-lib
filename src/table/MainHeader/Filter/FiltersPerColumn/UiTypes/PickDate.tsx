import { useState, type ChangeEvent } from 'react'
import type { IComparisonType, ItemFields } from '../../../../../Models/table.models'
import type { inputSize } from '../../../../../Models/table.enum'
import { TextField } from '../../../../../ui/TextField'
import { fromLocalInputValue, toLocalInputValue } from '../../../../../utils/localDateTime'

interface IPickDate {
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
  /** Receives a `Date`, `''` when cleared, or `'invalid'`. */
  handleChangeValue(option: Date | '' | 'invalid'): void
}

/** Single date-time filter (Equal, GreaterThan, ...) using the native date-time input. */
const PickDate = ({
  columnsSizes,
  advancedSettings,
  item,
  columnName,
  filterTyping,
  isDisabled,
  translations,
  setColumnName,
  handleChangeValue,
}: IPickDate) => {
  const [errMessage, setErrMessage] = useState('')
  const [draft, setDraft] = useState<string | null>(null)
  const value = draft ?? toLocalInputValue(filterTyping.Values[0])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    setDraft(raw)
    setColumnName(item.ColumnName)
    if (!raw) {
      setErrMessage('')
      handleChangeValue('')
      return
    }
    const date = fromLocalInputValue(raw)
    if (!date) {
      setErrMessage(translations?.filterAction?.validations?.invalid || 'Invalid date')
      handleChangeValue('invalid')
      return
    }
    setErrMessage('')
    handleChangeValue(date)
  }

  return (
    <div className={item.IsBold ? 'IsBold' : ''} style={{ width: advancedSettings ? columnsSizes : '100%' }}>
      <TextField
        type='datetime-local'
        step={1}
        label={item.key || item.ColumnName}
        value={value}
        error={errMessage}
        disabled={isDisabled && item.ColumnName !== columnName}
        onFocus={() => setColumnName(item.ColumnName)}
        onBlur={() => {
          setDraft(null)
          if (!isDisabled) setColumnName('')
        }}
        onChange={handleChange}
      />
    </div>
  )
}

export default PickDate
