import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ChatInterface from '@/components/ChatInterface'

// Mock the child components
vi.mock('@/components/ChatMessage', () => ({
  default: ({ message, isBot }: { message: any; isBot: boolean }) => (
    <div data-testid="chat-message">
      <span>{isBot ? 'Bot' : 'User'}: {message.content}</span>
    </div>
  ),
}))

vi.mock('@/components/ChatInput', () => ({
  default: ({ onSendMessage }: { onSendMessage: (message: string) => void }) => (
    <div data-testid="chat-input">
      <button onClick={() => onSendMessage('test message')}>Send Test</button>
    </div>
  ),
}))

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({
            data: { content: 'Welcome to GeekyBot!' },
            error: null
          }))
        }))
      }))
    }))
  }
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}))

describe('ChatInterface', () => {
  it('renders chat interface components', async () => {
    render(<ChatInterface />)
    
    // Wait for welcome message to load
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(screen.getByTestId('chat-input')).toBeInTheDocument()
  })

  it('handles sending messages', async () => {
    const user = userEvent.setup()
    render(<ChatInterface />)
    
    // Wait for initial load
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const sendButton = screen.getByText('Send Test')
    await user.click(sendButton)
    
    // Should add user message
    expect(screen.getByText(/User: test message/)).toBeInTheDocument()
  })

  it('displays welcome message on load', async () => {
    render(<ChatInterface />)
    
    // Wait for welcome message to load
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(screen.getByText(/Bot: Welcome to GeekyBot!/)).toBeInTheDocument()
  })
})
