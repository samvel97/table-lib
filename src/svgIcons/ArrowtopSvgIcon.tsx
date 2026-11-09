import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#4844C5' } = props
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 16 16' fill={fill} {...props}>
      <path
        fill={fill}
        d='M14.066 11.233a.81.81 0 0 1-.592.25.807.807 0 0 1-.591-.25L7.999 6.35l-4.9 4.9a.791.791 0 0 1-.583.233.818.818 0 0 1-.6-.25.809.809 0 0 1-.25-.592c0-.228.083-.425.25-.591l5.617-5.6a.589.589 0 0 1 .216-.142.722.722 0 0 1 .25-.041c.09 0 .173.014.25.042.078.028.15.075.217.141l5.617 5.617a.782.782 0 0 1 .233.575.807.807 0 0 1-.25.591Z'
      />
    </svg>
  )
}
const Memo = memo(SvgComponent)
export default Memo
