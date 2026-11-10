import { useState, type ElementType, type ReactNode } from 'react'
import ClickOutside from '../click-outside'
import { useSyncOnChange } from '../../utils/useSyncOnChange'
import './style.scss'

interface IModalProps {
  ActiveIcon: ElementType
  children: ReactNode
  isOpen: boolean
  popupName: string
  /** Small counter on the trigger, e.g. the number of active filters. Hidden when 0. */
  badge?: number
  handleOpen: () => void
  handleClose: () => void
}

/** Panel anchored under its trigger button, with fade-in / fade-out (used by the filters panel). */
const NativePopup = ({ ActiveIcon, isOpen, children, popupName, badge, handleOpen, handleClose }: IModalProps) => {
  // Stays true until the fade-out animation ends, so the panel can animate out after `isOpen` turns false.
  const [isMounted, setIsMounted] = useState(false)
  useSyncOnChange(isOpen, (open) => {
    if (open) setIsMounted(true)
  })

  const animationClass = isOpen ? 'is-entering' : 'is-leaving'

  return (
    // The trigger sits inside ClickOutside, so clicking it while open toggles instead of close-then-reopen.
    <ClickOutside onClickOutside={() => isOpen && handleClose()}>
      <div className='brt-panel-anchor'>
        <button
          type='button'
          aria-expanded={isOpen}
          onClick={isOpen ? handleClose : handleOpen}
          className='brt-popup-trigger brt-popup-trigger--outlined'
        >
          <span className='brt-popup-trigger__icon'>
            <ActiveIcon />
          </span>
          <span className='brt-popup-trigger__label'>{popupName}</span>
          {badge ? <span className='brt-badge'>{badge}</span> : null}
        </button>
        {isOpen || isMounted ? (
          <div
            role='dialog'
            aria-label={popupName}
            onAnimationEnd={(event) => {
              if (event.animationName === 'brt-panel-out') setIsMounted(false)
            }}
            className={`brt-panel ${animationClass}`}
          >
            {children}
          </div>
        ) : null}
      </div>
    </ClickOutside>
  )
}

export default NativePopup
