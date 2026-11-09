import { useContext } from 'react'
import { Button, type ButtonProps } from '@mui/material'
import { usePickerActionsContext, type PickersActionBarProps } from '@mui/x-date-pickers'
import { DateActionTranslationsContext } from './context'
import './style.scss'

/** Action bar for the filter date pickers: Apply / Clear / Today plus hour-minute-second labels. */
export default function ActionList({ className }: PickersActionBarProps) {
  const translations = useContext(DateActionTranslationsContext)
  const { acceptValueChanges, clearValue, setValueToToday } = usePickerActionsContext()

  const actions: { label: string; onClick: () => void; variant: ButtonProps['variant'] }[] = [
    { label: translations?.confirmFilters ?? 'Apply', onClick: acceptValueChanges, variant: 'text' },
    { label: translations?.clearDate ?? 'Clear', onClick: clearValue, variant: 'outlined' },
    { label: translations?.todayButton ?? 'Today', onClick: setValueToToday, variant: 'contained' },
  ]

  return (
    <div className={`G-justify-between P-date-actions-component ${className ?? ''}`}>
      <div className='P-actions-component'>
        {actions.map(({ label, onClick, variant }) => (
          <Button key={label} size='small' variant={variant} onClick={onClick} sx={{ textTransform: 'capitalize' }}>
            {label}
          </Button>
        ))}
      </div>
      <div className='G-center P-time-component'>
        <div>{translations?.hour ?? 'Hour'}</div>
        <div>{translations?.min ?? 'Min'}</div>
        <div>{translations?.sec ?? 'Sec'}</div>
      </div>
    </div>
  )
}
