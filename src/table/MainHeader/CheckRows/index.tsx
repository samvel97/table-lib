import { memo, useState, type MouseEvent, type ReactElement } from 'react'
import { ChevronDown } from 'lucide-react'
import { CheckedItems } from '../../../Models/table.enum'
import Checkbox from '../../../components/checkbox'
import PopUp from '../../../components/popUp'

type Selection = 'all' | 'visible' | 'none'

interface ICheckRows<T extends object> {
  data: T[]
  checkedRows: T[]
  translations?: Record<string, any>
  handleCheckAll(data?: T[]): void
  unCheck(): void
  checkAllDataFromDb(): void
}

/** Select-all checkbox with a menu: all rows, visible rows, none. */
const CheckRows = <T extends object>({
  data,
  checkedRows,
  translations,
  handleCheckAll,
  unCheck,
  checkAllDataFromDb,
}: ICheckRows<T>) => {
  const [selection, setSelection] = useState<Selection>('none')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const texts = translations?.checkbox

  const options: { key: Selection; title: string; run(): void }[] = [
    { key: 'all', title: texts?.all || CheckedItems.SELECTED_ALL, run: checkAllDataFromDb },
    { key: 'visible', title: texts?.allVisible || CheckedItems.SELECTED_VISIBLE, run: () => handleCheckAll(data) },
    { key: 'none', title: texts?.none || CheckedItems.NONE, run: unCheck },
  ]

  const select = (option: (typeof options)[number]) => {
    option.run()
    setSelection(option.key)
    setAnchorEl(null)
  }

  const isChecked = selection === 'all' || (data.length > 0 && checkedRows.length === data.length)
  const toggle = () => {
    if (selection === 'none') {
      handleCheckAll()
      setSelection('visible')
    } else {
      unCheck()
      setSelection('none')
    }
  }

  return (
    <div className='brt-select-all'>
      <Checkbox
        isCheck={isChecked}
        isDisable={!data.length}
        onClick={toggle}
        customClass='G-checkbox'
        ariaLabel='Select all rows'
      />
      <PopUp
        ActiveIcon={ChevronDown}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClick={(event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
        handleClose={() => setAnchorEl(null)}
        style={{ padding: 4 }}
      >
        <ul className='brt-menu'>
          {options.map((option) => (
            <li key={option.key}>
              <button
                type='button'
                role='menuitemradio'
                aria-checked={selection === option.key}
                className={`brt-menu__item ${selection === option.key ? 'is-selected' : ''}`}
                onClick={() => select(option)}
              >
                {option.title}
              </button>
            </li>
          ))}
        </ul>
      </PopUp>
    </div>
  )
}

export default memo(CheckRows) as <T extends object>(props: ICheckRows<T>) => ReactElement
