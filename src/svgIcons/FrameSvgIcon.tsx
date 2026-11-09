import * as React from 'react'
import { type SVGProps, memo } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={32} height={32} fill='none' {...props}>
    <path fill='#E3EBEF' stroke='#4A4C56' strokeWidth={1.5} d='M3.99 6.927h8.16v6.55H3.99z' />
    <path fill='#E3EBEF' stroke='#4A4C56' strokeWidth={1.5} d='M3.99 13.367h8.16v6.55H3.99z' />
    <mask id='a' fill='#fff'>
      <path d='M3.24 19.056h9.66v8.05H4.24a1 1 0 0 1-1-1v-7.05Z' />
    </mask>
    <path
      fill='#E3EBEF'
      stroke='#4A4C56'
      strokeWidth={3}
      d='M3.24 19.056h9.66v8.05H4.24a1 1 0 0 1-1-1v-7.05Z'
      mask='url(#a)'
    />
    <path stroke='#4A4C56' strokeWidth={1.5} d='M12.043 6.927h8.16v6.55h-8.16z' />
    <path stroke='#4A4C56' strokeWidth={1.5} d='M12.043 13.367h8.16v6.55h-8.16z' />
    <path stroke='#4A4C56' strokeWidth={1.5} d='M12.043 19.806h8.16v6.55h-8.16z' />
    <mask id='b' fill='#fff'>
      <path d='M19.34 6.177H28a1 1 0 0 1 1 1v7.05h-9.66v-8.05Z' />
    </mask>
    <path stroke='#4A4C56' strokeWidth={3} d='M19.34 6.177H28a1 1 0 0 1 1 1v7.05h-9.66v-8.05Z' mask='url(#b)' />
    <path stroke='#4A4C56' strokeWidth={1.5} d='M20.091 13.367h8.16v6.55h-8.16z' />
    <mask id='c' fill='#fff'>
      <path d='M19.34 19.056H29v7.05a1 1 0 0 1-1 1h-8.66v-8.05Z' />
    </mask>
    <path stroke='#4A4C56' strokeWidth={3} d='M19.34 19.056H29v7.05a1 1 0 0 1-1 1h-8.66v-8.05Z' mask='url(#c)' />
    <path
      fill='#4A4C56'
      stroke='#fff'
      strokeWidth={1.5}
      d='m12.497 10.18.874-.15-.293-.838-.704-2.012-.26-.74-.727.291-2.074.831.269-2.481.09-.831H5.71l.09.83.268 2.482-2.073-.83-.724-.29-.262.734-.717 2.012-.299.84.88.151 2.167.37-1.583 1.879-.534.633.683.469 1.799 1.232.672.461.404-.708 1.21-2.125 1.21 2.125.404.71.673-.464 1.786-1.232.678-.468-.53-.632-1.575-1.88 2.16-.37Z'
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
