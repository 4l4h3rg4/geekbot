
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Advertisement from '@/components/Advertisement'

describe('Advertisement', () => {
  const mockAd = {
    id: '1',
    title: 'Test Ad',
    content: 'This is a test advertisement',
    image_url: 'https://example.com/image.jpg',
    link_url: 'https://example.com',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  it('renders advertisement with all content', () => {
    render(<Advertisement ad={mockAd} />)
    
    expect(screen.getByText('Test Ad')).toBeInTheDocument()
    expect(screen.getByText('This is a test advertisement')).toBeInTheDocument()
  })

  it('renders image when image_url is provided', () => {
    render(<Advertisement ad={mockAd} />)
    
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(image).toHaveAttribute('alt', 'Test Ad')
  })

  it('renders as link when link_url is provided', () => {
    render(<Advertisement ad={mockAd} />)
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('does not render when ad is inactive', () => {
    const inactiveAd = { ...mockAd, is_active: false }
    const { container } = render(<Advertisement ad={inactiveAd} />)
    
    expect(container.firstChild).toBeNull()
  })
})
