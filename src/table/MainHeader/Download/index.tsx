import { memo, useState, type MouseEvent, type ReactElement } from 'react'
import { ChevronDown, Download as DownloadIcon, FileSpreadsheet, FileText } from 'lucide-react'
import PopUp from '../../../components/popUp'
import { CheckedItems } from '../../../Models/table.enum'

const FILE_TYPES = [
  { type: 'XLSX', Icon: FileSpreadsheet },
  { type: 'CSV', Icon: FileText },
]

interface IDownload<T extends object> {
  checkedRows: T[]
  selectedType: string
  translations?: Record<string, any>
  /** Receives the file type and either the checked rows or `'All'` when every row is selected. */
  getDownloadType: (type: string, checkedRows: T[] | string) => void
}

/** "Download" toolbar menu with XLSX and CSV options. */
const Download = <T extends object>({ checkedRows, selectedType, translations, getDownloadType }: IDownload<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const download = (type: string) => {
    getDownloadType(type, selectedType === CheckedItems.SELECTED_ALL ? 'All' : checkedRows)
    setAnchorEl(null)
  }

  return (
    <PopUp
      ActiveIcon={DownloadIcon}
      EndIcon={ChevronDown}
      modalName={translations?.dowloadAction || 'Download'}
      triggerClassName='brt-popup-trigger--outlined'
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      handleClick={(event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
      handleClose={() => setAnchorEl(null)}
    >
      <ul className='brt-menu'>
        {FILE_TYPES.map(({ type, Icon }) => (
          <li key={type}>
            <button type='button' role='menuitem' className='brt-menu__item' onClick={() => download(type)}>
              <Icon size={16} aria-hidden='true' />
              {type}
            </button>
          </li>
        ))}
      </ul>
    </PopUp>
  )
}

export default memo(Download) as <T extends object>(props: IDownload<T>) => ReactElement
