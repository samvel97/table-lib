import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  autoUpdate,
  flip,
  offset,
  size,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react'
import { FloatingLayer } from './FloatingLayer'
import { Skeleton, Spinner } from './feedback'

export interface ComboboxProps<Option> {
  label: string
  /** Controlled: the list is open while the field is focused (the parent decides). */
  open: boolean
  disabled?: boolean
  inputValue: string
  onInputChange(value: string): void
  options: Option[]
  getOptionLabel(option: Option): string
  isSelected(option: Option): boolean
  /** Toggle an option. */
  onToggle(option: Option): void
  /** Selected values shown as chips. */
  selected: Option[]
  onRemove(option: Option): void
  /** Chips shown before "+N". */
  limitTags?: number
  onFocus(): void
  onBlur(): void
  loading?: boolean
  error?: string
  showCheckbox?: boolean
  /** Enter with no highlighted option adds the typed text (free text values). */
  onAddCustom?(text: string): void
  /** Rendered under the options, e.g. a "Load more" button. */
  footer?: ReactNode
  /** Shown instead of the options when set. */
  emptyText?: string | null
  optionClassName?(option: Option): string | undefined
}

/** Accessible multi-select combobox with chips (replaces MUI Autocomplete in the filters). */
export function Combobox<Option>({
  label,
  open,
  disabled,
  inputValue,
  onInputChange,
  options,
  getOptionLabel,
  isSelected,
  onToggle,
  selected,
  onRemove,
  limitTags = 2,
  onFocus,
  onBlur,
  loading,
  error,
  showCheckbox,
  onAddCustom,
  footer,
  emptyText,
  optionClassName,
}: ComboboxProps<Option>) {
  const inputId = useId()
  const listId = `${inputId}-list`
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const listRef = useRef<(HTMLElement | null)[]>([])
  const showList = open && !disabled

  const { refs, floatingStyles, context } = useFloating({
    open: showList,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(320, availableHeight)}px`,
          })
        },
      }),
    ],
  })
  const role = useRole(context, { role: 'listbox' })
  const navigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  })
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, navigation])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (activeIndex !== null && options[activeIndex] !== undefined) {
        onToggle(options[activeIndex])
      } else if (onAddCustom && inputValue.trim()) {
        onAddCustom(inputValue.trim())
      }
    } else if (event.key === 'Backspace' && !inputValue && selected.length) {
      onRemove(selected[selected.length - 1])
    } else if (event.key === 'Escape') {
      ;(event.target as HTMLInputElement).blur()
    }
  }

  const visibleChips = open ? selected : selected.slice(0, limitTags)
  const hiddenCount = selected.length - visibleChips.length
  // Keep focus in the input while clicking inside the list, so blur only happens when leaving the field.
  const keepFocus = (event: { preventDefault(): void }) => event.preventDefault()

  return (
    <div className={`brt-combobox ${error ? 'brt-field--error' : ''} ${disabled ? 'is-disabled' : ''}`}>
      <label className='brt-field__label' htmlFor={inputId}>
        {label}
      </label>
      <div
        ref={refs.setReference}
        className={`brt-combobox__control ${showList ? 'is-open' : ''}`}
        onMouseDown={(event) => {
          if (event.target !== event.currentTarget) return
          event.preventDefault()
          ;(event.currentTarget.querySelector('input') as HTMLInputElement | null)?.focus()
        }}
      >
        {visibleChips.map((option, index) => (
          <span className='brt-chip' key={`${getOptionLabel(option)}-${index}`}>
            <span className='brt-chip__label'>{getOptionLabel(option)}</span>
            <button
              type='button'
              className='brt-chip__remove'
              aria-label={`Remove ${getOptionLabel(option)}`}
              disabled={disabled}
              onMouseDown={keepFocus}
              onClick={() => onRemove(option)}
            >
              ×
            </button>
          </span>
        ))}
        {hiddenCount > 0 ? <span className='brt-chip brt-chip--more'>+{hiddenCount}</span> : null}
        <input
          id={inputId}
          className='brt-combobox__input'
          value={inputValue}
          disabled={disabled}
          autoComplete='off'
          aria-invalid={error ? true : undefined}
          {...getReferenceProps({
            onFocus,
            onBlur,
            onChange: (event) => {
              onInputChange((event.target as HTMLInputElement).value)
              setActiveIndex(null)
            },
            onKeyDown: handleKeyDown,
            'aria-autocomplete': 'list',
            'aria-controls': showList ? listId : undefined,
          })}
        />
        {loading ? <Spinner size={16} /> : null}
      </div>
      {error ? (
        <div className='brt-field__error' role='alert'>
          {error}
        </div>
      ) : null}
      {showList ? (
        <FloatingLayer
          // eslint-disable-next-line react-hooks/refs -- setFloating is Floating UI's ref callback, not a ref read
          floatingRef={refs.setFloating}
          style={floatingStyles}
          className='brt-listbox'
          props={getFloatingProps({ id: listId, onMouseDown: keepFocus })}
        >
          {emptyText ? (
            <div className='brt-listbox__empty'>{emptyText}</div>
          ) : loading && !options.length ? (
            <div className='brt-listbox__loading'>
              <Skeleton />
              <Skeleton width='70%' />
              <Skeleton width='85%' />
            </div>
          ) : (
            options.map((option, index) => {
              const checked = isSelected(option)
              return (
                <div
                  key={`${getOptionLabel(option)}-${index}`}
                  ref={(node) => {
                    listRef.current[index] = node
                  }}
                  role='option'
                  aria-selected={checked}
                  className={`brt-option ${activeIndex === index ? 'is-active' : ''} ${optionClassName?.(option) ?? ''}`}
                  {...getItemProps({ onClick: () => onToggle(option) })}
                >
                  <span className='brt-option__label'>{getOptionLabel(option)}</span>
                  {showCheckbox ? <span className={`brt-option__check ${checked ? 'is-checked' : ''}`} /> : null}
                </div>
              )
            })
          )}
          {footer && !emptyText ? <div className='brt-listbox__footer'>{footer}</div> : null}
        </FloatingLayer>
      ) : null}
    </div>
  )
}
