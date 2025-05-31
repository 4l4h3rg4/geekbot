import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Advertisement from '@/components/Advertisement'

// Mock supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({
            data: [
              {
                id: '1',
                title: 'Test Ad',
                description: 'This is a test advertisement',
                image_url: 'https://example.com/image.jpg',
                link_url: 'https://example.com',
                active: true,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
              }
            ],
            error: null
          }))
        }))
      }))
    }))
  }))
}

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}))

describe('Advertisement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders advertisement with content', async () => {
    render(<Advertisement />)
    
    // Wait for the component to load
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(screen.getByText('Test Ad')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<Advertisement />)
    
    // Should show loading state (animated pulse)
    const loadingElement = document.querySelector('.animate-pulse')
    expect(loadingElement).toBeInTheDocument()
  })

  it('handles error state when no ads are available', async () => {
    // Mock empty response
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({
              data: [],
              error: null
            }))
          }))
        }))
      }))
    })

    const { container } = render(<Advertisement />)
    
    // Wait for the component to process
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should not render anything when no ads
    expect(container.firstChild).toBeNull()
  })
})
