import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#4A4C56' } = props

  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' fill={fill} {...props}>
      <path
        fill={fill}
        d='M19.893 3.001H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h15.893c1.103 0 2-.897 2-2V5a2.003 2.003 0 0 0-2-1.999ZM8 19.001H4V8h4v11.001Zm6 0h-4V8h4v11.001Zm2 0V8h3.893l.001 11.001H16Z'
      />
    </svg>
  )
}
const Memo = memo(SvgComponent)
export default Memo
