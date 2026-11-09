import { ColumnTypeEnums } from 'beautiful-react-table'

/** Filter operators per column type, in the shape the PandaTech filters backend returns. */
export const filtersTypes = [
  {
    ColumnType: 'Base36Id',
    AggregateTypes: ['UniqueCount'],
    FilterTypes: ['Equal', 'NotEqual'],
    DefaultSearchType: 'Equal',
  },
  {
    ColumnType: 'Number',
    AggregateTypes: ['UniqueCount', 'Average', 'Min', 'Max'],
    FilterTypes: ['Equal', 'NotEqual', 'GreaterThan', 'GreaterThanOrEqual', 'LessThan', 'LessThanOrEqual', 'Between'],
    DefaultSearchType: 'Equal',
  },
  {
    ColumnType: 'Text',
    AggregateTypes: ['UniqueCount'],
    FilterTypes: ['Equal', 'NotEqual', 'StartsWith', 'EndsWith', 'Contains', 'NotContains'],
    DefaultSearchType: 'Equal',
  },
  {
    ColumnType: 'Currency',
    AggregateTypes: ['Sum', 'Average', 'Min', 'Max'],
    FilterTypes: ['Equal', 'NotEqual', 'GreaterThan', 'GreaterThanOrEqual', 'LessThan', 'LessThanOrEqual', 'Between'],
    DefaultSearchType: 'Equal',
  },
  {
    ColumnType: 'Date',
    AggregateTypes: ['Min', 'Max'],
    FilterTypes: ['Equal', 'NotEqual', 'GreaterThan', 'GreaterThanOrEqual', 'LessThan', 'LessThanOrEqual', 'Between'],
    DefaultSearchType: 'Between',
  },
]

/** Columns that can be filtered; `options` are loaded on demand via getFilteredData. */
export const filterColumns = [
  { ColumnName: 'Id', ColumnType: ColumnTypeEnums.Number, key: 'Id' },
  { ColumnName: 'Customer', ColumnType: ColumnTypeEnums.Text, key: 'Customer' },
  { ColumnName: 'City', ColumnType: ColumnTypeEnums.Text, key: 'City' },
  { ColumnName: 'Amount', ColumnType: ColumnTypeEnums.Currency, key: 'Amount' },
  { ColumnName: 'Status', ColumnType: ColumnTypeEnums.Text, key: 'Status' },
  { ColumnName: 'CreatedAt', ColumnType: ColumnTypeEnums.Date, key: 'Created' },
]

/** Every UI string the table renders. */
export const translations = {
  emptyData: 'No data',
  checkbox: { all: 'Select all', allVisible: 'Select visible rows', none: 'None' },
  customizationAction: {
    modalName: 'Customize columns',
    info: 'Drag columns to reorder or pin them, and toggle their visibility.',
    actionButtonName: 'Save',
    validationMessage: 'At least one column must stay visible.',
  },
  deleteAction: 'Delete',
  editAction: 'Edit',
  filterAction: {
    modalName: 'Filters',
    advanced: 'Advanced',
    confirmFilters: 'Apply',
    clearFilters: 'Clear all',
    clearDate: 'Clear',
    todayButton: 'Today',
    hour: 'Hour',
    min: 'Min',
    sec: 'Sec',
    loadMore: 'Load more',
    emptyFieldData: 'No values',
    blank: '(Blank)',
    emptyString: '(Empty)',
    from: 'From',
    to: 'To',
    validations: { isEmpty: 'Required', onlyNumbers: 'Numbers only', err: 'Invalid value', invalid: 'Invalid range' },
    emptyColumns: 'No columns to filter',
  },
  dowloadAction: 'Download',
  pagination: { from: 'of', show: 'Show', rows: 'rows', to: '-' },
}
