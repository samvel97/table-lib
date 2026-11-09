import { Button } from '@mui/material'
import React, { Fragment, memo, useState } from 'react'
import { type IComparisonType, type IFiltersTypes, type ISelect, type ItemFields } from '../../../Models/table.models'
import NativePopup from '../../../components/NativePopup/NativePopup'
import FilterSvgIcon from '../../../svgIcons/FilterSvgIcon'
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
    <div>
      <NativePopup
        ActiveIcon={FilterSvgIcon}
        isOpen={open}
        popupName={translations?.filterAction.modalName || 'Filter By'}
        handleOpen={handleOpen}
        handleClose={handleClose}
      >
        <div style={{ padding: '20px 0', width: 'clamp(330px, 35vw, 553px)' }}>
          <div style={{ width: '100%' }} className='G-justify-end'>
            <div
              role='button'
              aria-label='advanced setting'
              onClick={() => setAdvancedSettings((prev) => !prev)}
              style={{
                backgroundColor: 'white',
                width: 'auto',
                color: advancedSettings ? '#4844C5' : 'black',
                cursor: 'pointer',
                marginRight: 32,
                textDecoration: 'underline',
              }}
            >
              {translations?.filterAction.advanced}
            </div>
          </div>
          <ul
            className='P-Filters'
            style={{
              border: 'none',
              overflowX: 'auto',
              overflowY: 'auto',
              maxHeight: '50dvh',
              padding: '0px 32px 10px 32px',
            }}
          >
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
              <div>{translations?.filterAction.emptyColumns || 'Add Filters Columns'}</div>
            )}
          </ul>
          <div style={{ padding: 20, borderTop: '1px  solid #F3F6F8' }}>
            <Button
              size='medium'
              fullWidth
              disabled={isDisabled}
              style={{
                marginBottom: 8,
              }}
              onClick={handleSave}
            >
              {translations?.filterAction.confirmFilters || 'Submit'}
            </Button>
            <Button size='medium' variant='outlined' fullWidth onClick={handleCancel}>
              {translations?.filterAction.clearFilters || 'Clear All Filters'}
            </Button>
          </div>
        </div>
      </NativePopup>
    </div>
  )
}

export default memo(Filter)
