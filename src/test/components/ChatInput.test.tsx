
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ChatInput from '@/components/ChatInput'

describe('ChatInput', () => {
  it('renders input field and send button', () => {
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} />)
    
    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
  })

  it('calls onSendMessage when form is submitted', async () => {
    const user = userEvent.setup()
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} />)
    
    const input = screen.getByPlaceholderText(/Type your message/i)
    await user.type(input, 'Test message')
    
    const form = input.closest('form')
    if (form) {
      await user.click(screen.getByRole('button', { name: '' }))
    }
    
    expect(mockOnSend).toHaveBeenCalledWith('Test message')
  })

  it('clears input after sending message', async () => {
    const user = userEvent.setup()
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} />)
    
    const input = screen.getByPlaceholderText(/Type your message/i) as HTMLInputElement
    await user.type(input, 'Test message')
    
    const submitButton = screen.getByRole('button', { name: '' })
    await user.click(submitButton)
    
    expect(input.value).toBe('')
  })

  it('prevents sending empty messages', async () => {
    const user = userEvent.setup()
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} />)
    
    const submitButton = screen.getByRole('button', { name: '' })
    await user.click(submitButton)
    
    expect(mockOnSend).not.toHaveBeenCalled()
  })

  it('shows disabled state when loading', () => {
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} isLoading={true} />)
    
    const input = screen.getByPlaceholderText(/Espera a que GeekyBot/i)
    expect(input).toBeDisabled()
  })

  it('shows disabled state when disabled prop is true', () => {
    const mockOnSend = vi.fn()
    render(<ChatInput onSendMessage={mockOnSend} disabled={true} />)
    
    const input = screen.getByPlaceholderText(/Activa GeekyBot Plus/i)
    expect(input).toBeDisabled()
  })
})
