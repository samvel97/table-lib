import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => {
  const { fill = 'black' } = props

  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 16 16' fill={fill} {...props}>
      <path
        fill={fill}
        d='M1.934 4.767a.81.81 0 0 1 .592-.25c.228 0 .425.083.591.25L8.001 9.65l4.9-4.9a.791.791 0 0 1 .583-.233c.233 0 .433.083.6.25.167.166.25.364.25.592a.807.807 0 0 1-.25.591l-5.617 5.6a.588.588 0 0 1-.216.142.72.72 0 0 1-.25.041.733.733 0 0 1-.25-.042.592.592 0 0 1-.217-.141L1.917 5.933a.782.782 0 0 1-.233-.575c0-.228.083-.425.25-.591Z'
      />
    </svg>
  )
}
const Memo = memo(SvgComponent)
export default Memo
