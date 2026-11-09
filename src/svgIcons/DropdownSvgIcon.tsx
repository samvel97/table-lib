import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#ACBCC3' } = props
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={10} height={6} fill={fill} {...props}>
      <path
        fill={fill}
        d='M5.349 5.16a.5.5 0 0 1-.698 0L.685 1.296a.5.5 0 0 1 .349-.859h7.932a.5.5 0 0 1 .35.859L5.348 5.16Z'
      />
    </svg>
  )
}
const Memo = memo(SvgComponent)
export default Memo
