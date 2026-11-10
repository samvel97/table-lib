import type { ReactElement } from 'react'
import { Pencil, Trash } from 'lucide-react'
import { Button } from '../../ui/Button'
import {
  type IColumnConfigStructure,
  type IColumnHeaderStructure,
  type IComparisonType,
  type IFiltersTypes,
  type ItemFields,
} from '../../Models/table.models'
import { CheckedItems, type ColumnTypeEnums } from '../../Models/table.enum'
import CheckRows from './CheckRows'
import ColumnsCustomizer from './ColumnsCustomizer'
import Download from './Download'
import Filter from './Filter'
import './style.scss'

interface IActionsHeader<T extends object> {
  columnsConfigStructure: IColumnConfigStructure<T>
  columnsHeaderStructure: IColumnHeaderStructure
  multipleCheck?: boolean
  data: T[]
  checkedRows: T[]
  draggableColumns?: boolean
  filterColumns?: IComparisonType[]
  filterDataForRequest?: ItemFields[]
  filtersTypes?: IFiltersTypes[]
  selectedType: string
  perColumnTotalCount?: number
  hasFilters?: boolean
  translations?: Record<string, any>
  handleCheckAll(data?: T[]): void
  setColumnsConfigStructure?: (option: IColumnConfigStructure<T>) => void
  setColumnHeaderStructure?: (options: IColumnHeaderStructure) => void
  handleEdit?(option: T): void
  handleDelete?(option: T[]): void
  storeStructure?(): void
  unCheck(): void
  checkAllDataFromDb(): void
  getFilteredData?(option: ItemFields[], ColumnName: string, columnType?: ColumnTypeEnums): void
  getFilteredDataWithDebounce?(option: ItemFields[], ColumnName: string, columnType: ColumnTypeEnums): void
  getFilteredDataForTable?(option: ItemFields[]): void
  handleChangePagePerFilterField?(option: ItemFields): void
  getDownloadType?: (option: string, checkedRows: T[] | string) => void
  customHeaderAction?(option: T[] | string): ReactElement
  staticAction?(): ReactElement
}

/** Toolbar above the table: selection and bulk actions on the left, columns, filters and download on the right. */
const MainHeader = <T extends object>({
  columnsConfigStructure,
  columnsHeaderStructure,
  multipleCheck,
  data,
  checkedRows,
  draggableColumns,
  filterColumns,
  filterDataForRequest,
  filtersTypes,
  selectedType,
  perColumnTotalCount,
  hasFilters,
  translations,
  handleChangePagePerFilterField,
  unCheck,
  checkAllDataFromDb,
  handleCheckAll,
  setColumnsConfigStructure,
  setColumnHeaderStructure,
  handleEdit,
  handleDelete,
  storeStructure,
  getFilteredData,
  getFilteredDataWithDebounce,
  getFilteredDataForTable,
  getDownloadType,
  customHeaderAction,
  staticAction,
}: IActionsHeader<T>) => {
  const hasSelection = selectedType === CheckedItems.SELECTED_ALL || checkedRows.length > 0

  return (
    <div className='brt-toolbar' role='toolbar' aria-label='Table actions'>
      <div className='brt-toolbar__group'>
        {multipleCheck ? (
          <>
            <CheckRows
              data={data}
              checkedRows={checkedRows}
              translations={translations}
              handleCheckAll={handleCheckAll}
              unCheck={unCheck}
              checkAllDataFromDb={checkAllDataFromDb}
            />
            {checkedRows.length === 1 && handleEdit ? (
              <Button size='small' onClick={() => handleEdit(checkedRows[0])}>
                <Pencil size={15} aria-hidden='true' />
                {translations?.editAction || 'Edit'}
              </Button>
            ) : null}
            {hasSelection && handleDelete ? (
              <Button size='small' className='brt-button--danger' onClick={() => handleDelete(checkedRows)}>
                <Trash size={15} aria-hidden='true' />
                {translations?.deleteAction || 'Delete'}
              </Button>
            ) : null}
            {hasSelection ? customHeaderAction?.(checkedRows) : null}
          </>
        ) : null}
        {draggableColumns ? (
          <ColumnsCustomizer
            columnsConfigStructure={columnsConfigStructure}
            setColumnsConfigStructure={setColumnsConfigStructure}
            columnsHeaderStructure={columnsHeaderStructure}
            setColumnHeaderStructure={setColumnHeaderStructure}
            translations={translations}
            storeStructure={storeStructure}
          />
        ) : null}
        {staticAction?.()}
      </div>
      <div className='brt-toolbar__group'>
        {hasFilters ? (
          <Filter
            data={data}
            filterColumns={filterColumns}
            filterDataForRequest={filterDataForRequest}
            filtersTypes={filtersTypes}
            perColumnTotalCount={perColumnTotalCount}
            translations={translations}
            getFilteredDataWithDebounce={getFilteredDataWithDebounce}
            getFilter={getFilteredData}
            getFilteredDataForTable={getFilteredDataForTable}
            handleChangePagePerFilterField={handleChangePagePerFilterField}
          />
        ) : null}
        {getDownloadType ? (
          <Download
            selectedType={selectedType}
            checkedRows={checkedRows}
            translations={translations}
            getDownloadType={getDownloadType}
          />
        ) : null}
      </div>
    </div>
  )
}

export default MainHeader
