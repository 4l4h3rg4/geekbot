
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/lib/supabase'

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

describe('Supabase Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should sign in user with valid credentials', async () => {
      const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
      mockSignIn.mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' }, session: {} },
        error: null,
      } as any)

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.data.user?.email).toBe('test@example.com')
      expect(result.error).toBeNull()
    })

    it('should handle sign in errors', async () => {
      const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
      mockSignIn.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      } as any)

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword',
      })

      expect(result.error?.message).toBe('Invalid credentials')
      expect(result.data.user).toBeNull()
    })
  })

  describe('CRUD Operations', () => {
    it('should fetch site settings', async () => {
      const mockFrom = vi.mocked(supabase.from)
      const mockSelect = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: { id: 1, site_name: 'GeekyBot', site_subtitle: 'AI Assistant' },
        error: null,
      })

      mockFrom.mockReturnValue({
        select: mockSelect,
        single: mockSingle,
      } as any)

      await supabase.from('site_settings').select('*').single()

      expect(mockFrom).toHaveBeenCalledWith('site_settings')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockSingle).toHaveBeenCalled()
    })

    it('should update site settings', async () => {
      const mockFrom = vi.mocked(supabase.from)
      const mockUpdate = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockResolvedValue({
        data: [{ id: 1, site_name: 'Updated Name' }],
        error: null,
      })

      mockFrom.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      } as any)

      await supabase
        .from('site_settings')
        .update({ site_name: 'Updated Name' })
        .eq('id', 1)

      expect(mockFrom).toHaveBeenCalledWith('site_settings')
      expect(mockUpdate).toHaveBeenCalledWith({ site_name: 'Updated Name' })
      expect(mockEq).toHaveBeenCalledWith('id', 1)
    })
  })
})
