import './styles/index.scss'

export { default as Table } from './table'

export { StructureConfig, ColumnTypeEnums, ConditionalOperatorsEnums, CheckedItems } from './Models/table.enum'

export type {
  IProps as ITableProps,
  IProps,
  IColumnTotal,
  IColumns,
  IHeaders,
  ITotals,
  IColumnConfigStructure,
  IColumnHeaderStructure,
  IColumnTotalStructure,
  ITotalList,
  IFreezeProps,
  IColumnConfig,
  IPageSizes,
  ISelected,
  IColumnHeader,
  IColumn,
  IrowActions,
  IrowActions as IRowActions,
  ILinksList,
  ItemFields,
  IFilterDataForRequest,
  IComparisonType,
  IFiltersTypes,
  IOrdering,
  ISelect,
  TableIcon,
} from './Models/table.models'
