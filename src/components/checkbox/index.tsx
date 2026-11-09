import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import './style.scss'

type CheckboxVariant = 'primary' | 'secondary'

interface ICheckbox {
  isCheck: boolean
  isDisable?: boolean
  onClick?(): void
  label?: string
  /** Accessible name when there is no visible label (e.g. row selection). */
  ariaLabel?: string
  customClass?: string
  variant?: CheckboxVariant
  children?: ReactNode
}

/**
 * Custom-styled checkbox. Rendered with `role="checkbox"`, focusable and toggled with Space or Enter,
 * so it works with a keyboard and screen readers (v7 was a clickable div only).
 */
const Checkbox = ({
  isCheck,
  isDisable,
  onClick,
  label,
  ariaLabel,
  customClass = '',
  variant = 'primary',
  children,
}: ICheckbox) => {
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
      aria-label={ariaLabel ?? label}
      tabIndex={isDisable ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`G-checkbox-component G-inline-flex G-align-center G-justify-start ${customClass}`}
    >
      <div
        className={`G-checkbox G-flex G-flex-column ${isDisable || isCheck ? 'G-active-checkbox' : ''} G-checkbox-${variant} ${
          isDisable ? 'G-disable-checkbox' : ''
        }`}
      />
      {children ?? (label ? <p>{label}</p> : null)}
    </div>
  )
}

export default Checkbox
