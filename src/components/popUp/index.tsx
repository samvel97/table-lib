import { useId, type CSSProperties, type ElementType, type MouseEvent, type ReactElement } from 'react'
import { autoUpdate, flip, offset, shift, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'
import { FloatingLayer } from '../../ui/FloatingLayer'

interface IPopUp {
  children: ReactElement
  /** Trigger icon; `DisabledIcon`, when given, is shown while the menu is closed. */
  ActiveIcon?: ElementType
  DisabledIcon?: ElementType
  /** Icon after the label, e.g. a chevron. */
  EndIcon?: ElementType
  triggerClassName?: string
  ariaLabel?: string
  modalName?: string
  /** Extra styles for the trigger button. */
  style?: CSSProperties
  checkedLink?: any
  item?: any
  open: boolean
  anchorEl: HTMLElement | null
  handleClose: (event: MouseEvent<HTMLButtonElement>) => void
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void
  getRowForDropdown?: (option: any) => void
}

/** Trigger button plus a floating menu anchored to it (select-all menu, columns, row links). */
const PopUp = ({
  children,
  ActiveIcon,
  DisabledIcon,
  EndIcon,
  triggerClassName = '',
  ariaLabel,
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
  const id = useId()
  const buttonId = `brt-popup-button-${id}`
  const menuId = `brt-popup-menu-${id}`
  // Row dropdowns share one "checked" row; only the matching row's menu is open.
  const isOpen = checkedLink && item ? checkedLink.id === item.id && open : open
  const Icon = DisabledIcon && !isOpen ? DisabledIcon : ActiveIcon

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (next, event) => {
      if (!next) handleClose(event as unknown as MouseEvent<HTMLButtonElement>)
    },
    elements: { reference: anchorEl },
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'menu' })
  const { getFloatingProps } = useInteractions([dismiss, role])

  return (
    <>
      <button
        type='button'
        id={buttonId}
        aria-controls={isOpen ? menuId : undefined}
        aria-haspopup='true'
        aria-expanded={isOpen}
        onClick={(event) => {
          getRowForDropdown?.(item?.id)
          handleClick(event)
        }}
        className={`brt-popup-trigger ${triggerClassName}`}
        aria-label={ariaLabel}
        style={style}
      >
        {Icon ? (
          <span className='brt-popup-trigger__icon'>
            <Icon />
          </span>
        ) : null}
        {modalName ? <span className='brt-popup-trigger__label'>{modalName}</span> : null}
        {EndIcon ? (
          <span className={`brt-popup-trigger__icon brt-popup-trigger__chevron ${isOpen ? 'is-open' : ''}`}>
            <EndIcon />
          </span>
        ) : null}
      </button>
      {isOpen ? (
        <FloatingLayer
          floatingRef={refs.setFloating}
          style={floatingStyles}
          className='brt-popup-menu'
          props={{ id: menuId, 'aria-labelledby': buttonId, ...getFloatingProps() }}
        >
          {children}
        </FloatingLayer>
      ) : null}
    </>
  )
}

export default PopUp
