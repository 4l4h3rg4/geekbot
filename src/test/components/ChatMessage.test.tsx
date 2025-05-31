
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ChatMessage from '@/components/ChatMessage'

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    render(
      <ChatMessage 
        message="Hello, world!" 
        isBot={false} 
        timestamp="10:30 AM"
      />
    )
    
    expect(screen.getByText('Hello, world!')).toBeInTheDocument()
    expect(screen.getByText('10:30 AM')).toBeInTheDocument()
  })

  it('renders bot message correctly', () => {
    render(
      <ChatMessage 
        message="Hi there! How can I help you?" 
        isBot={true} 
        timestamp="10:31 AM"
      />
    )
    
    expect(screen.getByText('Hi there! How can I help you?')).toBeInTheDocument()
    expect(screen.getByText('10:31 AM')).toBeInTheDocument()
  })

  it('applies correct styling for bot messages', () => {
    const { container } = render(
      <ChatMessage 
        message="Bot response" 
        isBot={true} 
        timestamp="10:32 AM"
      />
    )
    
    const messageElement = container.querySelector('.bg-geeky-dark')
    expect(messageElement).toBeInTheDocument()
  })
})
