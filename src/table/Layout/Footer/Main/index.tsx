import React from 'react'
import {
  type IColumnConfig,
  type IColumnConfigStructure,
  type IColumnHeader,
  type IColumnHeaderStructure,
} from '../../../../Models/table.models'
import './style.scss'
import { StructureConfig } from '../../../../Models/table.enum'

interface IFooterMain<T extends object> {
  columnsHeaderStructure: IColumnHeaderStructure
  columnsConfigStructure: IColumnConfigStructure<T>
  columnMinWidth?: number
  footerColor?: string
  isStickyFirstColumn?: boolean
  leftFreezedColumnWidth?: number
  aggregates?: any
  isLoadedData?: boolean
  multipleCheck?: boolean
  handleArgChange?(columnName: string, type: string): void
}
const FooterMain = <T extends object>({
  columnsConfigStructure,
  columnMinWidth,
  footerColor,
  isStickyFirstColumn,
  leftFreezedColumnWidth,
  columnsHeaderStructure,
  aggregates,
  isLoadedData,
  multipleCheck,
  handleArgChange,
}: IFooterMain<T>) => {
  return (
    <ul className='G-data-table-footer' style={{ flex: 1, backgroundColor: footerColor && footerColor }}>
      {!isStickyFirstColumn && multipleCheck ? (
        <li
          className='G-Total-dropdown'
          style={{
            backgroundColor: footerColor && footerColor,
            minWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : 60,
          }}
        ></li>
      ) : null}
      {columnsHeaderStructure[StructureConfig.Main].items.map((item: IColumnHeader, index: number) =>
        columnsConfigStructure[StructureConfig.Main].items.map((column: IColumnConfig<T>, indexx: number) => {
          if (index === indexx) {
            return (
              column.isVisible && (
                <li
                  tabIndex={0}
                  style={{
                    ...column.customStyle,
                    maxWidth: (column.width || columnMinWidth) + 'px',
                    backgroundColor: footerColor && footerColor,
                  }}
                  key={column.id}
                  className='G-column-item'
                >
                  {column.footer?.(
                    columnsHeaderStructure[StructureConfig.Main].items[index] as any,
                    item.title,
                    handleArgChange,
                    aggregates,
                    isLoadedData,
                  )}
                </li>
              )
            )
          }
        }),
      )}
    </ul>
  )
}

export default FooterMain
