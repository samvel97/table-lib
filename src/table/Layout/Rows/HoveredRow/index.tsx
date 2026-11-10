import type { MouseEvent } from 'react'
import type { IrowActions, TableIcon } from '../../../../Models/table.models'
import { RowActions } from '../RowActions'

const MAX_FROZEN_ROWS = 3

interface IHoveredRow<T extends object> {
  rowActions?: IrowActions[]
  item: T
  index: number
  freezedRows: T[]
  FreezeIcon?: TableIcon
  rowsFreezeAction?: boolean
  freezeRow(event: MouseEvent<HTMLButtonElement>, index: number): void
}

/** Hover actions of a regular row. */
const HoveredRow = <T extends object>({
  rowActions,
  item,
  index,
  freezedRows,
  FreezeIcon,
  rowsFreezeAction,
  freezeRow,
}: IHoveredRow<T>) => (
  <li className='G-rows-icons'>
    <RowActions
      item={item}
      rowActions={rowActions}
      FreezeIcon={FreezeIcon}
      onToggleFreeze={
        rowsFreezeAction && freezedRows.length < MAX_FROZEN_ROWS ? (event) => freezeRow(event, index) : undefined
      }
    />
  </li>
)

export default HoveredRow
