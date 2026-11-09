export type RowId = string | number

/**
 * Rows are identified by their `id` field (selection, frozen rows, dropdowns).
 * The table has always required it; this helper makes the requirement explicit and typed.
 */
export const getRowId = (row: object): RowId | undefined => (row as { id?: RowId }).id
