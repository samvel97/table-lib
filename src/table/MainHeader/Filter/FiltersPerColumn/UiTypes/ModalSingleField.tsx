import { useState } from 'react'
import { ColumnTypeEnums, ConditionalOperatorsEnums, type inputSize } from '../../../../../Models/table.enum'
import type { IComparisonType, ItemFields } from '../../../../../Models/table.models'
import { containsOnlyNumbers } from '../../../../../utils'
import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import { Button } from '../../../../../ui/Button'
import { Combobox } from '../../../../../ui/Combobox'

interface IModalForSingleField {
  columnsSizes: string
  advancedSettings: boolean
  item: IComparisonType
  filterTyping: ItemFields
  columnName: string
  perColumnListForFilters?: string[]
  isLoadingFilters?: boolean
  perColumnTotalCount?: number
  isDisabled: boolean
  inputSizes: inputSize
  translations?: Record<string, any>
  filterColumns?: IComparisonType[]
  handleSelectItems: (option: any[], isClosed: boolean) => void
  setColumnName: (name: string) => void
  handleChangeValue: (value: string) => void
  setCheckedItemsLocaly(options: any[]): void
  handleChangePagePerFilterField?(option: ItemFields): void
  handleClose?: () => void
}

/** Single-value filter with type-ahead (StartsWith, Contains, GreaterThan, ...). */
const ModalForSingleField = ({
  item,
  perColumnListForFilters,
  columnName,
  filterTyping,
  isLoadingFilters,
  perColumnTotalCount,
  isDisabled,
  advancedSettings,
  columnsSizes,
  translations,
  handleChangeValue,
  handleSelectItems,
  setColumnName,
  setCheckedItemsLocaly,
  handleChangePagePerFilterField,
}: IModalForSingleField) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [errMessage, setErrMessage] = useState('')
  const [isOpened, setIsOpened] = useState(false)
  const keepsText = item.ColumnType === ColumnTypeEnums.Text || item.ColumnType === ColumnTypeEnums.TikoType
  const toRequestValues = (values: string[]) => (keepsText ? values : values.map((value) => +value))

  const handleOpen = () => {
    setErrMessage('')
    if (isDisabled) return
    setColumnName(item.ColumnName)
    setIsOpened(true)
  }

  const handleClose = () => {
    setErrMessage('')
    setColumnName('')
    setInputValue('')
    setIsOpened(false)
    handleSelectItems(toRequestValues(checkedItems), false)
    setCheckedItemsLocaly(toRequestValues(checkedItems))
  }

  /** Only one value can be chosen: the latest selection replaces the previous one. */
  const selectValues = (values: string[]) => {
    const selected = values.length ? [values[values.length - 1]] : []
    setCheckedItems(selected)
    if (!isOpened) handleSelectItems(keepsText ? values : toRequestValues(selected), false)
    setCheckedItemsLocaly(keepsText ? values : toRequestValues(selected))
  }

  const handleInputChange = (text: string) => {
    setInputValue(text)
    if (!keepsText && !containsOnlyNumbers(text)) {
      setErrMessage(translations?.filterAction?.onlyNumbers || 'Only numbers')
      return
    }
    setErrMessage('')
    handleChangeValue(text)
  }

  const isActiveColumn = item.ColumnName === columnName
  const options =
    filterTyping.PropertyName === columnName && !errMessage && inputValue.length && perColumnListForFilters?.length
      ? perColumnListForFilters.filter((value) => value !== '')
      : []
  const showsEmptyMessage =
    isActiveColumn &&
    !isLoadingFilters &&
    !perColumnListForFilters?.length &&
    inputValue.length > 0 &&
    (keepsText || containsOnlyNumbers(inputValue))

  const nextPageOption: ItemFields = {
    PropertyName: columnName,
    Search: '',
    Values: [perColumnListForFilters?.at(-1)],
    CheckedItems: [perColumnListForFilters?.at(-1)],
    ComparisonType: ConditionalOperatorsEnums['>' as keyof typeof ConditionalOperatorsEnums],
    TypeForUi: ConditionalOperatorsEnums['>' as keyof typeof ConditionalOperatorsEnums],
    ColumnType: item.ColumnType,
  }

  // Show the applied filter values when the filter changes.
  useSyncOnChange(filterTyping, (filter) => {
    if (item.ColumnName !== filter.PropertyName) return
    setCheckedItems(keepsText ? filter.CheckedItems : filter.CheckedItems.map((value: number) => String(value)))
  })

  return (
    <div style={{ width: advancedSettings ? columnsSizes : '100%' }}>
      <Combobox<string>
        label={item.key || item.ColumnName}
        open={isOpened}
        disabled={isDisabled && !isActiveColumn}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={options}
        getOptionLabel={(option) => (option === '' ? translations?.filterAction?.emptyString || '(Empty)' : option)}
        isSelected={(option) => checkedItems.includes(option)}
        onToggle={(option) => selectValues([...checkedItems, option])}
        selected={checkedItems}
        onRemove={(option) => selectValues(checkedItems.filter((value) => value !== option))}
        onAddCustom={(text) => selectValues([...checkedItems, text])}
        onFocus={handleOpen}
        onBlur={handleClose}
        loading={isActiveColumn && isLoadingFilters}
        error={errMessage}
        emptyText={showsEmptyMessage ? translations?.filterAction?.emptyFieldData || 'Empty data' : null}
        footer={
          options.length && perColumnTotalCount && perColumnListForFilters!.length < perColumnTotalCount ? (
            <Button fullWidth onClick={() => handleChangePagePerFilterField?.(nextPageOption)}>
              {translations?.filterAction?.loadMore || 'Load more'}
            </Button>
          ) : null
        }
      />
    </div>
  )
}

export default ModalForSingleField
