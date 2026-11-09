import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { useSyncOnChange } from './useSyncOnChange'

function Mirror({ value }: { value: string }) {
  const [local, setLocal] = useState('')
  const [syncs, setSyncs] = useState(0)
  useSyncOnChange(value, (next) => {
    setLocal(next.toUpperCase())
    setSyncs((count) => count + 1)
  })
  return (
    <p>
      {local}:{syncs}
    </p>
  )
}

describe('useSyncOnChange', () => {
  it('syncs on mount and only when the value changes', () => {
    const { rerender } = render(<Mirror value='a' />)
    expect(screen.getByText('A:1')).toBeInTheDocument()

    rerender(<Mirror value='a' />)
    expect(screen.getByText('A:1')).toBeInTheDocument()

    rerender(<Mirror value='b' />)
    expect(screen.getByText('B:2')).toBeInTheDocument()
  })
})
