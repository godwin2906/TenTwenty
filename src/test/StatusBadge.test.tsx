import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../components/ui/StatusBadge'

describe('StatusBadge', () => {
  it('renders COMPLETED badge', () => {
    render(<StatusBadge status="completed" />)
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })

  it('renders INCOMPLETE badge', () => {
    render(<StatusBadge status="incomplete" />)
    expect(screen.getByText('INCOMPLETE')).toBeInTheDocument()
  })

  it('renders MISSING badge', () => {
    render(<StatusBadge status="missing" />)
    expect(screen.getByText('MISSING')).toBeInTheDocument()
  })

  it('applies green styles for completed', () => {
    const { container } = render(<StatusBadge status="completed" />)
    expect(container.firstChild).toHaveClass('bg-green-100')
  })

  it('applies yellow styles for incomplete', () => {
    const { container } = render(<StatusBadge status="incomplete" />)
    expect(container.firstChild).toHaveClass('bg-yellow-100')
  })

  it('applies red styles for missing', () => {
    const { container } = render(<StatusBadge status="missing" />)
    expect(container.firstChild).toHaveClass('bg-red-100')
  })
})
