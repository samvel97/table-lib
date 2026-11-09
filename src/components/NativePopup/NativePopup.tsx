import {
  useState,
  type KeyboardEvent,
  type MemoExoticComponent,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from 'react'
import ClickOutside from '../click-outside'
import { useSyncOnChange } from '../../utils/useSyncOnChange'
import './style.scss'

interface IModalProps {
  ActiveIcon: MemoExoticComponent<(props: SVGProps<SVGSVGElement>) => ReactElement>
  children: ReactNode
  isOpen: boolean
  popupName: string
  handleOpen: () => void
  handleClose: () => void
}

/** Panel anchored under its trigger button, with fade-in / fade-out (used by the filters panel). */
const NativePopup = ({ ActiveIcon, isOpen, children, popupName, handleOpen, handleClose }: IModalProps) => {
  // Stays true until the fade-out animation ends, so the panel can animate out after `isOpen` turns false.
  const [isMounted, setIsMounted] = useState(false)
  useSyncOnChange(isOpen, (open) => {
    if (open) setIsMounted(true)
  })

  const animationClass = isOpen ? (isMounted ? 'fade-in' : '') : isMounted ? 'fade-out' : ''

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpen()
    }
  }

  return (
    <div className='G-wrapper-button'>
      <div
        role='button'
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={popupName}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        className='G-center G-popup-button'
      >
        <ActiveIcon className='G-icon' />
        <label className='G-label'>{popupName}</label>
      </div>
      {isOpen || isMounted ? (
        <ClickOutside onClickOutside={handleClose}>
          <div className='popup-overlay'>
            <div
              onAnimationEnd={(event) => {
                if (event.animationName === 'fadeOut') setIsMounted(false)
              }}
              className={`popup-content ${animationClass}`}
            >
              {children}
            </div>
          </div>
        </ClickOutside>
      ) : null}
    </div>
  )
}

export default NativePopup
