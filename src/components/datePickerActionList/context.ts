import { createContext } from 'react'

export interface DateActionTranslations {
  confirmFilters?: string
  clearDate?: string
  todayButton?: string
  hour?: string
  min?: string
  sec?: string
}

/**
 * Translations reach the date picker action bar through context: MUI renders `slots.actionBar` itself,
 * so passing them through a wrapper function would create a new component on every render.
 */
export const DateActionTranslationsContext = createContext<DateActionTranslations | undefined>(undefined)
