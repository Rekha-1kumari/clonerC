import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from '../Logo'

describe('Logo Component', () => {
  it('renders correctly with default props', () => {
    render(<Logo />)
    const img = screen.getByAltText('BimaNyaya')
    expect(img).toBeDefined()
    expect(img.getAttribute('src')).toBe('/bimanyaya-logo.svg')
  })

  it('applies custom className and size styles', () => {
    const { container } = render(<Logo size="lg" className="custom-class" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.classList.contains('custom-class')).toBe(true)
    expect(wrapper.style.height).toBe('48px')
  })

  it('supports small size mode', () => {
    const { container } = render(<Logo size="sm" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('24px')
  })
})
