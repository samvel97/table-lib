import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import { useEffect, useState, type ChangeEvent } from 'react'
import { TextField } from '../../../../../ui/TextField'
import { type IComparisonType, type ItemFields } from '../../../../../Models/table.models'
import { validateRangeColumns } from '../../../../../utils'
import { ColumnTypeEnums, type inputSize } from '../../../../../Models/table.enum'
interface IBetweenNumbers {
  columnsSizes: string
  item: IComparisonType
  advancedSettings: boolean
  filterTyping: ItemFields
  isDisabled: boolean
  columnName: string
  inputSizes: inputSize
  translations?: Record<string, any>
  checkIsDisabled: (option: boolean) => void
  setColumnName: (name: string) => void
  handleChangeRange(value: string, type: string): void
}
const BetweenNumbers = ({
  columnsSizes,
  advancedSettings,
  item,
  filterTyping,
  columnName,
  isDisabled,
  translations,
  setColumnName,
  handleChangeRange,
  checkIsDisabled,
}: IBetweenNumbers) => {
  const [val, setVal] = useState({ from: '', to: '' })
  const [errMessage, setErrMessage] = useState({ from: '', to: '' })
  const [isEnabled, setIsEnabled] = useState({
    isEnabledFrom: false,
    isEnabledTo: false,
  })

  const handleChangeInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    const stateValues = { ...val }
    const { value, name } = event.target
    if (stateValues.to === undefined) {
      stateValues.to = ''
    }
    if (stateValues.from === undefined) {
      stateValues.from = ''
    }
    setErrMessage({ from: '', to: '' })
    if (name === 'to') {
      if (
        !validateRangeColumns(stateValues.from, value, item, setErrMessage, translations?.filterAction?.validations)
      ) {
        handleChangeRange(stateValues.from, value)
      } else {
        checkIsDisabled(true)
      }
    } else {
      if (!validateRangeColumns(value, stateValues.to, item, setErrMessage, translations?.filterAction?.validations)) {
        handleChangeRange(value, stateValues.to)
      } else {
        checkIsDisabled(true)
      }
    }
    setVal((prev) => {
      return { ...prev, [name]: value }
    })
  }
  const handleOpenList = (type: string) => {
    if (type === 'from') {
      setIsEnabled((prev) => {
        return { ...prev, isEnabledFrom: true }
      })
    } else {
      setIsEnabled((prev) => {
        return { ...prev, isEnabledTo: true }
      })
    }
    setColumnName(item.ColumnName)
  }
  const errMessageText = (errMessage: string) => {
    if (!isEnabled.isEnabledFrom && !isEnabled.isEnabledTo && errMessage.length) {
      return errMessage
    }
    return ''
  }
  // Show the applied filter values when the filter changes.
  useSyncOnChange(filterTyping, (filter) => {
    if (item.ColumnName !== filter.PropertyName) return
    const values: string[] =
      item.ColumnType === ColumnTypeEnums.Text ? filter.Values : filter.Values.map((value: number) => String(value))
    setVal({ from: values[0], to: values[1] })
  })

  useEffect(() => {
    if (!isEnabled.isEnabledFrom && !isEnabled.isEnabledTo && errMessage.from == '' && errMessage.to == '') {
      setColumnName('')
    }
  }, [isEnabled])

  return (
    <div className='brt-range' style={{ width: advancedSettings ? columnsSizes : '100%' }}>
      <TextField
        id={`from-${item.ColumnName}`}
        label={translations?.filterAction?.from || 'From'}
        name={'from'}
        onBlur={() => {
          setIsEnabled((prev) => {
            return { ...prev, isEnabledFrom: false }
          })
        }}
        onFocus={() => handleOpenList('from')}
        error={errMessageText(errMessage.from)}
        disabled={columnName !== item.ColumnName && isDisabled}
        value={val.from}
        onChange={handleChangeInputValue}
      />
      <span className='brt-range__separator' aria-hidden='true'>
        –
      </span>
      <TextField
        id={`to-${item.ColumnName}`}
        label={translations?.filterAction?.to || 'To'}
        name={'to'}
        onBlur={() => {
          setIsEnabled((prev) => {
            return { ...prev, isEnabledTo: false }
          })
        }}
        onFocus={() => handleOpenList('to')}
        error={errMessageText(errMessage.to)}
        disabled={columnName !== item.ColumnName && isDisabled}
        value={val.to}
        onChange={handleChangeInputValue}
      />
    </div>
  )
}

export default BetweenNumbers
