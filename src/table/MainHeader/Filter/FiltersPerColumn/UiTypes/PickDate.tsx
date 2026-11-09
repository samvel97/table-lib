import { useState } from 'react'
import type { Dayjs } from 'dayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { type IComparisonType, type ItemFields } from '../../../../../Models/table.models'
import { PICKER_LAYOUT_SX } from './pickerLayout'
import ActionList from '../../../../../components/datePickerActionList/ActionList'
import { DateActionTranslationsContext } from '../../../../../components/datePickerActionList/context'
import { type inputSize } from '../../../../../Models/table.enum'
import { toPickerDate } from '../../../../../utils'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'
import 'dayjs/locale/hy-am'
interface IPickDate {
  columnsSizes: string
  item: IComparisonType
  advancedSettings: boolean
  filterTyping: ItemFields
  columnName: string
  isDisabled: boolean
  inputSizes: inputSize
  translations?: Record<string, any>
  locale?: string | null
  setColumnName: (name: string) => void
  handleChangeValue(option: any): void
}
const PickDate = ({
  columnsSizes,
  advancedSettings,
  item,
  columnName,
  filterTyping,
  isDisabled,
  inputSizes,
  translations,
  locale = 'hy-am',
  setColumnName,
  handleChangeValue,
}: IPickDate) => {
  const [errMessage, setErrMessage] = useState('')
  const handlePick = (newValue: Dayjs | null) => {
    if (newValue !== null && isNaN(newValue.valueOf() as number)) {
      setErrMessage(translations?.filterAction?.validations?.invalid || 'invalid')
    } else {
      setErrMessage('')

      setColumnName(item.ColumnName)
      handleChangeValue(
        newValue
          ? isNaN(newValue.valueOf() as number)
            ? 'invalid'
            : new Date(newValue.valueOf() as number | string)
          : '',
      )
    }
  }
  const handleOpenList = () => {
    setColumnName(item.ColumnName)
  }
  const handleClose = () => {
    if (!isDisabled) setColumnName('')
  }
  const unFocused = () => {
    if (!isDisabled) setColumnName('')
  }
  return (
    <div className={item.IsBold ? 'IsBold' : ''} style={{ width: advancedSettings ? columnsSizes : '100%' }}>
      <DateActionTranslationsContext.Provider value={translations?.filterAction}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale ?? undefined}>
          <div
            style={{ width: '100%', position: 'relative' }}
            tabIndex={0}
            onBlur={unFocused}
            className={errMessage ? 'date-picker' : ''}
          >
            <DateTimePicker
              slotProps={{ textField: { size: inputSizes }, layout: { sx: PICKER_LAYOUT_SX } }}
              timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
              minutesStep={1}
              ampm={false}
              label={item.key || item.ColumnName}
              disabled={isDisabled && item.ColumnName !== columnName}
              displayWeekNumber
              onOpen={handleOpenList}
              onClose={handleClose}
              value={toPickerDate(filterTyping.Values[0])}
              format='YYYY-MM-DD HH:mm:ss'
              onChange={handlePick}
              views={['year', 'day', 'hours', 'minutes', 'seconds']}
              sx={{ width: '100%' }}
              slots={{
                actionBar: ActionList,
              }}
            />
            {errMessage ? <div className='filter-error'>{errMessage}</div> : null}
          </div>
        </LocalizationProvider>
      </DateActionTranslationsContext.Provider>
    </div>
  )
}
export default PickDate
