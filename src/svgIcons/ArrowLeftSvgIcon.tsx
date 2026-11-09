import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' {...props}>
    <path
      fill='#000'
      d='M11.232 1.933c.167.167.25.364.25.592a.807.807 0 0 1-.25.592L6.35 8l4.9 4.9c.156.156.233.35.233.583a.818.818 0 0 1-.25.6.809.809 0 0 1-.592.25.807.807 0 0 1-.59-.25l-5.6-5.616a.589.589 0 0 1-.143-.217.722.722 0 0 1-.041-.25c0-.089.014-.172.042-.25a.592.592 0 0 1 .141-.217l5.617-5.616a.782.782 0 0 1 .575-.234c.228 0 .425.084.591.25Z'
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
