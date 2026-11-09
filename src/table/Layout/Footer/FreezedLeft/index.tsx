import { type IColumnConfigStructure, type IColumnHeaderStructure } from '../../../../Models/table.models'
import FreezedItems from './FreezedItems'
import './style.scss'
import { StructureConfig } from '../../../../Models/table.enum'
interface IFooterFreezedLeft<T extends object> {
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

const FooterFreezedLeft = <T extends object>({
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
}: IFooterFreezedLeft<T>) => {
  return (
    <ul
      className='G-data-table-footer'
      style={{
        left: 0,
        zIndex: 1000,
        boxShadow: '7px 0px 9px -1px rgba(0,0,0,0.02)',
      }}
    >
      {isStickyFirstColumn && multipleCheck ? (
        <li
          className='G-dropdown'
          style={{
            backgroundColor: footerColor && footerColor,
            minWidth: leftFreezedColumnWidth ? `${leftFreezedColumnWidth}px` : 60,
          }}
        ></li>
      ) : null}
      {columnsHeaderStructure[StructureConfig.Freezed].items.length ? (
        <FreezedItems
          columnsHeaderStructure={columnsHeaderStructure}
          columnsConfigStructure={columnsConfigStructure}
          columnMinWidth={columnMinWidth}
          footerColor={footerColor}
          aggregates={aggregates}
          isLoadedData={isLoadedData}
          handleArgChange={handleArgChange}
        />
      ) : null}
    </ul>
  )
}

export default FooterFreezedLeft
