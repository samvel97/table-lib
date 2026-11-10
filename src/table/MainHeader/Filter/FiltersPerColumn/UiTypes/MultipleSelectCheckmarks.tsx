import { memo, useState } from 'react'
import type { inputSize } from '../../../../../Models/table.enum'
import type { IComparisonType, ISelect, ItemFields } from '../../../../../Models/table.models'
import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import { Combobox } from '../../../../../ui/Combobox'

interface IMultipleSelectCheckmarks {
  item: IComparisonType
  columnsSizes: string
  isDisabled: boolean
  perColumnListForFilters?: ISelect[]
  columnName: string
  isLoadingFilters?: boolean
  advancedSettings: boolean
  filterTyping: ItemFields
  inputSizes: inputSize
  filterColumns?: IComparisonType[]
  translations?: Record<string, any>
  setCheckedItemsLocaly(options: any[]): void
  handleSelectItems: (option: any[], isClosed: boolean) => void
  setColumnName: (name: string) => void
}

/** Tags / boolean filter: pick values from a fixed list (`{ id, name }`). */
const MultipleSelectCheckmarks = ({
  item,
  columnsSizes,
  isDisabled,
  perColumnListForFilters,
  columnName,
  isLoadingFilters,
  advancedSettings,
  filterTyping,
  translations,
  setCheckedItemsLocaly,
  handleSelectItems,
  setColumnName,
}: IMultipleSelectCheckmarks) => {
  const [checkedItems, setCheckedItems] = useState<ISelect[]>([])
  const [isOpened, setIsOpened] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const isActiveColumn = item.ColumnName === columnName

  const selectValues = (values: ISelect[]) => {
    setCheckedItems(values)
    if (!isOpened) handleSelectItems(values, false)
    setCheckedItemsLocaly(values)
  }

  const handleOpen = () => {
    if (isDisabled) return
    setColumnName(item.ColumnName)
    handleSelectItems([], true)
    setIsOpened(true)
  }

  const handleClose = () => {
    setColumnName('')
    setInputValue('')
    handleSelectItems(checkedItems, false)
    setIsOpened(false)
  }

  const isSelected = (option: ISelect) => checkedItems.some((value) => value.id === option.id)
  const search = inputValue.trim().toLowerCase()
  const options = (perColumnListForFilters ?? []).filter(
    (option) => !search || String(option.name).toLowerCase().includes(search),
  )
  const showsEmptyMessage = isActiveColumn && !isLoadingFilters && !perColumnListForFilters?.length

  // Show the applied filter values when the filter changes.
  useSyncOnChange(filterTyping, (filter) => {
    if (item.ColumnName === filter.PropertyName) setCheckedItems(filter.CheckedItems)
  })

  return (
    <div style={{ width: advancedSettings ? columnsSizes : '100%' }}>
      <Combobox<ISelect>
        label={item.key || item.ColumnName}
        open={isOpened}
        disabled={isDisabled && !isActiveColumn}
        inputValue={inputValue}
        onInputChange={setInputValue}
        options={options}
        getOptionLabel={(option) => String(option.name)}
        isSelected={isSelected}
        onToggle={(option) =>
          selectValues(
            isSelected(option) ? checkedItems.filter((value) => value.id !== option.id) : [...checkedItems, option],
          )
        }
        selected={checkedItems}
        onRemove={(option) => selectValues(checkedItems.filter((value) => value.id !== option.id))}
        limitTags={advancedSettings ? 1 : 2}
        onFocus={handleOpen}
        onBlur={handleClose}
        loading={isActiveColumn && isLoadingFilters}
        showCheckbox
        emptyText={showsEmptyMessage ? translations?.filterAction?.emptyFieldData || 'Empty data' : null}
      />
    </div>
  )
}

export default memo(MultipleSelectCheckmarks)
