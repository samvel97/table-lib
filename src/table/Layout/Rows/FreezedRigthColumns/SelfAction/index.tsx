import { getRowId, type RowId } from '../../../../../utils/rowId'
import React from 'react'
import LinkSvgIcon from '../../../../../svgIcons/LinkSvgIcon'

interface ISelfAction<T extends object> {
  item: T
  RightSideIcon?: any
  checkedLink?: T
  RightSideSelfAction?: (option: any) => void
  getRowForDropdown(id: RowId): void
}
const SelfAction = <T extends object>({ item, RightSideIcon, getRowForDropdown }: ISelfAction<T>) => {
  return (
    <div onClick={() => getRowForDropdown(getRowId(item)!)}>{!RightSideIcon ? <LinkSvgIcon /> : <RightSideIcon />}</div>
  )
}

export default SelfAction
