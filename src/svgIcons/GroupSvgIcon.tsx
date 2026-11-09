import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#CED8DD' } = props
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill={fill} {...props}>
      <circle cx={1.6} cy={1.6} r={1.6} fill={fill} />
      <circle cx={1.6} cy={8} r={1.6} fill={fill} />
      <circle cx={1.6} cy={14.4} r={1.6} fill={fill} />
      <circle cx={8} cy={8} r={1.6} fill={fill} />
      <circle cx={8} cy={1.6} r={1.6} fill={fill} />
      <circle cx={14.401} cy={8} r={1.6} fill={fill} />
      <circle cx={8} cy={14.4} r={1.6} fill={fill} />
      <circle cx={14.401} cy={1.6} r={1.6} fill={fill} />
      <circle cx={14.401} cy={14.4} r={1.6} fill={fill} />
    </svg>
  )
}
const Memo = memo(SvgComponent)
export default Memo
