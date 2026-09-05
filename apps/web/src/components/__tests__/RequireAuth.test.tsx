import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RequireAuth } from '../auth/RequireAuth'

// Mock Clerk hooks
const mockUseAuth = vi.fn()
const mockUseUser = vi.fn()

vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => mockUseAuth(),
  useUser: () => mockUseUser(),
}))

// Mock TanStack Router Navigate
vi.mock('@tanstack/react-router', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="nav-redirect">Redirect to {to}</div>,
}))

describe('RequireAuth Component', () => {
  it('renders loading indicator when session is not loaded', () => {
    mockUseAuth.mockReturnValue({ isLoaded: false, isSignedIn: false })
    mockUseUser.mockReturnValue({ user: null })

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    )

    expect(screen.getByText(/Checking session…/i)).toBeDefined()
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('redirects to /sign-in if not signed in', () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false })
    mockUseUser.mockReturnValue({ user: null })

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    )

    expect(screen.getByTestId('nav-redirect').textContent).toBe('Redirect to /sign-in')
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('renders protected children when signed in with matching role', () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true })
    mockUseUser.mockReturnValue({
      user: {
        publicMetadata: { role: 'REVIEWER' },
      },
    })

    render(
      <RequireAuth roles={['REVIEWER', 'ADMIN']}>
        <div>Reviewer Portal</div>
      </RequireAuth>
    )

    expect(screen.getByText('Reviewer Portal')).toBeDefined()
  })

  it('redirects to /dashboard when user role is not authorized', () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true })
    mockUseUser.mockReturnValue({
      user: {
        publicMetadata: { role: 'POLICYHOLDER' },
      },
    })

    render(
      <RequireAuth roles={['ADMIN']}>
        <div>Admin Portal</div>
      </RequireAuth>
    )

    expect(screen.getByTestId('nav-redirect').textContent).toBe('Redirect to /dashboard')
    expect(screen.queryByText('Admin Portal')).toBeNull()
  })
})
