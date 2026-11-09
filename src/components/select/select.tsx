import { useLayoutEffect, useRef, useState, type ElementType, type KeyboardEvent, type MouseEvent } from 'react'
import ClickOutside from '../click-outside'
import LinkSvgIcon from '../../svgIcons/LinkSvgIcon'
import './style.scss'

type Option = Record<string, any>

interface ISelect<T extends Option> {
  optionsList: T[]
  value: string | number | null
  /** Option field shown as the label. */
  selectedNameKey: string
  /** Option field compared with `value`. */
  selectedValueKey: string
  customClass?: string
  placeholder?: string
  selectedIconKey?: string
  maxHeight?: number
  isClear?: boolean
  label?: string
  isImage?: boolean
  isOpenList?: boolean
  setIsOpenList?(): void
  onChange?(value: T | null): void
  ListItemSvg?: ElementType
  haveIcon?: boolean
  ButtonSvg?: ElementType
  /** Passed to an option's `action(rowItem)` when it is chosen (used by row link menus). */
  rowItem?: unknown
  typesObject?: Record<string, T>
}

const LIST_HEIGHT = 320

/** Lightweight dropdown used for the page-size picker, downloads and row actions. */
function Select<T extends Option>({
  optionsList,
  selectedNameKey,
  selectedValueKey,
  placeholder,
  value,
  onChange,
  isOpenList,
  setIsOpenList,
  ListItemSvg,
  maxHeight = 300,
  ButtonSvg,
  isClear,
  label,
  selectedIconKey,
  haveIcon,
  rowItem,
  typesObject,
  customClass = '',
  isImage = false,
}: ISelect<T>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [opensUpward, setOpensUpward] = useState(true)

  const options = typesObject ? optionsList.map((key) => typesObject[key as unknown as string]) : optionsList
  const hasValue = value !== null && value !== undefined && value !== ''
  const selected = hasValue ? options.find((option) => option?.[selectedValueKey] === value) : undefined
  const selectedName = selected?.[selectedNameKey] ?? null
  const selectedIcon = selectedIconKey ? selected?.[selectedIconKey] : undefined

  // Open upward when there is room above; measure this select's own list (v7 measured the first list on the page).
  useLayoutEffect(() => {
    if (!isOpenList || !listRef.current) return
    const { top, bottom } = listRef.current.getBoundingClientRect()
    setOpensUpward(bottom > LIST_HEIGHT && top > LIST_HEIGHT / 2)
  }, [isOpenList])

  const choose = (option: T) => {
    onChange?.(option)
    option.action?.(rowItem)
    setIsOpenList?.()
  }

  const toggle = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation()
    setIsOpenList?.()
  }

  const onKeyActivate = (handler: (event: KeyboardEvent) => void) => (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handler(event)
    }
  }

  const clear = (event: MouseEvent) => {
    event.stopPropagation()
    onChange?.(null)
  }

  const Arrow = ButtonSvg
  return (
    <div ref={rootRef} className={`G-select ${customClass}`}>
      <div
        role='button'
        tabIndex={0}
        aria-haspopup='listbox'
        aria-expanded={Boolean(isOpenList)}
        className={`G-select-header ${selectedIconKey ? 'G-with-icon' : ''}`}
        onClick={toggle}
        onKeyDown={onKeyActivate(toggle)}
      >
        {selectedIconKey && selectedName && isImage && (
          <span className='G-select-image' style={{ backgroundImage: `url('${selectedIcon}')` }} />
        )}
        {selectedIconKey && selectedName && !isImage && <span className={`G-select-status ${selectedIcon}`} />}
        {label && <span className='G-select-label'>{label}</span>}
        <p className={selectedName ? '' : 'G-opacity-placeholder'}>{selectedName ?? placeholder}</p>
        {(!selectedName || !isClear) && (
          <div className='G-center'>
            {Arrow ? (
              <Arrow fill={isOpenList ? '#4844C5' : '#ACBCC3'} />
            ) : (
              <LinkSvgIcon fill={isOpenList ? '#4844C5' : 'black'} />
            )}
          </div>
        )}
        {isClear && selectedName && <i onClick={clear} className='G-select-icon icon-close G-cursor-pointer' />}
      </div>
      {isOpenList && (
        <ClickOutside
          onClickOutside={(event) => {
            // Clicks on this select's header toggle the list themselves; handling them here would toggle twice.
            if (!rootRef.current?.contains(event.target as Node)) setIsOpenList?.()
          }}
        >
          <div
            ref={listRef}
            className={`G-select-list ${opensUpward ? 'G-select-list-top' : ''}`}
            style={{ maxHeight: `${maxHeight}px` }}
          >
            <ul role='listbox'>
              {options.map((option, index) => {
                const isSelected = hasValue && option?.[selectedValueKey] === value
                const icon = selectedIconKey ? option?.[selectedIconKey] : undefined
                const ItemIcon = ListItemSvg
                return (
                  <li
                    key={index}
                    role='option'
                    aria-selected={isSelected}
                    tabIndex={0}
                    className={`G-flex G-align-center ${isSelected ? 'G-selected-item' : ''}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      choose(option)
                    }}
                    onKeyDown={onKeyActivate((event) => {
                      event.stopPropagation()
                      choose(option)
                    })}
                  >
                    {selectedIconKey && isImage && (
                      <span className='G-select-image' style={{ backgroundImage: `url('${icon}')` }} />
                    )}
                    {selectedIconKey && !isImage && <span className={`G-select-status ${icon}`} />}
                    {haveIcon ? (
                      ItemIcon ? (
                        <div>
                          <ItemIcon fill='#4844C5' />
                        </div>
                      ) : (
                        <div style={{ marginRight: 10, display: 'flex', alignItems: 'center' }}>
                          <LinkSvgIcon fill='#4844C5' />
                        </div>
                      )
                    ) : null}
                    <p>{option?.[selectedNameKey]}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </ClickOutside>
      )}
    </div>
  )
}

export default Select
