export enum StructureConfig {
  Main = 'Main',
  Freezed = 'Freezed',
}

export enum CheckedItems {
  SELECTED_ALL = 'Select all',
  SELECTED_VISIBLE = 'Selected visible rows',
  NONE = 'None',
}

export type inputSize = 'small' | 'medium'

export enum filterTypesUiHelper {
  Equal = '=',
  NotEqual = '!=',
  Contains = 'Contains',
  NotContains = 'Not Contains',
  StartsWith = 'Starts with',
  EndsWith = 'Ends with',
  Between = 'Between',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  LessThan = '<',
  LessThanOrEqual = '<=',
  In = 'In',
}

export enum ConditionalOperatorsEnums {
  Equal = '=',
  NotEqual = '!=',
  LessThan = '<',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  LessThanOrEqual = '<=',
  Contains = '=*',
  NotContains = '!*',
  StartsWith = '^',
  NotStartsWith = '!^',
  EndsWith = '$',
  NotEndsWith = '!$',
}
export enum ColumnTypeEnums {
  EncryptedData = 'EncryptedData',
  Base36Id = 'Base36Id',
  Number = 'Number',
  Text = 'Text',
  Currency = 'Currency',
  Percentage = 'Percentage',
  Date = 'Date',
  Boolean = 'Boolean',
  Tags = 'Tags',
  NumberCollection = 'NumberCollection',
  TextCollection = 'TextCollection',
  TikoType = 'TikoType',
}

export const numberFields = [ColumnTypeEnums.Number, ColumnTypeEnums.Currency, ColumnTypeEnums.Percentage]
