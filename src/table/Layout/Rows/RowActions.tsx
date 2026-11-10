import type { MouseEvent } from 'react'
import { Pencil, Pin, PinOff, Trash } from 'lucide-react'
import type { IrowActions, TableIcon } from '../../../Models/table.models'

const MAX_ROW_ACTIONS = 3
const ICON_SIZE = 16

interface IRowActions<T extends object> {
  item: T
  rowActions?: IrowActions[]
  /** Renders the freeze button when set. */
  onToggleFreeze?(event: MouseEvent<HTMLButtonElement>): void
  /** The row is already frozen to the top: the button unfreezes it. */
  isFrozen?: boolean
  FreezeIcon?: TableIcon
}

/** Action buttons shown at the end of a row on hover: up to three row actions plus freeze / unfreeze. */
export function RowActions<T extends object>({
  item,
  rowActions,
  onToggleFreeze,
  isFrozen,
  FreezeIcon,
}: IRowActions<T>) {
  const DefaultFreezeIcon = isFrozen ? PinOff : Pin
  return (
    <div className='G-icons-group'>
      {rowActions?.slice(0, MAX_ROW_ACTIONS).map((action, index) => {
        const DefaultIcon = index === 0 ? Pencil : Trash
        return (
          <button
            type='button'
            key={index}
            className={`brt-icon-button ${index > 0 && !action.icon ? 'brt-icon-button--danger' : ''}`}
            aria-label={action.icon ? `Row action ${index + 1}` : index === 0 ? 'Edit row' : 'Delete row'}
            onClick={(event) => action.action(event, item, index)}
          >
            {action.icon ? <action.icon /> : <DefaultIcon size={ICON_SIZE} />}
          </button>
        )
      })}
      {onToggleFreeze ? (
        <button
          type='button'
          className='brt-icon-button'
          aria-label={isFrozen ? 'Unfreeze row' : 'Freeze row'}
          onClick={onToggleFreeze}
        >
          {FreezeIcon ? <FreezeIcon /> : <DefaultFreezeIcon size={ICON_SIZE} />}
        </button>
      ) : null}
    </div>
  )
}
