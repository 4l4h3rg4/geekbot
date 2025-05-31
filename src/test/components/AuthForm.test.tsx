import { render, screen } from '@testing-library/react'
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
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
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
    renderWithRouter(<AuthForm />)
    
    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com')
    const passwordInput = screen.getByPlaceholderText('********')
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(submitButton).toHaveTextContent('Iniciando sesión...')
  })
})
