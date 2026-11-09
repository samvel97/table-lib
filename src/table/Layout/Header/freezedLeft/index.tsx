import React from 'react'
import { StructureConfig } from '../../../../Models/table.enum'
import { type IColumnConfigStructure, type IColumnHeaderStructure } from '../../../../Models/table.models'
import FreezedItem from './FreezedItem'
interface IFreezedTopLeft<T extends object> {
  columnsHeaderStructure: IColumnHeaderStructure
  columnsConfigStructure: IColumnConfigStructure<T>
  multipleCheck?: boolean
  isStickyFirstColumn?: boolean
  columnMinWidth?: number
  headerColor?: string
  leftFreezedColumnWidth?: number
  handleSorting?(option: string): void
}
const FreezedHeaderLeft = <T extends object>({
  columnsHeaderStructure,
  columnsConfigStructure,
  multipleCheck,
  isStickyFirstColumn,
  columnMinWidth,
  headerColor,
  leftFreezedColumnWidth,
  handleSorting,
}: IFreezedTopLeft<T>) => {
  return (
    <ul
      className='G-data-table-header'
      style={{
        left: 0,
        zIndex: 1000,
        boxShadow: '7px 0px 9px -1px rgba(0,0,0,0.02)',
      }}
    >
      {isStickyFirstColumn && multipleCheck ? (
        <li
          style={{
            minWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : '60px',
            maxWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : '60px',

            backgroundColor: headerColor && headerColor,
          }}
        ></li>
      ) : null}
      {columnsHeaderStructure[StructureConfig.Freezed].items.length ? (
        <FreezedItem
          columnsHeaderStructure={columnsHeaderStructure}
          columnsConfigStructure={columnsConfigStructure}
          columnMinWidth={columnMinWidth}
          headerColor={headerColor}
          handleSorting={handleSorting}
        />
      ) : null}
    </ul>
  )
}

export default FreezedHeaderLeft
