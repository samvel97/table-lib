import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  /** Error message; also marks the field invalid. */
  error?: string
  endAdornment?: ReactNode
  fullWidth?: boolean
}

/** Labeled text input with an optional error message and end adornment. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, endAdornment, fullWidth = true, className = '', id, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  return (
    <div className={`brt-field ${fullWidth ? 'brt-field--full' : ''} ${error ? 'brt-field--error' : ''} ${className}`}>
      {label ? (
        <label className='brt-field__label' htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className='brt-field__control'>
        <input
          ref={ref}
          id={inputId}
          className='brt-field__input'
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {endAdornment ? <span className='brt-field__adornment'>{endAdornment}</span> : null}
      </div>
      {error ? (
        <div id={errorId} className='brt-field__error' role='alert'>
          {error}
        </div>
      ) : null}
    </div>
  )
})
