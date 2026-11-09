import dayjs, { type Dayjs } from 'dayjs'
import { ColumnTypeEnums } from '../Models/table.enum'
import { type ItemFields } from '../Models/table.models'

export const containsOnlyNumbers = (value: string) => {
  return /^-?\d*\.?\d+$/.test(value) || value.trim() === ''
}
export const formatPrice = (num: number, symbol: string, isPrice = false, fixedCount = 5) => {
  const moneyFix = isPrice ? 2 : fixedCount
  const p = isPrice ? num.toFixed(moneyFix).split('.') : parseFloat(num.toFixed(moneyFix)).toString().split('.')

  return (
    p[0]
      .split('')
      .reverse()
      .reduce(function (acc, num, i) {
        return num + (num !== '-' && i && !(i % 3) ? ',' : '') + acc
      }, '') +
    (p[1] ? '.' + p[1] : '') +
    symbol
  )
}

const filterUiHelperMap = {
  Number: {
    Equal: 1,
    NotEqual: 1,
    GreaterThan: 2,
    LessThan: 2,
    GreaterThanOrEqual: 2,
    LessThanOrEqual: 2,
    Between: 3,
  },
  Currency: {
    Equal: 1,
    NotEqual: 1,
    GreaterThan: 2,
    LessThan: 2,
    GreaterThanOrEqual: 2,
    LessThanOrEqual: 2,
    Between: 3,
  },
  Percentage: {
    Equal: 1,
    NotEqual: 1,
    GreaterThan: 2,
    LessThan: 2,
    GreaterThanOrEqual: 2,
    LessThanOrEqual: 2,
    Between: 3,
  },
  EncryptedData: {
    Equal: 1,
    NotEqual: 1,
  },
  Base36Id: {
    Equal: 1,
    NotEqual: 1,
  },
  Text: {
    Equal: 1,
    NotEqual: 1,
    StartsWith: 2,
    EndsWith: 2,
    Contains: 2,
    NotContains: 2,
  },
  Date: {
    Between: 5,
    Equal: 6,
    NotEqual: 6,
    GreaterThan: 6,
    GreaterThanOrEqual: 6,
    LessThan: 6,
    LessThanOrEqual: 6,
  },
  Tags: {
    In: 4,
  },
  Boolean: {
    Equal: 4,
  },
  NumberCollection: {
    Equal: 7,
    NotEqual: 7,
    GreaterThan: 7,
    LessThan: 7,
    GreaterThanOrEqual: 7,
    LessThanOrEqual: 7,
    Between: 3,
  },
  TextCollection: {
    IsEmpty: 7,
    IsNotEmpty: 7,
    Equal: 7,
    NotEqual: 7,
    StartsWith: 7,
    EndsWith: 7,
    Contains: 7,
    NotContains: 7,
  },
  TikoType: {
    Equal: 1,
    NotEqual: 1,
    StartsWith: 2,
    EndsWith: 2,
    Contains: 2,
    NotContains: 2,
  },
} as const

export const filterUiHelper = (ColumnType: string, ComparisonType: string) => {
  const columnTypeMap = filterUiHelperMap[ColumnType as keyof typeof filterUiHelperMap]
  if (columnTypeMap) {
    return columnTypeMap[ComparisonType as keyof typeof columnTypeMap]
  }
  return 0
}

/**
 * Convert a filter value (Date, ISO string, Dayjs) into a value the date pickers accept.
 * Empty and unparsable input becomes `null` ("no date") instead of an Invalid Date.
 */
export const toPickerDate = (value: unknown): Dayjs | null => {
  if (value === null || value === undefined || value === '') return null
  const date = dayjs(value as string | number | Date | Dayjs)
  return date.isValid() ? date : null
}

export interface RangeValidationMessages {
  isEmpty: string
  onlyNumbers: string
  err: string
  invalid: string
}

const DEFAULT_RANGE_MESSAGES: RangeValidationMessages = {
  isEmpty: 'Required',
  onlyNumbers: 'Only numbers are allowed',
  err: '"To" must be greater than "From"',
  invalid: 'Invalid date',
}

/**
 * Validate a "Between" range. Writes per-side messages through `setErrorMessage`
 * and returns `true` when the range has errors.
 */
export const validateRangeColumns = (
  from: any,
  to: any,
  item: any,
  setErrorMessage: (option: { from: string; to: string }) => void,
  messages?: Partial<RangeValidationMessages>,
) => {
  // Without translations, the old code threw "Cannot read properties of undefined".
  const errMessages = { ...DEFAULT_RANGE_MESSAGES, ...messages }
  let isValid = false
  const columnError = { from: '', to: '' }
  if (from == undefined && to !== undefined && item.ColumnType === 'Date') {
    columnError.from = errMessages.isEmpty
    isValid = true
  }
  if (from !== undefined && to === undefined && item.ColumnType === 'Date') {
    columnError.to = errMessages.isEmpty
    isValid = true
  }
  if (item.ColumnType !== 'Date' && !containsOnlyNumbers(from) && from !== '') {
    columnError.from = errMessages.onlyNumbers
    isValid = true
  }
  if (item.ColumnType !== 'Date' && !containsOnlyNumbers(to) && to !== '') {
    columnError.to = errMessages.onlyNumbers
    isValid = true
  }
  if (from != null && from !== '' && isNaN(from.valueOf() as number) && item.ColumnType === 'Date') {
    columnError.from = errMessages.invalid
    isValid = true
  }
  if (to != null && to !== '' && isNaN(to.valueOf() as number) && item.ColumnType === 'Date') {
    columnError.to = errMessages.invalid
    isValid = true
  }
  if (from > to && item.ColumnType === 'Date') {
    columnError.to = errMessages.err
    isValid = true
  }
  if (item.ColumnType !== 'Date' && +from > +to) {
    columnError.to = errMessages.err
    isValid = true
  }
  if (from == '' && to !== '') {
    columnError.from = errMessages.isEmpty
    isValid = true
  }
  if (from !== '' && to === '') {
    columnError.to = errMessages.isEmpty
    isValid = true
  }

  setErrorMessage(columnError)

  return isValid
}

export const getColumnName = (inputString: string) => {
  const underscoreIndex = inputString.indexOf('_')

  if (underscoreIndex !== -1) {
    const columnNam = inputString.slice(0, underscoreIndex)
    const type = inputString.slice(underscoreIndex + 1)
    return { columnNam, type }
  }
}

export const handleEnumColumns = (option: ItemFields[]) => {
  return option.map((el) => {
    if (el.ColumnType === ColumnTypeEnums.Tags || el.ColumnType === ColumnTypeEnums.Boolean) {
      return {
        ...el,
        Values: el.Values.map((item) => (typeof item === 'object' ? item.id : item)),
      }
    } else {
      return el
    }
  })
}

export function hasScroll() {
  const element = document.getElementsByClassName('G-data-scroll')[0]
  if (!element) return
  // element.scrollHeight > element.clientHeight ||
  return element.scrollWidth > element.clientWidth
}
