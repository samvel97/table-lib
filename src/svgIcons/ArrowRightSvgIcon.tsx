import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' {...props}>
    <path
      fill='#000'
      d='M4.768 14.067a.81.81 0 0 1-.25-.592c0-.228.083-.425.25-.592L9.65 8l-4.9-4.9a.791.791 0 0 1-.233-.583c0-.234.083-.434.25-.6a.81.81 0 0 1 .592-.25c.228 0 .425.083.59.25l5.6 5.616a.588.588 0 0 1 .143.217.72.72 0 0 1 .041.25.733.733 0 0 1-.042.25.592.592 0 0 1-.141.217l-5.617 5.616a.782.782 0 0 1-.575.234.807.807 0 0 1-.591-.25Z'
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
