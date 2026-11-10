import { StructureConfig } from '../../../../../Models/table.enum'
import {
  type IColumnConfig,
  type IColumnConfigStructure,
  type IColumnHeader,
  type IColumnHeaderStructure,
} from '../../../../../Models/table.models'

interface IFreezedHeader<T extends object> {
  columnsHeaderStructure: IColumnHeaderStructure
  columnsConfigStructure: IColumnConfigStructure<T>
  columnMinWidth?: number
  footerColor?: string
  aggregates?: any
  isLoadedData?: boolean
  handleArgChange?(columnName: string, type: string): void
}
const FreezedItems = <T extends object>({
  columnsConfigStructure,
  columnsHeaderStructure,
  columnMinWidth,
  footerColor,
  aggregates,
  isLoadedData,
  handleArgChange,
}: IFreezedHeader<T>) => {
  return (
    <>
      {columnsHeaderStructure[StructureConfig.Freezed].items.map((item: IColumnHeader, index: number) =>
        columnsConfigStructure[StructureConfig.Freezed].items.map((column: IColumnConfig<T>, indexx) => {
          if (index === indexx) {
            return (
              column.isVisible && (
                <li
                  style={{
                    ...column.customStyle,
                    maxWidth: columnMinWidth && columnMinWidth + 'px',
                    position: 'sticky',
                    backgroundColor: footerColor && footerColor,
                  }}
                  key={column.id}
                >
                  {column.footer?.(
                    columnsHeaderStructure[StructureConfig.Freezed].items[index] as any,
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
    </>
  )
}

export default FreezedItems
