import { StructureConfig } from '../../../../Models/table.enum'
import {
  type IColumnConfig,
  type IColumnConfigStructure,
  type IColumnHeader,
  type IColumnHeaderStructure,
} from '../../../../Models/table.models'

interface ITopMain<T extends object> {
  columnsHeaderStructure: IColumnHeaderStructure
  columnsConfigStructure: IColumnConfigStructure<T>
  columnMinWidth?: number
  headerColor?: string
  isStickyFirstColumn?: boolean
  multipleCheck?: boolean
  leftFreezedColumnWidth?: number
  handleSorting?(option: string): void
}
const HeaderMain = <T extends object>({
  columnsHeaderStructure,
  columnsConfigStructure,
  columnMinWidth,
  headerColor,
  isStickyFirstColumn,
  multipleCheck,
  leftFreezedColumnWidth,
  handleSorting,
}: ITopMain<T>) => {
  return (
    <ul className='G-data-table-header' style={{ flex: 1, backgroundColor: headerColor && headerColor }}>
      {!isStickyFirstColumn && multipleCheck ? (
        <li
          style={{
            minWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : '60px',
            maxWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : '60px',
            backgroundColor: headerColor && headerColor,
          }}
        ></li>
      ) : null}
      {columnsHeaderStructure[StructureConfig.Main].items.map((item: IColumnHeader, index: number) =>
        columnsConfigStructure[StructureConfig.Main].items.map((column: IColumnConfig<T>, indexx: number) => {
          if (index === indexx) {
            return (
              column.isVisible && (
                <li
                  style={{
                    ...column.customStyle,
                    cursor: 'pointer',
                    maxWidth: (column.width || columnMinWidth) + 'px',
                    backgroundColor: headerColor && headerColor,
                  }}
                  key={column.id}
                  className='G-column-item'
                >
                  {column.title(
                    columnsHeaderStructure[StructureConfig.Main].items[index] as any,
                    item.title,
                    handleSorting,
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

export default HeaderMain
