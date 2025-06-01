
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import AuthForm from '@/components/auth/AuthForm'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sign in form by default', () => {
    renderWithRouter(<AuthForm />)
    
    expect(screen.getByText('Acceso al Panel de Admin')).toBeInTheDocument()
    // Check the tab button
    expect(screen.getAllByText('Iniciar Sesión')[0]).toBeInTheDocument()
    // Check the email and password placeholders as rendered
    expect(screen.getByPlaceholderText('correo@ejemplo.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('********')).toBeInTheDocument()
  })

  it('switches between sign in and sign up tabs', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthForm />)
    
    const signUpTab = screen.getByText('Registrarse')
    await user.click(signUpTab)
    
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthForm />)
    
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' })
    await user.click(submitButton)
    
    // Form should not submit without required fields
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('handles form submission with valid data', async () => {
    const user = userEvent.setup()
    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com')
    const passwordInput = screen.getByPlaceholderText('********')
    // The submit button is the second "Iniciar Sesión" button (the first is the tab)
    const submitButton = screen.getAllByText('Iniciar Sesión').find(
      (el) => el.closest('button[type="submit"]')
    ) as HTMLElement

    await user.type(emailInput, 'aa@a.a')
    await user.type(passwordInput, 'admin123')
    await user.click(submitButton)

    expect(submitButton).toHaveTextContent('Iniciando sesión...')
    
    expect(submitButton).toHaveTextContent('Iniciando sesión...')
  })

  
})
