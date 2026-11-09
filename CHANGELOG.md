# Changelog

## 8.0.0

A modernization release: React 19 support, maintained dependencies, a much smaller package, styles that no longer
leak into the host app, and a set of bug fixes. **The component API is unchanged**: every v7 prop and export still
exists with the same name.

### Breaking changes

- **Peer dependencies**: `react` / `react-dom` `^18 || ^19`, `@mui/material` `^5.15.14 || ^6 || ^7`,
  `@emotion/react` / `@emotion/styled` `^11`. React 16/17 and MUI below 5.15.14 are no longer supported.
- **`react-beautiful-dnd` replaced by `@hello-pangea/dnd`** (its maintained fork). It is a regular dependency now,
  so you no longer need to install a drag-and-drop library for the table.
- **Global CSS is scoped.** v7 applied a page-wide reset to every app that imported it: margins and paddings on most
  elements, `* { outline: none }`, `html, body { font-family: "Segoe UI" !important; min-width: 576px }`,
  `svg { height: 100% }` and scrollbar styles. v8 applies these only inside the table. The `G-` flex helpers stay
  global (apps use them). See the migration notes if your layout relied on the reset.
- **Bundled Helvetica fonts removed.** The table uses the app's font.
- **Package layout**: ESM (`dist/index.js`), CJS (`dist/index.cjs`), one `dist/index.d.ts`, styles in
  `dist/index.css` (imported automatically). Deep imports such as
  `beautiful-react-table/dist/cjs/types/Models/table.models` no longer exist; import the types from the package root.

### Fixed

- **Filters panel crashed** with `TypeError: endOf is not a function` when a Date column was configured: the date
  pickers received `null` as min/max date. Date ranges also no longer use "Invalid Date" as a limit.
- **Unfreezing a row lost rows**: `splice(index, index)` removed `index` rows from the frozen list and only one came
  back, so rows disappeared from the table. Row selection also mutated state in place.
- **Column customization showed empty labels** unless `columnName` was set; it now falls back to the header title.
  Moving a column no longer overwrites the header list names, and toggling a pinned column no longer depends on the
  key order of `columnsConfigStructure`.
- **Frozen rows were misaligned** with the header (`minWidth` instead of the `maxWidth` used everywhere else).
- **Rows grew taller on hover** when the action icons appeared.
- Filter components **mutated filter state** in place (`filterTyping.Values = ...`), hiding changes from React and
  from your callbacks.
- **Range validation threw** without `translations`; it now falls back to English messages.
- Pagination printed **"1-10 undefined 57"** without `translations`, and picked the page size by position
  (`pageSizeStructure[id - 1]`) instead of by `id`.
- Styles that targeted generated MUI class names (`.css-1d3z3hw-MuiOutlinedInput-notchedOutline`, ...) only worked
  for one MUI version and affected every MUI component in the app. They now use stable class names or `sx`.
  This also restores the red border on invalid date fields.
- Date picker action bar: rebuilt for MUI X v8 (`usePickerActionsContext`), no longer remounted on every render, and
  the "Today" button uses a valid variant.
- `ClickOutside` shared one element id across all instances, ignored its own container and re-subscribed on every
  render. Popups now have unique ids (`useId`), so `aria-labelledby` points at the right button.
- Option labels with numeric names rendered as `[object Object]`; filter options were rendered as `<div>`s inside a
  `<ul>` and spread React's `key` prop (a React 19 warning).
- A test-only import (`@testing-library/user-event`) in production code, invalid CSS values and a duplicate "go to
  page" input pattern copied from a phone field were removed.

### Improved

- **Accessibility**: checkboxes, pagination, selects and the filters trigger are keyboard operable with proper roles
  (`checkbox`, `listbox`/`option`, `aria-current`, `aria-expanded`); focus outlines are visible again.
- **Types**: strict TypeScript, no `@ts-ignore` / `@ts-nocheck`, `<Table<Row>>` keeps the row type through `memo`,
  every prop documented with JSDoc, icon props accept any component (not only `React.memo` ones), new exports:
  `IComparisonType`, `IFiltersTypes`, `IOrdering`, `ISelect`, `IColumnTotalStructure`, `CheckedItems`, `TableIcon`,
  `IProps`, and `IRowActions` (alias of `IrowActions`).
- Package size: ~180 kB packed / 10 files (v7: ~3.2 MB in 153 files). `react-beautiful-dnd`, the date pickers and
  build tools are no longer bundled or installed as runtime dependencies; the package no longer depends on itself.
- Tooling: Vite 8 library mode, TypeScript 6, ESLint 10 flat config, Prettier 3, Vitest with tests for row state,
  column moves, pagination and date handling, a playground (`npm run dev`) and CI.

### Deprecated

These props are accepted but have no effect (as in 7.8.2): `perColumnListForFilters` (use `filterColumns[i].options`),
`isLoadingFilters` (use `filterColumns[i].isLoading`), `selectedPageCount`, `hoverdRowPosition`, `setSortedData`,
`handleDeleteAll`.

### Migrating from 7.x

1. Update the peers if needed: `npm install beautiful-react-table@8 @mui/material@">=5.15.14" @emotion/react @emotion/styled`.
   React 18 and MUI 5 keep working; upgrading them is not required.
2. If you installed `react-beautiful-dnd` only for this table, you can remove it.
3. Replace deep imports with root imports:
   ```ts
   // before
   import { IComparisonType } from 'beautiful-react-table/dist/cjs/types/Models/table.models'
   // after
   import type { IComparisonType } from 'beautiful-react-table'
   ```
4. Check your layout. If something relied on the page-wide reset from v7 (for example list bullets, body margins or
   the Segoe UI font), either add those rules to your own global CSS or, as a stopgap, import the old reset (without
   `outline: none`):
   ```ts
   import 'beautiful-react-table/legacy-global.css'
   ```
5. If you passed `perColumnListForFilters`, put the values in `filterColumns[i].options` instead (it is ignored in 7.8.2 as well).
