import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import { Autocomplete, Button, CircularProgress, Skeleton, TextField } from '@mui/material'
import React, { Fragment, useState } from 'react'
import { ColumnTypeEnums, ConditionalOperatorsEnums, type inputSize } from '../../../../../Models/table.enum'
import { type IComparisonType, type ItemFields } from '../../../../../Models/table.models'
import { containsOnlyNumbers } from '../../../../../utils'
import './style.scss'

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
  inputSizes,
  translations,
  filterColumns,
  handleChangeValue,
  handleSelectItems,
  setColumnName,
  setCheckedItemsLocaly,
  handleChangePagePerFilterField,
}: IModalForSingleField) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [val, setVal] = useState<string>('')
  const [errMessage, setErrMessage] = useState<string>('')
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const handleOpenList = () => {
    if (!isDisabled) {
      setColumnName(item.ColumnName)
      setIsOpened(true)
    }
  }
  const handleCloseList = () => {
    setColumnName('')
    setVal('')
    setIsOpened(false)
    if (item.ColumnType !== ColumnTypeEnums.Text && item.ColumnType !== ColumnTypeEnums.TikoType) {
      const newValues: number[] = []
      checkedItems.map((item) => newValues.push(+item))
      handleSelectItems(newValues, false)
      setCheckedItemsLocaly(newValues)
    } else {
      handleSelectItems(checkedItems, false)
      setCheckedItemsLocaly(checkedItems)
    }
  }
  const selectValue = (event: React.SyntheticEvent, value: any[]) => {
    const selectedValue: string[] = value.length ? [value.at(-1)] : []
    setCheckedItems(selectedValue)
    if (item.ColumnType !== ColumnTypeEnums.Text && item.ColumnType !== ColumnTypeEnums.TikoType) {
      const newValues: number[] = selectedValue.map((item: string) => +item)
      if (!isOpened) {
        handleSelectItems(newValues, false)
      }
      setCheckedItemsLocaly(newValues)
    } else {
      if (!isOpened) {
        handleSelectItems(value, false)
      }
      setCheckedItemsLocaly(value)
    }
  }
  const onChange = (newInputValue: string) => {
    if (
      item.ColumnType !== ColumnTypeEnums.Text &&
      item.ColumnType !== ColumnTypeEnums.TikoType &&
      !containsOnlyNumbers(newInputValue)
    ) {
      setErrMessage(translations?.filterAction.onlyNumbers || 'only numbers')
      setVal(newInputValue)
      return
    }
    setErrMessage('')
    handleChangeValue(newInputValue)
    setVal(newInputValue)
  }

  const isEmpty = () => {
    if (item.ColumnName === columnName && !isLoadingFilters && !perColumnListForFilters?.length && val.length) {
      if (item.ColumnType !== ColumnTypeEnums.Text && item.ColumnType !== ColumnTypeEnums.TikoType) {
        if (containsOnlyNumbers(val)) return true
      } else {
        return true
      }
    }

    return false
  }
  const rendData = () => {
    if (
      filterTyping.PropertyName === columnName &&
      errMessage === '' &&
      val.length &&
      perColumnListForFilters?.length
    ) {
      return perColumnListForFilters
    } else {
      return []
    }
  }
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
    const keepsText = item.ColumnType === ColumnTypeEnums.Text || item.ColumnType === ColumnTypeEnums.TikoType
    setCheckedItems(keepsText ? filter.CheckedItems : filter.CheckedItems.map((value: number) => String(value)))
  })
  return (
    <div
      style={{
        width: advancedSettings ? columnsSizes : '100%',
        position: 'relative',
      }}
    >
      <Autocomplete
        multiple
        id={item.ColumnName}
        noOptionsText={'Empty Data'}
        options={rendData()}
        value={checkedItems}
        open={isOpened}
        inputValue={val}
        onInputChange={(event, newInputValue) => onChange(newInputValue)}
        onChange={selectValue}
        getOptionLabel={(option) => option}
        disableCloseOnSelect
        autoFocus={false}
        fullWidth
        freeSolo
        size={inputSizes}
        filterOptions={(options) => options}
        sx={{ height: 'max-content' }}
        renderOption={({ key, ...optionProps }, option) => {
          if (option !== '')
            return (
              <Fragment key={key}>
                <li
                  {...optionProps}
                  style={{
                    marginLeft: 5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    minHeight: 40,
                    // borderBottom:
                    //   props['data-option-index' as keyof typeof props] === 0 &&
                    //   (perColumnListForFilters?.length ?? 0) > 1
                    //     ? '1px solid #DCDCDC'
                    //     : 'none',
                  }}
                >
                  {item.ColumnName === columnName && isLoadingFilters ? (
                    <div style={{ width: '100%' }}>
                      <Skeleton />
                    </div>
                  ) : (
                    <>
                      <div style={{ textAlign: 'start' }}>
                        {option === '' ? translations?.filterAction.emptyString : option}
                      </div>
                    </>
                  )}
                </li>
                {option === perColumnListForFilters?.at(-1) ? (
                  <li className='G-center' role='presentation' style={{ width: '100%' }}>
                    {perColumnTotalCount && perColumnListForFilters.length < perColumnTotalCount ? (
                      <Button
                        size='large'
                        style={{
                          margin: '0 16px',
                          width: 'auto',
                          backgroundColor: 'white',
                          color: 'black',
                          border: 'none',
                        }}
                        onClick={() => {
                          handleChangePagePerFilterField?.(nextPageOption)
                        }}
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
            backgroundColor: 'white',
            opacity: 1,
            top: filterColumns?.at(-1)?.ColumnName === item.ColumnName ? -55 : 40,
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

export default ModalForSingleField
