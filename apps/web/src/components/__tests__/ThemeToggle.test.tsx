import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../context/ThemeContext'
import { ThemeToggle } from '../ThemeToggle'

describe('ThemeToggle Component', () => {
  it('renders theme switch button and toggles theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: /switch to/i })
    expect(button).toBeDefined()

    // Initially dark mode -> switch to light mode
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode')

    // Click to toggle
    fireEvent.click(button)
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode')

    // Click again to toggle back
    fireEvent.click(button)
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode')
  })
})
