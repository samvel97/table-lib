import React from 'react'
import {
  type IColumnConfig,
  type IColumnConfigStructure,
  type IColumnHeaderStructure,
} from '../../../Models/table.models'
import FreezedHeaderLeft from './freezedLeft'
import HeaderMain from './main'
import FreezedHeaderRight from './freezedRigth'

interface IHeader<T extends object> {
  columnsConfigStructure: IColumnConfigStructure<T>
  rightFreezeConfig?: IColumnConfig<T>[]
  columnsHeaderStructure: IColumnHeaderStructure
  multipleCheck?: boolean
  isStickyFirstColumn?: boolean
  columnMinWidth?: number
  headerColor?: string
  freezedRightSideVisible?: boolean
  leftFreezedColumnWidth?: number
  rightFreezedColumnWidth?: number
  hasOrdering?: boolean
  handleSorting?(option: string): void
}
const Header = <T extends object>({
  columnsConfigStructure,
  rightFreezeConfig,
  columnsHeaderStructure,
  multipleCheck,
  isStickyFirstColumn,
  columnMinWidth,
  headerColor,
  freezedRightSideVisible,
  leftFreezedColumnWidth,
  rightFreezedColumnWidth,
  handleSorting,
}: IHeader<T>) => {
  return (
    <>
      <FreezedHeaderLeft
        columnsConfigStructure={columnsConfigStructure}
        columnsHeaderStructure={columnsHeaderStructure}
        multipleCheck={multipleCheck}
        isStickyFirstColumn={isStickyFirstColumn}
        columnMinWidth={columnMinWidth}
        headerColor={headerColor}
        leftFreezedColumnWidth={leftFreezedColumnWidth}
        handleSorting={handleSorting}
      />
      <HeaderMain
        columnsConfigStructure={columnsConfigStructure}
        columnsHeaderStructure={columnsHeaderStructure}
        columnMinWidth={columnMinWidth}
        headerColor={headerColor}
        isStickyFirstColumn={isStickyFirstColumn}
        multipleCheck={multipleCheck}
        leftFreezedColumnWidth={leftFreezedColumnWidth}
        handleSorting={handleSorting}
      />
      {freezedRightSideVisible ? (
        <FreezedHeaderRight
          headerColor={headerColor}
          rightFreezedColumnWidth={rightFreezedColumnWidth}
          rightFreezeConfig={rightFreezeConfig}
        />
      ) : null}
    </>
  )
}
export default Header
