import { useMemo, useState } from 'react'
import {
  ColumnTypeEnums,
  StructureConfig,
  Table,
  type IColumnConfig,
  type IColumnConfigStructure,
  type IColumnHeader,
  type IColumnHeaderStructure,
  type ILinksList,
  type IPageSizes,
  type IrowActions,
  type ItemFields,
} from 'beautiful-react-table'
import { filterColumns, filtersTypes, translations } from './config'
import { generateOrders, type Order } from './data'

const ALL_ORDERS = generateOrders(57)

const PAGE_SIZES: IPageSizes[] = [
  { id: 1, count: 10 },
  { id: 2, count: 25 },
  { id: 3, count: 50 },
]

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface ColumnDef {
  title: string
  key: keyof Order
  render?: (order: Order) => React.ReactNode
  width: number
}

const COLUMNS: ColumnDef[] = [
  { title: 'Id', key: 'id', width: 70 },
  { title: 'Customer', key: 'customer', width: 170 },
  { title: 'City', key: 'city', width: 110 },
  { title: 'Amount', key: 'amount', width: 110, render: (order) => money.format(order.amount) },
  {
    title: 'Status',
    key: 'status',
    width: 110,
    render: (order) => <span className={`status status--${order.status}`}>{order.status}</span>,
  },
  {
    title: 'Created',
    key: 'createdAt',
    width: 110,
    render: (order) => new Date(order.createdAt).toLocaleDateString('en-GB'),
  },
]

const sortableTitle =
  (key: keyof Order, width: number, sort: { key: keyof Order; descending: boolean } | null) =>
  (_header: IColumnHeader, title: string, handleSorting?: (name: string) => void) => (
    <button type='button' className='header-button' style={{ width }} onClick={() => handleSorting?.(key)}>
      {title}
      {sort?.key === key ? (sort.descending ? ' ↓' : ' ↑') : ''}
    </button>
  )

const structure = <T,>(items: T[]) => ({
  [StructureConfig.Main]: { name: 'Columns', items },
  [StructureConfig.Freezed]: { name: 'Freezed', items: [] as T[] },
})

export default function App() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<IPageSizes>(PAGE_SIZES[0])
  const [sort, setSort] = useState<{ key: keyof Order; descending: boolean } | null>(null)
  const [filters, setFilters] = useState<ItemFields[]>([])
  const [log, setLog] = useState<string[]>([])
  const [isEmpty, setIsEmpty] = useState(false)

  const record = (message: string) => setLog((previous) => [message, ...previous].slice(0, 6))

  const headers: IColumnHeader[] = COLUMNS.map((column, index) => ({
    id: index + 1,
    order: index + 1,
    title: column.title,
  }))
  const configs: IColumnConfig<Order>[] = COLUMNS.map((column, index) => ({
    id: index + 1,
    title: sortableTitle(column.key, column.width, sort),
    setRow: (order?: Order) => (
      <div className='cell' style={{ width: column.width }}>
        {order ? (column.render?.(order) ?? String(order[column.key])) : null}
      </div>
    ),
    footer: (_header: IColumnHeader, title: string) => (
      <div className='cell' style={{ width: column.width }}>
        {column.key === 'amount' ? (
          <strong>{money.format(visibleRows.reduce((sum, row) => sum + row.amount, 0))}</strong>
        ) : title === 'Id' ? (
          'Total'
        ) : null}
      </div>
    ),
    isVisible: true,
  }))

  const [columnsConfigStructure, setColumnsConfigStructure] = useState<IColumnConfigStructure<Order>>(
    structure(configs),
  )
  const [columnsHeaderStructure, setColumnsHeaderStructure] = useState<IColumnHeaderStructure>(structure(headers))

  // Keep render functions fresh (sorting arrow, totals) while preserving the user's column layout.
  const liveConfig = useMemo<IColumnConfigStructure<Order>>(() => {
    const byId = new Map(configs.map((config) => [config.id, config]))
    const refresh = (items: IColumnConfig<Order>[]) =>
      items.map((item) => ({ ...byId.get(item.id)!, isVisible: item.isVisible }))
    return {
      Main: { ...columnsConfigStructure.Main, items: refresh(columnsConfigStructure.Main.items) },
      Freezed: { ...columnsConfigStructure.Freezed, items: refresh(columnsConfigStructure.Freezed.items) },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsConfigStructure, sort, page, pageSize, filters])

  const filteredRows = useMemo(() => {
    let rows = ALL_ORDERS
    for (const filter of filters) {
      const key = (filter.PropertyName.charAt(0).toLowerCase() + filter.PropertyName.slice(1)) as keyof Order
      if (filter.ColumnType === ColumnTypeEnums.Date && filter.Values.length === 2) {
        const [from, to] = filter.Values.map((value) => new Date(value).getTime())
        rows = rows.filter((row) => {
          const time = new Date(row.createdAt).getTime()
          return time >= from && time <= to
        })
        continue
      }
      const values = [...filter.Values, ...filter.CheckedItems].map((value) =>
        String(typeof value === 'object' ? value?.name : value),
      )
      if (values.length)
        rows = rows.filter((row) =>
          values.some((value) => String(row[key]).toLowerCase().includes(value.toLowerCase())),
        )
    }
    if (sort) {
      rows = [...rows].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * (sort.descending ? -1 : 1))
    }
    return rows
  }, [filters, sort])

  const visibleRows = isEmpty ? [] : filteredRows.slice((page - 1) * pageSize.count, page * pageSize.count)

  const rowActions: IrowActions[] = [
    {
      action: (event, item) => {
        event.stopPropagation()
        record(`Edit row ${(item as Order).id}`)
      },
    },
    {
      action: (event, item) => {
        event.stopPropagation()
        record(`Delete row ${(item as Order).id}`)
      },
    },
  ]

  const links: ILinksList[] = [
    { id: 1, name: 'Open order', action: (row: Order) => record(`Open order ${row.id}`) },
    { id: 2, name: 'Send invoice', action: (row: Order) => record(`Send invoice for ${row.id}`) },
  ]

  const optionsFor = (columnName: string) => {
    const key = (columnName.charAt(0).toLowerCase() + columnName.slice(1)) as keyof Order
    return [...new Set(ALL_ORDERS.map((order) => String(order[key])))].slice(0, 30)
  }
  const [filterColumnState, setFilterColumnState] = useState(filterColumns)

  return (
    <main className='page'>
      <header className='page__header'>
        <div>
          <h1>beautiful-react-table</h1>
          <p>Playground: sorting, filters, column customization, frozen rows, row actions, totals and pagination.</p>
        </div>
        <label className='toggle'>
          <input type='checkbox' checked={isEmpty} onChange={(event) => setIsEmpty(event.target.checked)} /> Empty state
        </label>
      </header>

      <Table<Order>
        data={visibleRows}
        isLoadedData={false}
        columnsConfigStructure={liveConfig}
        columnsHeaderStructure={columnsHeaderStructure}
        setColumnsConfigStructure={(next) => setColumnsConfigStructure(next)}
        setColumnHeaderStructure={(next) => setColumnsHeaderStructure(next)}
        storeStructure={() => record('Column layout saved')}
        draggableColumns
        multipleCheck
        isHoveredRow
        rowActions={rowActions}
        rowsFreezeAction
        links={links}
        freezedRightSide='dropdown'
        freezedRightSideVisible
        columnMinWidth={140}
        isEnableAggregates
        hasOrdering
        handleSorting={(key) => {
          setSort((previous) => ({
            key: key as keyof Order,
            descending: previous?.key === key ? !previous.descending : false,
          }))
          setPage(1)
        }}
        hasFilters
        filterColumns={filterColumnState}
        filtersTypes={filtersTypes}
        filterDataForRequest={filters}
        perColumnTotalCount={30}
        getFilteredData={(_options, columnName) => {
          if (!columnName || columnName === 'ClearAll') return
          setFilterColumnState((columns) =>
            columns.map((column) =>
              column.ColumnName === columnName ? { ...column, options: optionsFor(columnName) as [] } : column,
            ),
          )
        }}
        getFilteredDataWithDebounce={() => undefined}
        getFilteredDataForTable={(next) => {
          setFilters(next)
          setPage(1)
          record(`Applied ${next.length} filter(s)`)
        }}
        handleChangePagePerFilterField={() => undefined}
        getDownloadType={(format, rows) =>
          record(`Download ${format}: ${Array.isArray(rows) ? `${rows.length} rows` : rows}`)
        }
        handleEdit={(row) => record(`Edit ${(row as Order).id}`)}
        handleDelete={(rows) => record(`Delete ${Array.isArray(rows) ? rows.length : rows} row(s)`)}
        getRow={(row) => record(`Clicked row ${row.id}`)}
        translations={translations}
        pageSizeStructure={PAGE_SIZES}
        currentPage={page}
        pagesTotalCount={isEmpty ? 0 : filteredRows.length}
        selectedPageSizeId={pageSize}
        getPageRowsCountAndCurrentPage={(nextPage, nextSize) => {
          setPage(nextSize.count !== pageSize.count ? 1 : nextPage)
          setPageSize(nextSize)
        }}
        EmptyDataContainer={<div className='empty'>No orders match these filters.</div>}
      />

      <section className='log' aria-live='polite'>
        <h2>Events</h2>
        {log.length ? (
          <ul>
            {log.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        ) : (
          <p>Interact with the table to see callbacks here.</p>
        )}
      </section>
    </main>
  )
}
