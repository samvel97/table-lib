import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'text' | 'outlined' | 'contained'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'small' | 'medium'
  fullWidth?: boolean
}

/** Table button: text (default), outlined or contained. */
export function Button({
  variant = 'text',
  size = 'medium',
  fullWidth,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`brt-button brt-button--${variant} brt-button--${size} ${fullWidth ? 'brt-button--full' : ''} ${className}`}
      {...rest}
    />
  )
}
