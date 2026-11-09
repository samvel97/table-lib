import type { ComponentType, MemoExoticComponent, ReactElement, ReactNode, SVGProps } from 'react'

import { type ColumnTypeEnums } from './table.enum'

/** SVG icon component, e.g. an imported icon or `memo((props) => <svg {...props} />)`. */
export type TableIcon =
  ComponentType<SVGProps<SVGSVGElement>> | MemoExoticComponent<(props: SVGProps<SVGSVGElement>) => ReactElement>

/** Props of `<Table>`. Rows must have a unique `id`. */
export interface IProps<T extends object> {
  // ── Data ────────────────────────────────────────────────────────────────
  /** Rows of the current page. Each row needs a unique `id`. */
  data: T[]
  /** Column definitions (`Main` and pinned `Freezed` lists). Index `i` matches `columnsHeaderStructure`. */
  columnsConfigStructure: IColumnConfigStructure<T>
  /** Column headers, in the same order as `columnsConfigStructure`. */
  columnsHeaderStructure: IColumnHeaderStructure
  /** Shows skeleton rows while `data` is empty. */
  isLoadedData?: boolean
  /** Rendered when there are no rows. */
  EmptyDataContainer?: ReactNode
  /** UI texts (checkbox, filters, pagination, customization, download). See the README for the shape. */
  translations?: Record<string, any>

  // ── Pagination ──────────────────────────────────────────────────────────
  /** Page-size options shown in the footer select. */
  pageSizeStructure?: IPageSizes[]
  /** Total number of rows across all pages (despite the name). The footer is hidden when it is 0. */
  pagesTotalCount?: number
  currentPage?: number
  /** Currently selected page size, matched by `id` against `pageSizeStructure`. */
  selectedPageSizeId?: ISelected
  getPageRowsCountAndCurrentPage?(pageNumber: number, rowsCount: IPageSizes): void

  // ── Selection and row actions ───────────────────────────────────────────
  /** Checkbox column plus the "select visible / all / none" menu. */
  multipleCheck?: boolean
  /** Keeps the checkbox column sticky on the left. */
  isStickyFirstColumn?: boolean
  /** Shows `rowActions` (and the freeze button) when a row is hovered. */
  isHoveredRow?: boolean
  /** Up to three icon actions shown on hover; the defaults are edit and delete icons. */
  rowActions?: IrowActions[]
  /** Shows the "freeze row" button on hover (up to three rows can be frozen to the top). */
  rowsFreezeAction?: boolean
  FreezeIcon?: TableIcon
  /** Called when a row is clicked. */
  getRow?(option: T): void
  handleEdit?: (option: T) => void
  /** Receives the checked rows. */
  handleDelete?: (option: T[] | string) => void
  /** Custom element in the selection toolbar; receives the checked rows. */
  customHeaderAction?(option: T[] | string): ReactElement
  /** Static element always shown in the toolbar. */
  staticAction?(): ReactElement

  // ── Right side column ───────────────────────────────────────────────────
  /** Shows the sticky column on the right. */
  freezedRightSideVisible?: boolean
  /** `'dropdown'` shows the `links` menu; anything else calls `RightSideSelfAction(row)`. */
  freezedRightSide?: string
  /** Custom cells for the right sticky column (up to four). */
  rightFreezeConfig?: IColumnConfig<T>[]
  /** Menu items for `freezedRightSide='dropdown'`. */
  links?: ILinksList[]
  RightSideIcon?: TableIcon
  RightSideSelfAction?: (option: any) => void

  // ── Columns ─────────────────────────────────────────────────────────────
  /** Enables the "Customize columns" popup (show/hide, reorder, pin up to three). */
  draggableColumns?: boolean
  setColumnsConfigStructure?(option: IColumnConfigStructure<T>): void
  setColumnHeaderStructure?(options: IColumnHeaderStructure): void
  /** Called by the customization popup's Save button (e.g. to persist the layout). */
  storeStructure?(): void
  /** Maximum cell width in px when a column has no `width`. */
  columnMinWidth?: number
  /** Header titles receive `handleSorting`; call it with the column key to sort. */
  hasOrdering?: boolean
  handleSorting?(option: string): void

  // ── Filters ─────────────────────────────────────────────────────────────
  /** Shows the filters panel. */
  hasFilters?: boolean
  /** Filterable columns. Put loaded values in `options` (see README). */
  filterColumns?: IComparisonType[]
  /** Filter operators available per column type. */
  filtersTypes?: IFiltersTypes[]
  /** Currently applied filters (controlled). */
  filterDataForRequest?: ItemFields[]
  /** Number of values returned by the last "load values" request for the open column. */
  perColumnTotalCount?: number
  /** Request values for a column (called when a filter field opens or changes). */
  getFilteredData?(option: ItemFields[], ColumnName: string, columnType?: ColumnTypeEnums): void
  getFilteredDataWithDebounce?(option: ItemFields[], ColumnName: string, columnType: ColumnTypeEnums): void
  /** Apply filters to the table data. */
  getFilteredDataForTable?(option: ItemFields[]): void
  /** "Load more" values for the open filter column. */
  handleChangePagePerFilterField?(option: ItemFields): void

  // ── Totals footer ───────────────────────────────────────────────────────
  /** Shows the footer row rendered by each column's `footer`. */
  isEnableAggregates?: boolean
  aggregates?: any
  handleArgChange?(columnName: string, type: string): void

  // ── Toolbar ─────────────────────────────────────────────────────────────
  /** Shows the download menu; receives 'XLSX' | 'CSV' and the checked rows, or 'All' when every row is selected. */
  getDownloadType?: (option: string, checkedRows: T[] | string) => void

  // ── Appearance ──────────────────────────────────────────────────────────
  headerColor?: string
  footerColor?: string
  freezedLeftSideColor?: string
  freezedRightSideColor?: string
  headerHeight?: number
  footerHeight?: number
  leftFreezedColumnWidth?: number
  rightFreezedColumnWidth?: number

  // ── Deprecated (accepted for compatibility, no effect) ──────────────────
  /** @deprecated Ignored (also in 7.8.2). Pass values in `filterColumns[i].options` instead. */
  perColumnListForFilters?: (string | ISelect)[]
  /** @deprecated Ignored (also in 7.8.2). Use `filterColumns[i].isLoading` instead. */
  isLoadingFilters?: boolean
  /** @deprecated Not used by the table. */
  selectedPageCount?: ISelected
  /** @deprecated Not used by the table. */
  hoverdRowPosition?: number
  /** @deprecated Not used by the table. */
  setSortedData?(option: any): void
  /** @deprecated Not used by the table. */
  handleDeleteAll?: () => void
}

export interface ItemFields {
  PropertyName: string
  Values: any[]
  ComparisonType: string
  TypeForUi: string
  Search: string | number
  CheckedItems: any[]
  ColumnType: ColumnTypeEnums
}
export interface IOrdering {
  PropertyName: string
  Descending: boolean
}
export interface IFilterDataForRequest {
  Filters: ItemFields[]
  Order: any
}

export interface IFiltersTypes {
  ColumnType: string
  AggregateTypes: string[]
  FilterTypes: string[]
  DefaultSearchType: string
}

export interface IColumnTotal {
  id: string | number
  title: number | null
}

export interface IColumns<T extends object> {
  name: string
  items: IColumnConfig<T>[]
}
export interface IHeaders {
  name: string
  items: IColumnHeader[]
}
export interface ITotals {
  name: string
  items: IColumnTotal[]
}

export interface IColumnConfigStructure<T extends object> {
  Main: IColumns<T>
  Freezed: IColumns<T>
}
export interface IColumnHeaderStructure {
  Main: IHeaders
  Freezed: IHeaders
}
export interface IColumnTotalStructure {
  Main: ITotals
  Freezed: ITotals
}

export interface ITotalList {
  id: number
  title: string
}

export interface IFreezeProps<T extends object> {
  columnsConfigStructure: IColumnConfigStructure<T>
  columnMinWidth?: number
  item: T
  freezedLeftSideColor?: string
  isLoadedData?: boolean
}

export interface IComparisonType {
  key?: string
  ColumnName: string
  ColumnType: ColumnTypeEnums
  IsBold?: boolean
  options?: []
  isLoading?: boolean
}

// export interface ITranslations {
//   EmptyData:
// }
export interface IColumnConfig<T extends object> {
  id?: string | number
  columnName?: number | string
  title: any
  setRow: (data?: T, isLoadingData?: boolean) => any
  footer?: any
  isVisible: boolean
  customStyle?: object
  totalObject?: {
    valueKey: string
    isPrice: boolean
    title?: string
  }
  width?: number
}
export interface IPageSizes {
  id: number
  count: number
}

export interface ISelected {
  id: number
}

export interface IColumnHeader {
  id: string | number
  order: number
  title: string
  icon?: string
  aggregate?: string | number
  aggregateType?: string
}

export interface IColumn {
  id: number
  order: number
  name: string
}

export interface IrowActions {
  icon?: () => string | number | HTMLElement | React.ReactNode | null | any
  action: (e: any, item: object, index: number) => void
}

export interface ILinksList {
  id: number
  name: string
  path?: string
  icon?: () => string | number | HTMLElement | React.ReactNode | null | any
  action?(option: any, index: number): void
}

export interface IFiltersFieldsRef {
  list?: string[]
  totalCount?: number
  currentPage?: number
  columnName?: string
}

export interface ISelect {
  id: number
  name: string | number
}

export interface ICounterpartyTableColumns<T extends string> {
  ColumnName: string
  ColumnType: T
  key?: string
  options?: (string | ISelect)[]
}
