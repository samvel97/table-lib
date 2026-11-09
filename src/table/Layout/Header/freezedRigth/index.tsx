import React from 'react'
import { type IColumnConfig } from '../../../../Models/table.models'
const FreezedHeaderRight = <T extends object>({
  headerColor,
  rightFreezedColumnWidth,
  rightFreezeConfig,
}: {
  headerColor: string | undefined
  rightFreezedColumnWidth: number | undefined
  rightFreezeConfig?: IColumnConfig<T>[]
}) => {
  return (
    <ul
      className='G-data-table-header'
      style={{
        right: 0,
        zIndex: 1000,
        boxShadow: '-6px 0px 8px 0px rgba(0,0,0,0.02)',
      }}
    >
      {rightFreezeConfig ? (
        rightFreezeConfig.map((item, i) => {
          if (i < 4)
            return (
              <li
                key={item.id}
                style={{
                  maxWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `${item.width}px`,
                  minWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `${item.width}px`,
                  backgroundColor: headerColor && headerColor,
                }}
              >
                {item.title(item)}
              </li>
            )
        })
      ) : (
        <li
          style={{
            maxWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `60px`,
            minWidth: rightFreezedColumnWidth ? `${rightFreezedColumnWidth}px` : `60px`,
            backgroundColor: headerColor && headerColor,
          }}
        />
      )}
    </ul>
  )
}

export default FreezedHeaderRight
