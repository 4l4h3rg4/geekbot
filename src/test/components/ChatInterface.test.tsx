
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ChatInterface from '@/components/ChatInterface'

// Mock the child components
vi.mock('@/components/ChatMessage', () => ({
  default: ({ message, isBot }: { message: string; isBot: boolean }) => (
    <div data-testid="chat-message">
      <span>{isBot ? 'Bot' : 'User'}: {message}</span>
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

describe('ChatInterface', () => {
  it('renders chat interface components', () => {
    render(<ChatInterface />)
    
    expect(screen.getByTestId('chat-input')).toBeInTheDocument()
  })

  it('handles sending messages', async () => {
    const user = userEvent.setup()
    render(<ChatInterface />)
    
    const sendButton = screen.getByText('Send Test')
    await user.click(sendButton)
    
    // Should add user message and bot response
    const messages = screen.getAllByTestId('chat-message')
    expect(messages).toHaveLength(2) // User message + bot response
  })

  it('displays messages in correct order', async () => {
    const user = userEvent.setup()
    render(<ChatInterface />)
    
    const sendButton = screen.getByText('Send Test')
    await user.click(sendButton)
    
    const messages = screen.getAllByTestId('chat-message')
    expect(messages[0]).toHaveTextContent('User: test message')
    expect(messages[1]).toHaveTextContent('Bot:')
  })
})
