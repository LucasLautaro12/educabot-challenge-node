import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiBookProvider from '../api/apiBookProvider'

// Mock global fetch
global.fetch = vi.fn()

describe('apiBookProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch and transform books successfully', async () => {
    const mockApiResponse = [
      { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: '100', price: '20.5' },
      { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 }
    ]

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    const provider = apiBookProvider()
    const books = await provider.getBooks()

    expect(books).toEqual([
      { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20.5 },
      { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 }
    ])
    expect(global.fetch).toHaveBeenCalledWith(
      'https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books'
    )
  })

  it('should handle HTTP errors', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    const provider = apiBookProvider()

    await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books')
  })

  it('should handle network errors', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const provider = apiBookProvider()

    await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books: Network error')
  })
})