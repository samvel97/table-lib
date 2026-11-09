import { type RowId } from '../../../../utils/rowId'
import React from 'react'
import { type ILinksList } from '../../../../Models/table.models'
import DropDown from './DropDown'
import SelfAction from './SelfAction'
interface IFreezedRightColumns<T extends object> {
  item: T
  checkedLink?: T
  links?: ILinksList[]
  freezedRightSide?: string
  RightSideIcon?: any
  RightSideSelfAction?: (option: number | string) => void
  getRowForDropdown(id: RowId): void
}
const FreezedRightColumns = <T extends object>({
  item,
  checkedLink,
  links,
  freezedRightSide,
  RightSideIcon,
  RightSideSelfAction,
  getRowForDropdown,
}: IFreezedRightColumns<T>) => {
  return (
    <>
      {freezedRightSide && freezedRightSide === 'dropdown' ? (
        <DropDown
          item={item}
          checkedLink={checkedLink}
          links={links}
          RightSideIcon={RightSideIcon}
          getRowForDropdown={getRowForDropdown}
        />
      ) : (
        <SelfAction
          item={item}
          RightSideIcon={RightSideIcon}
          RightSideSelfAction={RightSideSelfAction}
          getRowForDropdown={getRowForDropdown}
        />
      )}
    </>
  )
}

export default FreezedRightColumns
