import type { SxProps, Theme } from '@mui/material'

/**
 * Picker popup layout: action bar on top, grey time columns.
 * Applied through `slotProps.layout.sx` instead of global CSS, so other pickers in the app are not affected.
 */
export const PICKER_LAYOUT_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column-reverse',
  '& .MuiMultiSectionDigitalClock-root': { backgroundColor: '#F4F4F4' },
}
