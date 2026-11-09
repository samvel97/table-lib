import React, { useState } from 'react'
import { type ILinksList } from '../../../../../Models/table.models'
import PopUp from '../../../../../components/popUp'
import LinkSvgIcon from '../../../../../svgIcons/LinkSvgIcon'
import './style.scss'
interface IDropDown<T extends object> {
  item: T
  checkedLink?: T
  links?: ILinksList[]
  RightSideIcon?: any
  getRowForDropdown?(option: any): void
}

const DropDown = <T extends object>({ checkedLink, links, item, RightSideIcon, getRowForDropdown }: IDropDown<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <>
      <PopUp
        ActiveIcon={RightSideIcon || LinkSvgIcon}
        checkedLink={checkedLink}
        item={item}
        getRowForDropdown={getRowForDropdown}
        open={open}
        anchorEl={anchorEl}
        handleClick={handleClick}
        handleClose={handleClose}
      >
        <div className='G-right-freezed-dropdown'>
          {links &&
            links.length &&
            links.map((el, ind) => {
              return (
                <li
                  key={ind}
                  onClick={(e) => {
                    e.stopPropagation()
                    el.action?.(checkedLink, ind)
                  }}
                  className='G-align-center G-item-element'
                  style={{
                    borderBottom: ind !== links.length - 1 ? '1px solid #ECECEC' : '',
                  }}
                >
                  {!el.path ? (
                    <p className='G-dropdown-list-style'>
                      <span>{el.name}</span>
                    </p>
                  ) : (
                    <a href={el.path} target='_blank' rel='noreferrer' className='G-dropdown-list-style'>
                      <span>{el.icon?.()}</span>
                      <span>{el.name}</span>
                    </a>
                  )}
                </li>
              )
            })}
        </div>
      </PopUp>
    </>
  )
}

export default DropDown
