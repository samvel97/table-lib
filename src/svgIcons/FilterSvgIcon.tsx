import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => {
  const { fill } = props
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' fill={fill} {...props}>
      <path
        fill={fill}
        d='M11 20a.968.968 0 0 1-.714-.288A.964.964 0 0 1 10 19v-6L4.2 5.6c-.25-.333-.287-.683-.113-1.05.175-.367.48-.55.913-.55h14c.434 0 .738.183.913.55.176.367.138.717-.113 1.05L14 13v6a.968.968 0 0 1-.288.713A.964.964 0 0 1 13 20h-2Z'
      />
    </svg>
  )
}
const Memo = memo(SvgComponent)
export default Memo
