import { Autocomplete, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ColumnTypeEnums, filterTypesUiHelper, type inputSize, numberFields } from '../../../../Models/table.enum'
import { type IComparisonType, type ISelect, type ItemFields } from '../../../../Models/table.models'
import { filterUiHelper } from '../../../../utils'
import BetweenDates from './UiTypes/BetweenDates'
import BetweenNumbers from './UiTypes/BetweenNumbers'
import ModalForSingleField from './UiTypes/ModalSingleField'
import MultipleCheck from './UiTypes/MultipleCheck'
import MultipleSelectCheckmarks from './UiTypes/MultipleSelectCheckmarks'
import PickDate from './UiTypes/PickDate'
import TextInputField from './UiTypes/TextInputField'

interface IPerField {
  item: IComparisonType
  data: any
  advancedSettings: boolean
  typeElem: any
  perColumnListForFilters?: (string | ISelect)[]
  filteredColumn?: ItemFields[]
  isLoadingFilters?: boolean
  isDisabled: boolean
  selectedItem?: ItemFields
  perColumnTotalCount?: number
  translations?: Record<string, any>
  filterColumns?: IComparisonType[]
  getFilteredData?(option: ItemFields, ColumnName: string, isOpened: boolean, columnType: ColumnTypeEnums): void
  checkIsDisabled(option: boolean): void
  handleChangePagePerFilterField?(option: ItemFields): void
}

const inputSizes: inputSize = 'small'
const columnsSizes = '66%'
const ComparisonType = '30%'

const APIFilter = ({
  item,
  perColumnListForFilters,
  typeElem,
  advancedSettings,
  filteredColumn,
  isLoadingFilters,
  isDisabled,
  perColumnTotalCount,
  translations,
  filterColumns,
  getFilteredData,
  checkIsDisabled,
  handleChangePagePerFilterField,
}: IPerField) => {
  const [filterTyping, setfilterTyping] = useState<ItemFields>({
    PropertyName: item.ColumnName,
    Search: '',
    Values: [],
    CheckedItems: [],
    ComparisonType: typeElem.DefaultSearchType,
    TypeForUi: typeElem.DefaultSearchType,
    ColumnType: item.ColumnType,
  })
  const [columnName, setColumnName] = useState<string>('')
  const uiType = filterUiHelper(typeElem.ColumnType, filterTyping.TypeForUi)
  const handlePropertyName = (value?: string) => {
    const typesList = [ColumnTypeEnums.TextCollection, ColumnTypeEnums.NumberCollection]
    if ((uiType === 2 && value === '') || typesList.includes(filterTyping.ColumnType)) {
      return ''
    }
    return filterTyping.PropertyName
  }
  const listWithContains = [
    ColumnTypeEnums.Text,
    ColumnTypeEnums.TikoType,
    ColumnTypeEnums.TextCollection,
    ColumnTypeEnums.NumberCollection,
  ]

  const handleChangeValue = (value: any) => {
    const columnFilter: ItemFields = {
      ...filterTyping,
      PropertyName: item.ColumnName,
      Values: [],
      ComparisonType:
        listWithContains.includes(item.ColumnType) && filterTyping.TypeForUi === 'Equal'
          ? 'Contains'
          : filterTyping.TypeForUi,
      Search: '',
    }
    if (value === 'invalid' && item.ColumnType === ColumnTypeEnums.Date) {
      checkIsDisabled(true)
      return
    }
    checkIsDisabled(false)
    if (value === '') {
      columnFilter.Values = []
      columnFilter.Search = ''
    } else {
      const idNumeric = numberFields.includes(item.ColumnType)
      columnFilter.Values[0] = idNumeric ? Number(value) : value
      columnFilter.Search = idNumeric ? Number(value) : value
    }

    const propertyName = handlePropertyName(value)
    getFilteredData?.(columnFilter, propertyName, false, filterTyping.ColumnType)
  }

  const handleChangeRange = (from: string, to: string) => {
    // Work on a copy: mutating the state object hid changes from React and from the consumer.
    const columnFilter: ItemFields = { ...filterTyping, Values: [...filterTyping.Values] }
    checkIsDisabled(false)

    if (from === '' && to === '') {
      columnFilter.Values = []
    } else {
      if (item.ColumnType !== ColumnTypeEnums.Date) {
        const numericFrom = +from
        const numericTo = +to
        columnFilter.Values = [numericFrom, numericTo]
      } else {
        columnFilter.Values = [from, to]
      }
    }

    getFilteredData?.(columnFilter, '', false, filterTyping.ColumnType)
  }

  const handleChangeValueSingleInputs = (value: any) => {
    // Work on a copy: mutating the state object hid changes from React and from the consumer.
    const columnFilter: ItemFields = { ...filterTyping, Values: [...filterTyping.Values] }

    if (value === 'invalid' && item.ColumnType === ColumnTypeEnums.Date) {
      checkIsDisabled(true)
      return
    }
    checkIsDisabled(false)
    if (value === '') {
      columnFilter.Values = []
      columnFilter.Search = ''
    } else {
      if (numberFields.includes(item.ColumnType)) {
        const numeric = +value
        columnFilter.Values[0] = numeric
        columnFilter.Search = numeric
      } else {
        columnFilter.Values[0] = value
        columnFilter.Search = value
      }
    }

    getFilteredData?.(columnFilter, '', false, filterTyping.ColumnType)
  }

  const selectComparisonType = (value: any) => {
    const columnFilter: ItemFields = {
      ...filterTyping,
      PropertyName: item.ColumnName,
      Search: '',
      Values: [],
      ComparisonType: value,
      TypeForUi: value,
    }
    setfilterTyping((prev) => {
      return {
        ...prev,
        Values: [],
        CheckedItems: [],
        ComparisonType: value,
        TypeForUi: value,
      }
    })

    if (value === 'IsEmpty') {
      columnFilter.Values = ['']
    } else if (value === 'IsTrue') {
      columnFilter.Values = [true]
    } else if (value === 'IsFalse') {
      columnFilter.Values = [false]
    }

    getFilteredData?.(columnFilter, '', false, filterTyping.ColumnType)
  }

  const selectedColumnName = (options: string) => {
    setColumnName(options)
  }

  const handleSelectItems = (checkedItems: any[], isOpened: boolean, _fieldName?: string) => {
    if (isOpened) {
      getFilteredData?.(
        {
          ...filterTyping,
          Values: [],
          ComparisonType: 'Contains',
          CheckedItems: [],
          Search: '',
        },
        handlePropertyName(),
        isOpened,
        filterTyping.ColumnType,
      )

      setfilterTyping((prev) => {
        return { ...prev, ComparisonType: filterTyping.TypeForUi }
      })
    } else {
      const filteredData = {
        ...filterTyping,
        Values: checkedItems,
        CheckedItems: checkedItems,
        Search: '',
      }
      if (item.ColumnType !== ColumnTypeEnums.Tags) {
        filteredData.ComparisonType = checkedItems.length > 1 ? 'In' : 'Equal'
      }

      getFilteredData?.(filteredData, '', false, filterTyping.ColumnType)
    }
  }

  const setCheckedItemsLocaly = (option: any[], _closeCallBack?: () => void) => {
    setfilterTyping((prev) => {
      return { ...prev, CheckedItems: option }
    })
  }

  const locale = localStorage.getItem('locale')
  const handlingLocale = locale === 'hy' ? 'hy-am' : locale
  const uiTypes = () => {
    const type = filterUiHelper(typeElem.ColumnType, filterTyping.TypeForUi)

    switch (type) {
      case 1:
        return (
          <MultipleCheck
            columnsSizes={columnsSizes}
            advancedSettings={advancedSettings}
            item={item}
            perColumnListForFilters={perColumnListForFilters}
            columnName={columnName}
            filterTyping={filterTyping}
            isLoadingFilters={isLoadingFilters}
            isDisabled={isDisabled}
            perColumnTotalCount={perColumnTotalCount}
            inputSizes={inputSizes}
            translations={translations}
            filterColumns={filterColumns}
            setCheckedItemsLocaly={setCheckedItemsLocaly}
            handleChangePagePerFilterField={handleChangePagePerFilterField}
            handleChangeValue={handleChangeValue}
            handleSelectItems={handleSelectItems}
            setColumnName={selectedColumnName}
          />
        )
      case 2:
        return (
          <ModalForSingleField
            item={item}
            columnsSizes={columnsSizes}
            advancedSettings={advancedSettings}
            perColumnListForFilters={perColumnListForFilters as string[]}
            columnName={columnName}
            filterTyping={filterTyping}
            isLoadingFilters={isLoadingFilters}
            perColumnTotalCount={perColumnTotalCount}
            isDisabled={isDisabled}
            inputSizes={inputSizes}
            translations={translations}
            filterColumns={filterColumns}
            setCheckedItemsLocaly={setCheckedItemsLocaly}
            handleChangeValue={handleChangeValue}
            handleSelectItems={handleSelectItems}
            setColumnName={selectedColumnName}
            handleChangePagePerFilterField={handleChangePagePerFilterField}
          />
        )
      case 3:
        return (
          <BetweenNumbers
            columnsSizes={columnsSizes}
            advancedSettings={advancedSettings}
            item={item}
            columnName={columnName}
            filterTyping={filterTyping}
            isDisabled={isDisabled}
            inputSizes={inputSizes}
            translations={translations}
            checkIsDisabled={checkIsDisabled}
            setColumnName={setColumnName}
            handleChangeRange={handleChangeRange}
          />
        )
      case 4:
        return (
          <MultipleSelectCheckmarks
            item={item}
            columnsSizes={columnsSizes}
            perColumnListForFilters={perColumnListForFilters as ISelect[]}
            columnName={columnName}
            isLoadingFilters={isLoadingFilters}
            isDisabled={isDisabled}
            advancedSettings={advancedSettings}
            filterTyping={filterTyping}
            inputSizes={inputSizes}
            translations={translations}
            filterColumns={filterColumns}
            setCheckedItemsLocaly={setCheckedItemsLocaly}
            setColumnName={selectedColumnName}
            handleSelectItems={handleSelectItems}
          />
        )
      case 5:
        return (
          <BetweenDates
            columnsSizes={columnsSizes}
            advancedSettings={advancedSettings}
            item={item}
            columnName={columnName}
            filterTyping={filterTyping}
            isDisabled={isDisabled}
            inputSizes={inputSizes}
            translations={translations}
            locale={handlingLocale}
            checkIsDisabled={checkIsDisabled}
            setColumnName={setColumnName}
            handleChangeRange={handleChangeRange}
          />
        )
      case 6:
        return (
          <PickDate
            columnsSizes={columnsSizes}
            advancedSettings={advancedSettings}
            item={item}
            columnName={columnName}
            filterTyping={filterTyping}
            isDisabled={isDisabled}
            inputSizes={inputSizes}
            translations={translations}
            locale={handlingLocale}
            setColumnName={setColumnName}
            handleChangeValue={handleChangeValueSingleInputs}
          />
        )
      case 7:
        return (
          <TextInputField
            item={item}
            inputSizes={inputSizes}
            isDisabled={isDisabled}
            filterTyping={filterTyping}
            columnName={columnName}
            columnsSizes={columnsSizes}
            translations={translations}
            advancedSettings={advancedSettings}
            setColumnName={setColumnName}
            handleChangeValue={handleChangeValue}
          />
        )
    }
  }

  useEffect(() => {
    if (filteredColumn?.length)
      filteredColumn?.map((column) => {
        if (column.PropertyName === item.ColumnName) {
          setfilterTyping(column)
        }
      })
  }, [filteredColumn])

  return (
    <li style={{ marginTop: 8 }}>
      {filterUiHelper(typeElem.ColumnType, filterTyping.TypeForUi) == 5 ||
      filterUiHelper(typeElem.ColumnType, filterTyping.TypeForUi) == 3 ? (
        <div style={{ margin: '15px 0 10px 0', fontSize: 14 }}>{item.key || item.ColumnName}</div>
      ) : null}
      <div className='G-justify-between'>
        {advancedSettings ? (
          <div
            style={{
              width: advancedSettings ? ComparisonType : '100%',
              position: 'relative',
            }}
          >
            <Autocomplete
              value={filterTypesUiHelper[filterTyping.TypeForUi as keyof typeof filterTypesUiHelper]}
              onChange={(event: any, newValue: string | null) => {
                selectComparisonType(newValue)
              }}
              inputValue={filterTypesUiHelper[filterTyping.TypeForUi as keyof typeof filterTypesUiHelper]}
              disablePortal
              disableClearable
              disabled={isDisabled}
              size={inputSizes}
              sx={{ ':hover': { cursor: 'pointer' } }}
              id='controllable-states-demo'
              options={typeElem.FilterTypes}
              renderOption={({ key, ...optionProps }, option) => {
                return (
                  <li
                    key={key}
                    {...optionProps}
                    style={{
                      padding: '6px 16px',
                    }}
                  >
                    {filterTypesUiHelper[option as keyof typeof filterTypesUiHelper]}
                  </li>
                )
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    caretColor: 'transparent',
                  }}
                />
              )}
            />
          </div>
        ) : null}
        {uiTypes()}
      </div>
    </li>
  )
}

export default APIFilter
