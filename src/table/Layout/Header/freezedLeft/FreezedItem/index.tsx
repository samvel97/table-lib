import { StructureConfig } from '../../../../../Models/table.enum'
import {
  type IColumnConfigStructure,
  type IColumnHeaderStructure,
  type IColumnTotalStructure,
} from '../../../../../Models/table.models'

interface IFreezedHeader<T extends object> {
  columnsHeaderStructure: IColumnHeaderStructure
  columnsConfigStructure: IColumnConfigStructure<T>
  columnTotalStructures?: IColumnTotalStructure
  columnMinWidth?: number
  headerColor?: string
  handleSorting?(option: string): void
}
const FreezedItem = <T extends object>({
  columnsHeaderStructure,
  columnsConfigStructure,
  columnMinWidth,
  headerColor,
  handleSorting,
}: IFreezedHeader<T>) => {
  return (
    <>
      {columnsHeaderStructure[StructureConfig.Freezed].items.map((item, index) =>
        columnsConfigStructure[StructureConfig.Freezed].items.map((column, indexx) => {
          if (index === indexx) {
            return (
              column.isVisible && (
                <li
                  style={{
                    ...column.customStyle,
                    maxWidth: columnMinWidth && columnMinWidth + 'px',
                    backgroundColor: headerColor && headerColor,
                    position: 'sticky',
                  }}
                  key={column.id}
                >
                  {column.title(
                    columnsHeaderStructure[StructureConfig.Freezed].items[index] as any,
                    item.title,
                    handleSorting,
                  )}
                </li>
              )
            )
          }
        }),
      )}
    </>
  )
}
export default FreezedItem
