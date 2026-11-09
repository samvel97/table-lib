import { useSyncOnChange } from '../../../../../utils/useSyncOnChange'
import { Autocomplete, CircularProgress, TextField, Checkbox, Skeleton } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import { type SyntheticEvent, memo, useState } from 'react'
import { type inputSize } from '../../../../../Models/table.enum'
import { type IComparisonType, type ISelect, type ItemFields } from '../../../../../Models/table.models'

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

const MultipleSelectCheckmarks = ({
  item,
  columnsSizes,
  isDisabled,
  perColumnListForFilters,
  columnName,
  isLoadingFilters,
  advancedSettings,
  filterTyping,
  inputSizes,
  translations,
  filterColumns,
  setCheckedItemsLocaly,
  handleSelectItems,
  setColumnName,
}: IMultipleSelectCheckmarks) => {
  const [checkedItems, setCheckedItems] = useState<ISelect[]>([])
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const handleChange = (value: ISelect[]) => {
    setCheckedItems(value)
    if (!isOpened) {
      handleSelectItems(value, false)
    }
    setCheckedItemsLocaly(value)
  }

  const handleOpenList = () => {
    if (!isDisabled) {
      setColumnName(item.ColumnName)
      handleSelectItems([], true)
      setIsOpened(true)
    }
  }
  const handleCloseList = () => {
    setColumnName('')
    handleSelectItems(checkedItems, false)
    setIsOpened(false)
  }
  const isEmpty = item.ColumnName === columnName && !isLoadingFilters && !perColumnListForFilters?.length

  // Free text (freeSolo) arrives as a string; numeric names were rendered as "[object Object]" in v7.
  const getLabel = (option: string | ISelect) => (typeof option === 'string' ? option : String(option.name))
  const optionId = (option: string | ISelect) => (typeof option === 'string' ? option : option.id)

  // Show the applied filter values when the filter changes.
  useSyncOnChange(filterTyping, (filter) => {
    if (item.ColumnName === filter.PropertyName) setCheckedItems(filter.CheckedItems)
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
            backgroundColor: 'transparent',
            zIndex: 999,
          }}
        ></div>
      ) : null}
      <FormControl fullWidth size={inputSizes}>
        <Autocomplete
          id={item.ColumnName}
          multiple
          open={isOpened}
          limitTags={advancedSettings ? 1 : 2}
          options={perColumnListForFilters ?? []}
          value={checkedItems}
          onChange={(event: SyntheticEvent<Element, Event>, value: any[]) => {
            handleChange(value)
          }}
          getOptionLabel={getLabel}
          // onOpen={handleOpenList}
          // onClose={handleCloseList}
          isOptionEqualToValue={(option, value) => optionId(option) === optionId(value)}
          disableCloseOnSelect
          size={inputSizes}
          disabled={isDisabled && item.ColumnName !== columnName}
          freeSolo
          renderOption={({ key, ...optionProps }, option, { selected }) => {
            // MUI passes key inside props; React 19 warns when it is spread, so pass it explicitly.
            return (
              <li
                key={key}
                {...optionProps}
                style={{
                  marginLeft: 5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  minHeight: 40,
                  borderBottom: getLabel(option) === '' ? '1px solid silver' : 'none',
                }}
              >
                {item.ColumnName === columnName && isLoadingFilters ? (
                  <div style={{ width: '100%' }}>
                    <Skeleton />
                  </div>
                ) : (
                  <>
                    <div style={{ textAlign: 'start' }}>{getLabel(option)}</div>
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  </>
                )}
              </li>
            )
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              name={item.ColumnName}
              label={item.key || item.ColumnName}
              onFocus={handleOpenList}
              onBlur={handleCloseList}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {item.ColumnName === columnName && isLoadingFilters && (
                      <CircularProgress color='inherit' size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </FormControl>
      {isEmpty ? (
        <div
          className='G-align-center G-shadow-around'
          style={{
            borderRadius: 4,
            height: 56,
            padding: 15,
            color: 'silver',
            position: 'absolute',
            backgroundColor: 'white',
            top: filterColumns?.at(-1)?.ColumnName === item.ColumnName ? -55 : 40,
            opacity: 1,
            zIndex: 888888,
            width: '100%',
          }}
        >
          {translations?.filterAction?.emptyFieldData || 'Empty data'}
        </div>
      ) : null}
    </div>
  )
}

export default memo(MultipleSelectCheckmarks)

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
