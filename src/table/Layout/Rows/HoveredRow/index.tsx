import { type ILinksList, type IrowActions } from '../../../../Models/table.models'
import { useRef } from 'react'
import FreezeRowSvgIcon from '../../../../svgIcons/FrameSvgIcon'
import EditSvgIcon from '../../../../svgIcons/EditSvgIcon'
import DeleteSvgIcon from '../../../../svgIcons/DeleteSvgIcon'
interface IHoveredRow<T extends object> {
  rowActions?: IrowActions[]
  item: T
  index: number
  freezedRows: T[]
  FreezeIcon?: any
  links?: ILinksList[]
  rowsFreezeAction?: boolean
  freezeRow(e: any, option: number): void
}
const HoveredRow = <T extends object>({
  rowActions,
  item,
  index,
  freezedRows,
  FreezeIcon,
  rowsFreezeAction,
  freezeRow,
}: IHoveredRow<T>) => {
  const ref = useRef<any>(null)

  return (
    <li className='G-rows-icons'>
      <div className='G-icons-group' ref={ref}>
        {rowActions && rowActions.length
          ? rowActions.map((elem, index) => {
              if (index < 3)
                return (
                  <div
                    // style={{ cursor: "pointer", paddingLeft: 8 }}
                    key={index}
                    onClick={(e) => elem.action(e, item, index)}
                    className={index === 0 ? 'G-first-action' : 'G-action-nth'}
                  >
                    {elem.icon ? <elem.icon /> : index === 0 ? <EditSvgIcon /> : <DeleteSvgIcon />}
                  </div>
                )
            })
          : null}
        {freezedRows.length < 3 && rowsFreezeAction && (
          <>
            <div
              onClick={(e) => {
                freezeRow(e, index)
              }}
              className='G-freeze-Icon'
            >
              {!FreezeIcon ? <FreezeRowSvgIcon /> : <FreezeIcon />}
            </div>
          </>
        )}
      </div>
    </li>
  )
}
export default HoveredRow
