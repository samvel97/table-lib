import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import React from 'react'
import { TextField } from '@mui/material'
import { ColumnTypeEnums, type inputSize } from '../../../../../Models/table.enum'
import { type IComparisonType, type ItemFields } from '../../../../../Models/table.models'
import { useState } from 'react'
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
  inputSizes,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setErrMessage('')

    if (item.ColumnType === ColumnTypeEnums.TextCollection && !containsOnlyNumbers(value)) {
      setErrMessage(translations?.filterAction.onlyNumbers || 'only numbers')
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
  const getError = (messageLength: number) => {
    if (!isEnabled && messageLength) {
      return true
    }
    return false
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
    <TextField
      id={item.ColumnName}
      label={item.key || item.ColumnName}
      name={item.ColumnName}
      disabled={columnName !== item.ColumnName && isDisabled}
      value={value}
      variant='outlined'
      size={inputSizes}
      error={getError(errMessage.length)}
      onChange={handleChange}
      onFocus={handleOpenList}
      onBlur={handleCloseList}
      helperText={errMessageText(errMessage)}
      sx={{
        width: advancedSettings ? columnsSizes : '100%',
      }}
    />
  )
}

export default TextInputField
