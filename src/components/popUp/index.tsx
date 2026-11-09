import { Button, Menu, ThemeProvider } from '@mui/material'
import { useId, type MouseEvent, type ReactElement } from 'react'
import './style.scss'
import { theme } from '../../utils/muiTheme'
interface IPopUp {
  children: ReactElement
  ActiveIcon?: any
  DisabledIcon?: any
  modalName?: string
  style?: any
  checkedLink?: any
  item?: any
  open: boolean
  anchorEl: any
  handleClose: (e: MouseEvent<HTMLButtonElement>) => void
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void
  getRowForDropdown?: (option: any) => void
}
const PopUp = ({
  children,
  ActiveIcon,
  DisabledIcon,
  modalName,
  style,
  checkedLink,
  item,
  open,
  anchorEl,
  handleClose,
  handleClick,
  getRowForDropdown,
}: IPopUp) => {
  // Unique per instance: every row renders a popup, so fixed ids were duplicated across the page.
  const id = useId()
  const buttonId = `brt-popup-button-${id}`
  const menuId = `brt-popup-menu-${id}`
  return (
    <>
      <ThemeProvider theme={theme}>
        <Button
          id={buttonId}
          aria-controls={open ? menuId : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={
            style
              ? style
              : {
                  margin: 0,
                  padding: '3px',
                  minWidth: 15,
                  border: 'none',
                  backgroundColor: 'rgba(0,0,0,0)',
                }
          }
        >
          <div
            className='G-center'
            onClick={() => {
              getRowForDropdown?.(item?.id)
            }}
          >
            <div className='G-center G-popUp-icon'>
              {ActiveIcon ? (
                DisabledIcon ? (
                  open ? (
                    <ActiveIcon />
                  ) : (
                    <DisabledIcon />
                  )
                ) : (
                  <ActiveIcon fill={!open ? '#4A4C56' : '#4844C5'} />
                )
              ) : null}
            </div>
            {modalName ? (
              <div
                style={{
                  marginLeft: 8,
                  color: open ? '#4844c5' : 'black',
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                {modalName}
              </div>
            ) : null}
          </div>
        </Button>
      </ThemeProvider>
      <Menu
        id={menuId}
        className='brt-root brt-popup-menu'
        sx={{ '& .MuiMenu-list': { padding: 0 } }}
        anchorEl={anchorEl}
        open={checkedLink && item ? (checkedLink.id === item.id ? open : false) : open}
        elevation={0}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
      >
        {children}
      </Menu>
    </>
  )
}

export default PopUp
