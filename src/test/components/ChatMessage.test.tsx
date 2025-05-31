
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ChatMessage from '@/components/ChatMessage'

// Import screen from @testing-library/dom as it's re-exported
import { screen } from '@testing-library/dom'

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const mockMessage = {
      id: '1',
      content: 'Hello, world!',
      sender: 'user' as const,
      timestamp: new Date('2024-01-01T10:30:00Z')
    }
    
    render(
      <ChatMessage 
        message={mockMessage}
        isBot={false}
      />
    )
    
    expect(screen.getByText('Hello, world!')).toBeInTheDocument()
    expect(screen.getByText('10:30')).toBeInTheDocument()
  })

  it('renders bot message correctly', () => {
    const mockMessage = {
      id: '2',
      content: 'Hi there! How can I help you?',
      sender: 'bot' as const,
      timestamp: new Date('2024-01-01T10:31:00Z')
    }
    
    render(
      <ChatMessage 
        message={mockMessage}
        isBot={true}
      />
    )
    
    expect(screen.getByText('Hi there! How can I help you?')).toBeInTheDocument()
    expect(screen.getByText('10:31')).toBeInTheDocument()
  })

  it('applies correct styling for bot messages', () => {
    const mockMessage = {
      id: '3',
      content: 'Bot response',
      sender: 'bot' as const,
      timestamp: new Date('2024-01-01T10:32:00Z')
    }
    
    const { container } = render(
      <ChatMessage 
        message={mockMessage}
        isBot={true}
      />
    )
    
    const messageElement = container.querySelector('.bg-muted\\/30')
    expect(messageElement).toBeInTheDocument()
  })

  it('shows typing animation for bot messages initially', () => {
    const mockMessage = {
      id: '4',
      content: 'Typing message',
      sender: 'bot' as const,
      timestamp: new Date()
    }
    
    const { container } = render(
      <ChatMessage 
        message={mockMessage}
        isBot={true}
      />
    )
    
    // Check if the typing cursor animation class is present initially
    const typingElement = container.querySelector('.after\\:animate-cursor-blink')
    expect(typingElement).toBeInTheDocument()
  })
})
