import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#4A4C56' } = props
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' fill={fill} {...props}>
      <path
        fill={fill}
        d='M7 21c-.55 0-1.021-.196-1.413-.588A1.922 1.922 0 0 1 5 19V6H4V4h5V3h6v1h5v2h-1v13c0 .55-.196 1.021-.588 1.413A1.922 1.922 0 0 1 17 21H7Zm2-4h2V8H9v9Zm4 0h2V8h-2v9Z'
      />
    </svg>
  )
}
const Memo = memo(SvgComponent)
export default Memo
