import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import { TextField } from '../../../../../ui/TextField'
import { ColumnTypeEnums, type inputSize } from '../../../../../Models/table.enum'
import { type IComparisonType, type ItemFields } from '../../../../../Models/table.models'
import { useState, type ChangeEvent } from 'react'
import { containsOnlyNumbers } from '../../../../../utils'
interface IMultipleCHeck {
  item: IComparisonType
  advancedSettings: boolean
  inputSizes: inputSize
  isDisabled: boolean
  filterTyping: ItemFields
  columnName: string
  columnsSizes: string
  translations?: Record<string, any>
  setColumnName: (name: string) => void
  handleChangeValue: (value: string) => void
}
const TextInputField = ({
  item,
  advancedSettings,
  isDisabled,
  filterTyping,
  columnName,
  columnsSizes,
  translations,
  setColumnName,
  handleChangeValue,
}: IMultipleCHeck) => {
  const [value, setValue] = useState<string | number>('')
  const [isEnabled, setIsEnabled] = useState<boolean>(false)
  const [errMessage, setErrMessage] = useState<string>('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setErrMessage('')

    if (item.ColumnType === ColumnTypeEnums.TextCollection && !containsOnlyNumbers(value)) {
      setErrMessage(translations?.filterAction?.onlyNumbers || 'only numbers')
      setValue(value)
      return
    }
    setValue(value)
    handleChangeValue(value)
  }

  const handleOpenList = () => {
    setIsEnabled(true)
    setColumnName(item.ColumnName)
  }
  const handleCloseList = () => {
    setIsEnabled(false)
    setColumnName('')
  }

  const errMessageText = (errMessage: string) => {
    if (!isEnabled && errMessage.length) {
      return errMessage
    }
    return ''
  }
  // Show the applied filter value when the filter changes.
  useSyncOnChange(filterTyping, (filter) => {
    if (item.ColumnName !== filter.PropertyName) return
    const first = filter.Values[0]
    if (first !== undefined && first !== null && first !== '') {
      setValue(item.ColumnType === ColumnTypeEnums.Text ? first : String(first))
    }
  })

  return (
    <div style={{ width: advancedSettings ? columnsSizes : '100%' }}>
      <TextField
        id={item.ColumnName}
        label={item.key || item.ColumnName}
        name={item.ColumnName}
        disabled={columnName !== item.ColumnName && isDisabled}
        value={value}
        error={errMessageText(errMessage)}
        onChange={handleChange}
        onFocus={handleOpenList}
        onBlur={handleCloseList}
      />
    </div>
  )
}

export default TextInputField
