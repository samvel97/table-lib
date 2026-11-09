import { useEffect, useState } from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import type { Dayjs } from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'
import 'dayjs/locale/hy-am'
import { type IComparisonType, type ItemFields } from '../../../../../Models/table.models'
import { PICKER_LAYOUT_SX } from './pickerLayout'
import { type inputSize } from '../../../../../Models/table.enum'
import { toPickerDate, validateRangeColumns } from '../../../../../utils'
import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import ActionList from '../../../../../components/datePickerActionList/ActionList'
import { DateActionTranslationsContext } from '../../../../../components/datePickerActionList/context'
import './style.scss'

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
  locale?: string | null
  setColumnName: (name: string) => void
  checkIsDisabled: (option: boolean) => void
  handleChangeRange(from: RangeValue, to: RangeValue): void
}

const PICKER_VIEWS = ['year', 'day', 'hours', 'minutes', 'seconds'] as const
const TIME_STEPS = { hours: 1, minutes: 1, seconds: 1 }

/** Date range filter ("Between") with two linked date-time pickers. */
const BetweenDates = ({
  columnsSizes,
  item,
  advancedSettings,
  columnName,
  filterTyping,
  isDisabled,
  inputSizes,
  translations,
  locale = 'hy-am',
  checkIsDisabled,
  setColumnName,
  handleChangeRange,
}: IBetweenDates) => {
  const [range, setRange] = useState<Record<RangeSide, RangeValue>>({ from: undefined, to: undefined })
  const [errors, setErrors] = useState<Record<RangeSide, string>>({ from: '', to: '' })
  const [openSide, setOpenSide] = useState<RangeSide | null>(null)

  // Values coming from the applied filter take precedence over the local draft.
  const hasAppliedValues = filterTyping.Values.length > 0
  const fromDate = toPickerDate(hasAppliedValues ? filterTyping.Values[0] : range.from)
  const toDate = toPickerDate(hasAppliedValues ? filterTyping.Values[1] : range.to)

  const handleChange = (picked: Dayjs | null, side: RangeSide) => {
    const value: Date | '' = picked ? new Date(picked.valueOf()) : ''
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

  const open = (side: RangeSide) => {
    setColumnName(item.ColumnName)
    setOpenSide(side)
  }

  const close = () => {
    if (!isDisabled) setColumnName('')
    setOpenSide(null)
  }

  const handleBlur = () => {
    if (!isDisabled) setColumnName('')
  }

  useEffect(() => {
    setColumnName(item.ColumnName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range])

  // Show the applied filter values when the filter changes.
  useSyncOnChange(filterTyping, (filter) => {
    if (item.ColumnName === filter.PropertyName) setRange({ from: filter.Values[0], to: filter.Values[1] })
  })

  const renderPicker = (side: RangeSide) => (
    <div
      style={{ width: '48%', position: 'relative' }}
      tabIndex={0}
      onBlur={handleBlur}
      className={errors[side] ? 'date-picker' : ''}
    >
      <DateTimePicker
        open={openSide === side}
        onOpen={() => open(side)}
        onClose={close}
        closeOnSelect
        timeSteps={TIME_STEPS}
        label={side === 'from' ? translations?.filterAction?.from || 'From' : translations?.filterAction?.to || 'To'}
        ampm={false}
        slotProps={{ textField: { size: inputSizes }, layout: { sx: PICKER_LAYOUT_SX } }}
        format='YYYY-MM-DD HH:mm:ss'
        views={PICKER_VIEWS}
        // Each side limits the other. `undefined` means "no limit"; `null` crashed the picker.
        maxDateTime={side === 'from' ? (toDate ?? undefined) : undefined}
        minDateTime={side === 'to' ? (fromDate ?? undefined) : undefined}
        disabled={isDisabled && item.ColumnName !== columnName}
        value={side === 'from' ? fromDate : toDate}
        onChange={(picked) => handleChange(picked, side)}
        slots={{ actionBar: ActionList }}
      />
      {errors[side] ? <div className='filter-error'>{errors[side]}</div> : null}
    </div>
  )

  return (
    <div
      className={`G-justify-between ${item.IsBold ? 'IsBold' : ''}`}
      style={{ width: advancedSettings ? columnsSizes : '100%' }}
    >
      <DateActionTranslationsContext.Provider value={translations?.filterAction}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale ?? undefined}>
          {renderPicker('from')}
          <div className='G-center'>-</div>
          {renderPicker('to')}
        </LocalizationProvider>
      </DateActionTranslationsContext.Provider>
    </div>
  )
}

export default BetweenDates
