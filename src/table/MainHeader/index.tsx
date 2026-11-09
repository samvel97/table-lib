import type { ReactElement } from 'react'
import React from 'react'
import ColumnsCustomizer from './ColumnsCustomizer'
import {
  type IColumnConfigStructure,
  type IColumnHeaderStructure,
  type IColumnTotalStructure,
  type IComparisonType,
  type IFiltersTypes,
  type IPageSizes,
  type ISelect,
  type ISelected,
  type ItemFields,
} from '../../Models/table.models'
import CheckRows from './CheckRows'
import DeleteSvgIcon from '../../svgIcons/DeleteSvgIcon'
import EditSvgIcon from '../../svgIcons/EditSvgIcon'
import Filter from './Filter'
import Download from './Download'
import { CheckedItems, type ColumnTypeEnums } from '../../Models/table.enum'
import './style.scss'
interface IActionsHeader<T extends object> {
  columnsConfigStructure: IColumnConfigStructure<T>
  columnsHeaderStructure: IColumnHeaderStructure
  selectedPageCount?: ISelected
  multipleCheck?: boolean
  data: T[]
  checkedRows: T[]
  draggableColumns?: boolean
  filterColumns?: IComparisonType[]
  filterDataForRequest?: ItemFields[]
  isLoadingFilters?: boolean
  filtersTypes?: IFiltersTypes[]
  selectedType: string
  perColumnTotalCount?: number
  hasFilters?: boolean
  translations?: Record<string, any>
  perColumnListForFilters?: (string | ISelect)[]
  setColumnTotalStructures?(option: IColumnTotalStructure): void
  handleCheckAll(data?: T[]): void
  setColumnsConfigStructure?: (option: IColumnConfigStructure<T>) => void
  setColumnHeaderStructure?: (options: IColumnHeaderStructure) => void
  handleChangePage?(option: number): void
  handleEdit?(option: T): void
  handleDelete?(option: T[]): void
  handleSelectDataSize?(options: IPageSizes): void
  storeStructure?(): void
  unCheck(): void
  checkAllDataFromDb(): void
  getFilteredData?(option: ItemFields[], ColumnName: string, columnType?: ColumnTypeEnums): void
  getFilteredDataWithDebounce?(option: ItemFields[], ColumnName: string, columnType: ColumnTypeEnums): void
  getFilteredDataForTable?(option: ItemFields[]): void
  handleChangePagePerFilterField?(option: ItemFields): void
  getDownloadType?: (option: string, checkedRows: T[] | string) => void
  customHeaderAction?(option: T[] | string): ReactElement
  handleDeleteAll?: () => void
  staticAction?(): ReactElement
}
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
  return (
    <div className='G-justify-start G-table-actions-header'>
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
          <div className='G-center G-actions'>
            {checkedRows.length == 1 && handleEdit ? (
              <div className='G-flex G-edit' onClick={() => handleEdit(checkedRows[0])}>
                <div className='G-center G-edit-icon'>
                  <EditSvgIcon />
                  <span>{translations?.editAction || 'Edit'}</span>
                </div>
              </div>
            ) : null}
            {(selectedType === CheckedItems.SELECTED_ALL || checkedRows.length) && handleDelete ? (
              <div className='G-flex G-delete' onClick={() => handleDelete(checkedRows)}>
                <div className='G-center G-delete-icon'>
                  <DeleteSvgIcon />
                  <span>{translations?.deleteAction || 'Delete'}</span>
                </div>
              </div>
            ) : null}
            {/* {selectedType === CheckedItems.SELECTED_ALL || checkedRows.length
              ? customHeaderAction?.(checkedRows)
              : null} */}
            {selectedType === CheckedItems.SELECTED_ALL || checkedRows.length
              ? customHeaderAction?.(checkedRows)
              : null}
            {/* {handleDeleteAll && data.length > 1 && (
              <div className="G-flex G-delete" onClick={handleDeleteAll}>
                <div className="G-center G-delete-icon">
                  <DeleteSvgIcon />
                  <span>{translations?.deleteAllAction || "Delete All"}</span>
                </div>
              </div>
            )} */}
          </div>
        </>
      ) : null}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          flex: '1 1 auto',
        }}
      >
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

      {hasFilters ? (
        <Filter
          data={data}
          filterColumns={filterColumns}
          // perColumnListForFilters={perColumnListForFilters}
          filterDataForRequest={filterDataForRequest}
          // isLoadingFilters={isLoadingFilters}
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
        <div className='G-center G-download'>
          <Download
            selectedType={selectedType}
            checkedRows={checkedRows}
            translations={translations}
            getDownloadType={getDownloadType}
          />
        </div>
      ) : null}
    </div>
  )
}

export default MainHeader
