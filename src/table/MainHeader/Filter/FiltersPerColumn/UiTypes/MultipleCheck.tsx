import { memo, useState } from 'react'
import { ColumnTypeEnums, type inputSize, numberFields } from '../../../../../Models/table.enum'
import type { IComparisonType, ItemFields } from '../../../../../Models/table.models'
import { containsOnlyNumbers } from '../../../../../utils'
import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import { Button } from '../../../../../ui/Button'
import { Combobox } from '../../../../../ui/Combobox'

/** Values are requested 30 at a time; a full page means there may be more to load. */
const FILTER_VALUES_PAGE_SIZE = 30

type Value = string | number

interface IMultipleCheck {
  columnsSizes: string
  advancedSettings: boolean
  item: IComparisonType
  perColumnListForFilters?: any[]
  columnName: string
  filterTyping: ItemFields
  isLoadingFilters?: boolean
  isDisabled: boolean
  perColumnTotalCount?: number
  inputSizes: inputSize
  translations?: Record<string, any>
  filterColumns?: IComparisonType[]
  setCheckedItemsLocaly(options: Value[], closeCallBack?: () => void): void
  handleSelectItems: (option: Value[], isClosed: boolean, fieldName?: string) => void
  setColumnName: (name: string) => void
  handleChangeValue: (value: string) => void
  handleChangePagePerFilterField?(option: ItemFields): void
}

/** Multi-value filter: type to search values, check several, applied when the field loses focus. */
const MultipleCheck = ({
  columnsSizes,
  item,
  advancedSettings,
  perColumnListForFilters,
  columnName,
  filterTyping,
  isLoadingFilters,
  isDisabled,
  perColumnTotalCount,
  translations,
  setCheckedItemsLocaly,
  handleSelectItems,
  setColumnName,
  handleChangePagePerFilterField,
  handleChangeValue,
}: IMultipleCheck) => {
  const emptyValue = translations?.filterAction?.blank || 'Blank'
  const [checkedItems, setCheckedItems] = useState<Value[]>([])
  const [isOpened, setIsOpened] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [errMessage, setErrMessage] = useState('')
  const isActiveColumn = item.ColumnName === columnName

  /** Options for the open column; `''` and `null` values are shown as "Blank". */
  const options = ((): Value[] => {
    if (!isActiveColumn || !perColumnListForFilters || errMessage) return []
    const list =
      perColumnListForFilters.includes('') && perColumnListForFilters.includes(null)
        ? perColumnListForFilters.slice(1, -1)
        : perColumnListForFilters
    if (item.ColumnType === ColumnTypeEnums.EncryptedData) {
      // Encrypted values can only be matched exactly: show results only while searching.
      const drawList = typeof list[0] === 'string' ? list : []
      return inputValue ? drawList : checkedItems
    }
    return list.map((value) => (value === null || value === '' ? emptyValue : value))
  })()

  const toRequestValues = (values: Value[]) => values.map((value) => (value === emptyValue ? '' : value))

  const isEqual = (option: Value, value: Value) => {
    const comparable = numberFields.includes(item.ColumnType) && value !== emptyValue ? +value : value
    return option === comparable
  }
  const isSelected = (option: Value) => checkedItems.some((value) => isEqual(option, value))

  const selectValues = (values: Value[]) => {
    setCheckedItems(values)
    if (!isOpened) handleSelectItems(toRequestValues(values), false)
    setCheckedItemsLocaly(toRequestValues(values))
  }

  const handleInputChange = (text: string) => {
    setInputValue(text)
    if (numberFields.includes(item.ColumnType) && !containsOnlyNumbers(text)) {
      setErrMessage(translations?.filterAction?.onlyNumbers || 'Only numbers')
      return
    }
    setErrMessage('')
    if (item.ColumnType === ColumnTypeEnums.EncryptedData && !text) return
    handleChangeValue(text)
  }

  const handleOpen = () => {
    setErrMessage('')
    if (isDisabled) return
    if (item.ColumnType !== ColumnTypeEnums.EncryptedData) handleSelectItems([], true, item.ColumnName)
    setColumnName(item.ColumnName)
    setIsOpened(true)
  }

  const handleClose = () => {
    setErrMessage('')
    setColumnName('')
    setInputValue('')
    setIsOpened(false)
    handleSelectItems(toRequestValues(checkedItems), false, item.ColumnName)
  }

  const showsEmptyMessage = (() => {
    if (!isActiveColumn || isLoadingFilters || perColumnListForFilters?.length) return false
    if (item.ColumnType === ColumnTypeEnums.Text || item.ColumnType === ColumnTypeEnums.TikoType) return true
    if (item.ColumnType === ColumnTypeEnums.EncryptedData) return inputValue.length > 0
    if (item.ColumnType === ColumnTypeEnums.Base36Id) return true
    return containsOnlyNumbers(inputValue)
  })()

  const nextPageOption: ItemFields = {
    PropertyName: columnName,
    Search: '',
    Values: [perColumnListForFilters?.at(-1)],
    CheckedItems: [perColumnListForFilters?.at(-1)],
    ComparisonType: 'GreaterThan',
    TypeForUi: 'GreaterThan',
    ColumnType: item.ColumnType,
  }

  // Show the applied filter values when the filter changes.
  useSyncOnChange(filterTyping, (filter) => {
    if (item.ColumnName !== filter.PropertyName) return
    const keepsType =
      item.ColumnType === ColumnTypeEnums.Text ||
      item.ColumnType === ColumnTypeEnums.TikoType ||
      item.ColumnType === ColumnTypeEnums.Base36Id
    setCheckedItems(
      filter.CheckedItems.map((value: Value) => {
        if (value === '') return emptyValue
        return keepsType ? value : String(value)
      }),
    )
  })

  return (
    <div style={{ width: advancedSettings ? columnsSizes : '100%' }}>
      <Combobox<Value>
        label={item.key || item.ColumnName}
        open={isOpened}
        disabled={isDisabled && !isActiveColumn}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={options}
        getOptionLabel={String}
        isSelected={isSelected}
        onToggle={(option) =>
          selectValues(
            isSelected(option) ? checkedItems.filter((value) => !isEqual(option, value)) : [...checkedItems, option],
          )
        }
        selected={checkedItems}
        onRemove={(option) => selectValues(checkedItems.filter((value) => value !== option))}
        onAddCustom={(text) => selectValues([...checkedItems, text])}
        limitTags={advancedSettings ? 1 : 2}
        onFocus={handleOpen}
        onBlur={handleClose}
        loading={isActiveColumn && isLoadingFilters}
        error={errMessage}
        showCheckbox
        emptyText={showsEmptyMessage ? translations?.filterAction?.emptyFieldData || 'Empty data' : null}
        optionClassName={(option) => (option === emptyValue ? 'brt-option--separated' : undefined)}
        footer={
          options.length && perColumnTotalCount === FILTER_VALUES_PAGE_SIZE ? (
            <Button fullWidth onClick={() => handleChangePagePerFilterField?.(nextPageOption)}>
              {translations?.filterAction?.loadMore || 'Load more'}
            </Button>
          ) : null
        }
      />
    </div>
  )
}

export default memo(MultipleCheck)
