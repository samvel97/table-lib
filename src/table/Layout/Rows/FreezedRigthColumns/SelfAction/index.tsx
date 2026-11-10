import { ExternalLink } from 'lucide-react'
import type { TableIcon } from '../../../../../Models/table.models'
import { getRowId, type RowId } from '../../../../../utils/rowId'

interface ISelfAction<T extends object> {
  item: T
  RightSideIcon?: TableIcon
  getRowForDropdown(id: RowId): void
}

/** Single action button in the right frozen column. */
const SelfAction = <T extends object>({ item, RightSideIcon, getRowForDropdown }: ISelfAction<T>) => (
  <button
    type='button'
    className='brt-icon-button'
    aria-label='Open row'
    onClick={() => getRowForDropdown(getRowId(item)!)}
  >
    {RightSideIcon ? <RightSideIcon /> : <ExternalLink size={16} />}
  </button>
)

export default SelfAction
