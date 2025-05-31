
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ChatInput from '@/components/ChatInput'

describe('ChatInput', () => {
  it('renders input field and send button', () => {
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} />)
    
    expect(screen.getByPlaceholderText(/escribe tu mensaje/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onSendMessage when form is submitted', async () => {
    const user = userEvent.setup()
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} />)
    
    const input = screen.getByPlaceholderText(/escribe tu mensaje/i)
    await user.type(input, 'Test message')
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockOnSend).toHaveBeenCalledWith('Test message')
  })

  it('clears input after sending message', async () => {
    const user = userEvent.setup()
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} />)
    
    const input = screen.getByPlaceholderText(/escribe tu mensaje/i) as HTMLInputElement
    await user.type(input, 'Test message')
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(input.value).toBe('')
  })

  it('prevents sending empty messages', async () => {
    const user = userEvent.setup()
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockOnSend).not.toHaveBeenCalled()
  })
})
