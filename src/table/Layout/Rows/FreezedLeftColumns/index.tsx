import React from 'react'
import { StructureConfig } from '../../../../Models/table.enum'
import { type IFreezeProps } from '../../../../Models/table.models'
import { forwardRef } from 'react'

const FreezedLeftColumns = forwardRef<any, IFreezeProps<any>>(
  ({ columnsConfigStructure, columnMinWidth, item, freezedLeftSideColor, isLoadedData }, _ref) => {
    return (
      <>
        {columnsConfigStructure[StructureConfig.Freezed].items.map((column) => {
          return (
            column.isVisible && (
              <li
                key={column.id}
                style={{
                  ...column.customStyle,
                  maxWidth: columnMinWidth && columnMinWidth + 'px',
                  backgroundColor: freezedLeftSideColor && freezedLeftSideColor,
                }}
              >
                {column.setRow(item, isLoadedData)}
              </li>
            )
          )
        })}
      </>
    )
  },
)

export default FreezedLeftColumns
