import React, { memo, useState } from 'react'
import { CheckedItems } from '../../../Models/table.enum'
import Checkbox from '../../../components/checkbox'
import PopUp from '../../../components/popUp'
import DropdownSvgIcon from '../../../svgIcons/DropdownSvgIcon'
import './style.scss'
interface ICheckRows<T extends object> {
  data: T[]
  checkedRows: T[]
  translations?: Record<string, any>
  handleCheckAll(data?: T[]): void
  unCheck(): void
  checkAllDataFromDb(): void
  handleClose?: () => void
}
const dropdownStyle = {
  height: '26px',
  display: 'flex',
  justifyContent: 'start',
  padding: 0,
  margin: 0,
  translate: -10,
  backgroundColor: 'white',
  minWidth: 10,
  border: 'none',
}
const CheckRows = <T extends object>({
  data,
  checkedRows,
  translations,
  handleCheckAll,
  unCheck,
  checkAllDataFromDb,
}: ICheckRows<T>) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(2)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [listForDropdown] = useState<object[]>([
    {
      id: 1,
      title: translations?.checkbox.all || CheckedItems.SELECTED_ALL,
      action: () => {
        checkAllDataFromDb()
        setSelectedItem(0)
      },
    },
    {
      id: 2,
      title: translations?.checkbox.allVisible || CheckedItems.SELECTED_VISIBLE,
      action: (data?: T[]) => {
        handleCheckAll(data)
        setSelectedItem(1)
      },
    },
    {
      id: 3,
      title: translations?.checkbox.none || CheckedItems.NONE,
      action: () => {
        unCheck()
        setSelectedItem(2)
      },
    },
  ])

  return (
    <>
      <div className='G-align-center G-check-all-component'>
        <Checkbox
          isCheck={selectedItem === 0 || checkedRows.length === data.length}
          isDisable={!data.length}
          onClick={
            selectedItem === 0 || selectedItem === 1
              ? () => {
                  unCheck()
                  setSelectedItem(2)
                }
              : () => {
                  handleCheckAll()
                  setSelectedItem(1)
                }
          }
          customClass='G-checkbox'
        />
      </div>
      <div className='G-check-all-dropdown'>
        <PopUp
          ActiveIcon={DropdownSvgIcon}
          style={dropdownStyle}
          open={open}
          anchorEl={anchorEl}
          handleClick={handleClick}
          handleClose={handleClose}
        >
          <ul className='G-dropdown-list'>
            {listForDropdown.map((item: any, index: any) => {
              return (
                <li
                  key={item.id}
                  onClick={() => {
                    item.action(data)
                    handleClose()
                  }}
                  style={{
                    color: index === selectedItem ? '#4844C5' : 'black',
                  }}
                >
                  {item.title}
                </li>
              )
            })}
          </ul>
        </PopUp>
      </div>
    </>
  )
}

export default memo(CheckRows)
