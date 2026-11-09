import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import { Autocomplete, Button, Checkbox, CircularProgress, Skeleton, TextField } from '@mui/material'
import React, { Fragment, type SyntheticEvent, memo, useState } from 'react'
// import Checkbox from "../../../../components/checkbox";
import { ColumnTypeEnums, type inputSize, numberFields } from '../../../../../Models/table.enum'
import { type IComparisonType, type ItemFields } from '../../../../../Models/table.models'
import { containsOnlyNumbers } from '../../../../../utils'

/** Values are requested 30 at a time; a full page means there may be more to load. */
const FILTER_VALUES_PAGE_SIZE = 30

interface IMultipleCHeck {
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
  setCheckedItemsLocaly(options: (string | number)[], closeCallBack?: () => void): void
  handleSelectItems: (option: (string | number)[], isClosed: boolean, fieldName?: string) => void
  setColumnName: (name: string) => void
  handleChangeValue: (value: string) => void
  handleChangePagePerFilterField?(option: ItemFields): void
}

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
  inputSizes,
  translations,
  filterColumns,
  setCheckedItemsLocaly,
  handleSelectItems,
  setColumnName,
  handleChangePagePerFilterField,
  handleChangeValue,
}: IMultipleCHeck) => {
  const emptyValue = translations?.filterAction.blank || 'Blank'
  const [checkedItems, setCheckedItems] = useState<(string | number)[]>([])

  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [val, setVal] = useState<string>('')
  const [errMessage, setErrMessage] = useState<string>('')

  const checkList = () => {
    if (item.ColumnName === columnName && perColumnListForFilters && errMessage === '') {
      const list =
        perColumnListForFilters.includes('') && perColumnListForFilters.includes(null)
          ? perColumnListForFilters.slice(1, -1)
          : perColumnListForFilters

      if (item.ColumnType === ColumnTypeEnums.EncryptedData) {
        const drawList = typeof list[0] === 'string' ? list : []

        return val ? drawList : checkedItems
      } else {
        return list.map((item) => (item === null || item === '' ? emptyValue : item))
      }
    } else return []
  }
  const onChange = (event: React.SyntheticEvent<Element, Event>, newInputValue?: any) => {
    if (numberFields.includes(item.ColumnType) && !containsOnlyNumbers(newInputValue)) {
      setErrMessage(translations?.filterAction.onlyNumbers || 'only numbers')
      setVal(newInputValue)

      return
    }
    if (item.ColumnType === ColumnTypeEnums.EncryptedData && !newInputValue) {
      setErrMessage('')
      setVal(newInputValue)
      return
    }
    setErrMessage('')
    handleChangeValue(newInputValue)
    setVal(newInputValue)
  }
  const selectValue = (event: SyntheticEvent<Element, Event>, value: (string | number)[]) => {
    setCheckedItems(value)
    const newValues: (number | string)[] = value.map((elem: number | string) => {
      return elem === emptyValue ? '' : elem
    })
    if (!isOpened) {
      handleSelectItems(newValues, false)
    }
    setCheckedItemsLocaly(newValues)
  }
  const handleOpenList = () => {
    if (!isDisabled) {
      if (item.ColumnType !== ColumnTypeEnums.EncryptedData) handleSelectItems([], true, item.ColumnName)
      setColumnName(item.ColumnName)
      setIsOpened(true)
    }
  }
  const handleCloseList = () => {
    setColumnName('')
    setVal('')
    setIsOpened(false)

    const newValues: (number | string)[] = checkedItems.map((elem: string | number) => {
      return elem === emptyValue ? '' : elem
    })

    handleSelectItems(newValues, false, item.ColumnName)
  }
  const getLabel = (options: string | number | null) => {
    if (typeof options !== 'string') {
      return options + ''
    }
    return options as string
  }
  const isEqual = (option: string | number | null, value: string | number) => {
    let numericValue: string | number | null = value
    if (numberFields.includes(item.ColumnType) && numericValue !== emptyValue) {
      numericValue = +value
    }
    if (option === numericValue) {
      return true
    }
    return false
  }
  const isEmpty = () => {
    if (item.ColumnName === columnName && !isLoadingFilters && !perColumnListForFilters?.length) {
      if (item.ColumnType !== ColumnTypeEnums.Text && item.ColumnType !== ColumnTypeEnums.TikoType) {
        if (item.ColumnType === ColumnTypeEnums.EncryptedData) {
          if (val.length) return true
        } else if (item.ColumnType === ColumnTypeEnums.Base36Id) {
          return true
        } else {
          if (containsOnlyNumbers(val)) return true
        }
      } else {
        return true
      }
    }
    return false
  }
  const drawOptionLabel = (option: string | number) => {
    return option
  }

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
      filter.CheckedItems.map((value: number | string) => {
        if (value === '') return emptyValue
        return keepsType ? value : String(value)
      }),
    )
  })

  return (
    <div
      style={{
        width: advancedSettings ? columnsSizes : '100%',
        position: 'relative',
      }}
    >
      {isOpened ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, )',
            zIndex: 999,
          }}
        ></div>
      ) : null}
      <Autocomplete
        multiple
        open={isOpened}
        id={item.ColumnName}
        limitTags={advancedSettings ? 1 : 2}
        options={checkList()}
        disabled={isDisabled && item.ColumnName !== columnName}
        disableCloseOnSelect
        onInputChange={(event, newInputValue) => onChange(event, newInputValue)}
        onChange={selectValue}
        getOptionLabel={getLabel}
        clearOnEscape
        value={checkedItems}
        inputValue={val}
        isOptionEqualToValue={isEqual}
        freeSolo
        size={inputSizes}
        sx={{ fontSize: '8px' }}
        filterOptions={(options) => options}
        renderOption={({ key, ...optionProps }, option, { selected }) => {
          return (
            <Fragment key={key}>
              <li
                {...optionProps}
                style={{
                  marginLeft: 5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  minHeight: 40,
                  borderBottom: option === emptyValue ? '1px solid silver' : 'none',
                }}
              >
                {item.ColumnName === columnName && isLoadingFilters ? (
                  <div style={{ width: '100%' }}>
                    <Skeleton />
                  </div>
                ) : (
                  <>
                    <div style={{ textAlign: 'start' }}>{drawOptionLabel(option)}</div>
                    <Checkbox
                      checked={selected}
                      sx={{
                        color: '#ACBCC3',
                      }}
                    />
                  </>
                )}
              </li>
              {option === perColumnListForFilters?.at(-1) ? (
                <li className='G-center' role='presentation' style={{ width: '100%' }}>
                  {perColumnTotalCount === FILTER_VALUES_PAGE_SIZE ? (
                    <Button
                      className='G-center'
                      size='large'
                      style={{
                        margin: '0 16px',
                        width: 'auto',
                        backgroundColor: 'white',
                        color: 'black',
                        border: 'none',
                      }}
                      onClick={() => handleChangePagePerFilterField?.(nextPageOption)}
                    >
                      {translations?.filterAction.loadMore || 'Load more'}
                    </Button>
                  ) : null}
                </li>
              ) : null}
            </Fragment>
          )
        }}
        renderInput={(params) => (
          <TextField
            name={item.ColumnName}
            onFocus={() => {
              setErrMessage('')
              handleOpenList()
            }}
            onBlur={() => {
              setErrMessage('')
              handleCloseList()
            }}
            error={!!errMessage}
            helperText={errMessage}
            {...params}
            label={item.key || item.ColumnName}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {item.ColumnName === columnName && isLoadingFilters && <CircularProgress color='inherit' size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {isEmpty() ? (
        <div
          className='G-align-center G-shadow-around'
          style={{
            borderRadius: 4,
            height: 56,
            padding: 15,
            color: 'silver',
            position: 'absolute',
            top: filterColumns?.at(-1)?.ColumnName === item.ColumnName ? -55 : 40,
            backgroundColor: 'white',
            opacity: 1,
            zIndex: 888888,
            width: '100%',
          }}
        >
          {translations?.filterAction.emptyFieldData || 'Empty data'}
        </div>
      ) : null}
    </div>
  )
}

export default memo(MultipleCheck)
