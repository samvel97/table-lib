import { Button } from '../../../ui/Button'
import { Fragment, memo, useState } from 'react'
import { type IComparisonType, type IFiltersTypes, type ISelect, type ItemFields } from '../../../Models/table.models'
import NativePopup from '../../../components/NativePopup/NativePopup'
import { SlidersHorizontal } from 'lucide-react'
import APIFilter from './FiltersPerColumn/apiFilter'
import { type ColumnTypeEnums } from '../../../Models/table.enum'

interface IFilter {
  data?: any
  filterColumns?: IComparisonType[]
  perColumnListForFilters?: (string | ISelect)[]
  filterDataForRequest?: ItemFields[]
  isLoadingFilters?: boolean
  filtersTypes?: IFiltersTypes[]
  perColumnTotalCount?: number
  translations?: Record<string, any>
  getFilter?(option: ItemFields[], ColumnName: string, columnType?: ColumnTypeEnums): void
  getFilteredDataWithDebounce?(option: ItemFields[], ColumnName: string, columnType: ColumnTypeEnums): void
  getFilteredDataForTable?(option: ItemFields[]): void
  handleChangePagePerFilterField?(option: ItemFields): void
}

const Filter = ({
  data,
  filterColumns,
  filterDataForRequest,
  filtersTypes,
  perColumnTotalCount,
  translations,
  handleChangePagePerFilterField,
  getFilter,
  getFilteredDataWithDebounce,
  getFilteredDataForTable,
}: IFilter) => {
  const [advancedSettings, setAdvancedSettings] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [open, setIsOpen] = useState<boolean>(false)
  const [collectedData, setCollectedData] = useState<ItemFields[]>([])
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
    setIsDisabled(false)
  }
  const handleCancel = () => {
    getFilter?.([], 'ClearAll')
    setIsOpen(false)
    getFilteredDataForTable?.([])
    setIsDisabled(false)
  }
  const handleSave = () => {
    getFilteredDataForTable?.(collectedData)
    handleClose()
  }
  const checkIsDisabled = (option: boolean) => {
    setIsDisabled(option)
  }
  const getFilteredData = (option: ItemFields, ColumnName: string, isOpened: boolean, columnType: ColumnTypeEnums) => {
    const updatedRow = filterDataForRequest ? [...filterDataForRequest] : []
    if (option.Values.length === 0) {
      const indexToRemove = updatedRow.findIndex((item) => item.PropertyName === option.PropertyName)
      if (indexToRemove !== -1) {
        updatedRow.splice(indexToRemove, 1)
      }
    } else {
      const existingItemIndex = updatedRow.findIndex((item) => item.PropertyName === option.PropertyName)
      if (existingItemIndex !== -1) {
        updatedRow[existingItemIndex] = option
      } else {
        updatedRow.push(option)
      }
    }
    if (isOpened) {
      getFilter?.(updatedRow, ColumnName, columnType)
    } else {
      getFilteredDataWithDebounce?.(updatedRow, ColumnName, columnType)
    }
    setCollectedData(updatedRow)
  }

  return (
    <NativePopup
      ActiveIcon={SlidersHorizontal}
      badge={filterDataForRequest?.length}
      isOpen={open}
      popupName={translations?.filterAction?.modalName || 'Filter By'}
      handleOpen={handleOpen}
      handleClose={handleClose}
    >
      <div className='brt-filters'>
        <div className='brt-filters__header'>
          <span className='brt-filters__title'>{translations?.filterAction?.modalName || 'Filter By'}</span>
          <button
            type='button'
            aria-pressed={advancedSettings}
            className={`brt-link-button ${advancedSettings ? 'is-active' : ''}`}
            onClick={() => setAdvancedSettings((prev) => !prev)}
          >
            {translations?.filterAction?.advanced || 'Advanced'}
          </button>
        </div>
        <ul className='P-Filters brt-filters__body'>
          {filterColumns?.length ? (
            filterColumns.map((item: IComparisonType, index) => {
              return (
                <Fragment key={index}>
                  {filtersTypes?.length &&
                    filtersTypes.map((type: any) => {
                      if (item.ColumnType === type.ColumnType)
                        return (
                          <Fragment key={item.ColumnName}>
                            <APIFilter
                              isLoadingFilters={item.isLoading}
                              advancedSettings={advancedSettings}
                              item={item}
                              data={data}
                              typeElem={type}
                              isDisabled={isDisabled}
                              perColumnTotalCount={perColumnTotalCount}
                              translations={translations}
                              handleChangePagePerFilterField={handleChangePagePerFilterField}
                              checkIsDisabled={checkIsDisabled}
                              filteredColumn={filterDataForRequest}
                              perColumnListForFilters={item.options}
                              getFilteredData={getFilteredData}
                              filterColumns={filterColumns}
                            />
                          </Fragment>
                        )
                    })}
                </Fragment>
              )
            })
          ) : (
            <li className='brt-filters__empty'>{translations?.filterAction?.emptyColumns || 'Add Filters Columns'}</li>
          )}
        </ul>
        <div className='brt-filters__footer'>
          <Button variant='outlined' onClick={handleCancel}>
            {translations?.filterAction?.clearFilters || 'Clear all'}
          </Button>
          <Button variant='contained' disabled={isDisabled} onClick={handleSave}>
            {translations?.filterAction?.confirmFilters || 'Apply'}
          </Button>
        </div>
      </div>
    </NativePopup>
  )
}

export default memo(Filter)
