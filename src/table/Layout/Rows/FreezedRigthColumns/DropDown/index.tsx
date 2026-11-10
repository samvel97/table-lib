import { useState, type MouseEvent } from 'react'
import { Ellipsis } from 'lucide-react'
import type { ILinksList, TableIcon } from '../../../../../Models/table.models'
import PopUp from '../../../../../components/popUp'

interface IDropDown<T extends object> {
  item: T
  checkedLink?: T
  links?: ILinksList[]
  RightSideIcon?: TableIcon
  getRowForDropdown?(option: any): void
}

/** Row menu in the right frozen column: actions and links from `links`. */
const DropDown = <T extends object>({ checkedLink, links, item, RightSideIcon, getRowForDropdown }: IDropDown<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  return (
    <PopUp
      ActiveIcon={RightSideIcon || Ellipsis}
      ariaLabel='Row menu'
      checkedLink={checkedLink}
      item={item}
      getRowForDropdown={getRowForDropdown}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      handleClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
      }}
      handleClose={(event: MouseEvent<HTMLButtonElement>) => {
        event?.stopPropagation?.()
        setAnchorEl(null)
      }}
    >
      <ul className='brt-menu'>
        {links?.map((link, index) => (
          <li key={link.id ?? index}>
            {link.path ? (
              <a
                href={link.path}
                target='_blank'
                rel='noreferrer'
                role='menuitem'
                className='brt-menu__item'
                onClick={(event) => event.stopPropagation()}
              >
                {link.icon?.()}
                {link.name}
              </a>
            ) : (
              <button
                type='button'
                role='menuitem'
                className='brt-menu__item'
                onClick={(event) => {
                  event.stopPropagation()
                  link.action?.(checkedLink, index)
                  setAnchorEl(null)
                }}
              >
                {link.icon?.()}
                {link.name}
              </button>
            )}
          </li>
        ))}
      </ul>
    </PopUp>
  )
}

export default DropDown
