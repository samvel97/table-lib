import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { Check } from 'lucide-react'
import './style.scss'

interface ICheckbox {
  isCheck: boolean
  isDisable?: boolean
  onClick?(): void
  label?: string
  /** Accessible name when there is no visible label (e.g. row selection). */
  ariaLabel?: string
  customClass?: string
  children?: ReactNode
}

/** Custom-styled checkbox with `role="checkbox"`, focusable and toggled with Space or Enter. */
const Checkbox = ({ isCheck, isDisable, onClick, label, ariaLabel, customClass = '', children }: ICheckbox) => {
  const toggle = () => {
    if (!isDisable) onClick?.()
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    // Links inside the label keep their own behavior.
    if ((event.target as HTMLElement).tagName !== 'A') toggle()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      toggle()
    }
  }

  return (
    <div
      role='checkbox'
      aria-checked={isCheck}
      aria-disabled={isDisable || undefined}
      aria-label={ariaLabel ?? label ?? 'Select row'}
      tabIndex={isDisable ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`brt-checkbox ${isCheck ? 'is-checked' : ''} ${isDisable ? 'is-disabled' : ''} ${customClass}`}
    >
      <span className='brt-checkbox__box' aria-hidden='true'>
        {isCheck ? <Check size={14} strokeWidth={3} /> : null}
      </span>
      {children ?? (label ? <span className='brt-checkbox__label'>{label}</span> : null)}
    </div>
  )
}

export default Checkbox
