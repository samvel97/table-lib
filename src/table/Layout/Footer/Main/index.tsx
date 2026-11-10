import { type IColumnConfigStructure, type IColumnHeaderStructure } from '../../../../Models/table.models'
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
    <ul className='G-data-table-footer' style={{ flex: 1, backgroundColor: footerColor }}>
      {!isStickyFirstColumn && multipleCheck ? (
        <li
          className='G-footer-spacer'
          style={{ backgroundColor: footerColor, minWidth: leftFreezedColumnWidth ?? 60 }}
        />
      ) : null}
      {columnsConfigStructure[StructureConfig.Main].items.map((column, index) => {
        const header = columnsHeaderStructure[StructureConfig.Main].items[index]
        if (!header || !column.isVisible) return null
        return (
          <li
            key={column.id}
            className='G-column-item'
            style={{
              ...column.customStyle,
              maxWidth: (column.width || columnMinWidth) + 'px',
              backgroundColor: footerColor,
            }}
          >
            {column.footer?.(header as any, header.title, handleArgChange, aggregates, isLoadedData)}
          </li>
        )
      })}
    </ul>
  )
}

export default FooterMain
