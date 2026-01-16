import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import apiBookProvider from './apiBookProvider'

const mockFetch = vi.fn()
global.fetch = mockFetch as any

describe('apiBookProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('successful API calls', () => {
    it('should fetch and transform books with all fields', async () => {
      const mockApiResponse = [
        { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: '100', price: '20.5' },
        { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      })

      const provider = apiBookProvider()
      const books = await provider.getBooks()

      expect(books).toEqual([
        { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20.5 },
        { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 }
      ])
      expect(mockFetch).toHaveBeenCalledWith(
        'https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books'
      )
    })

    it('should handle books without unitsSold field', async () => {
      const mockApiResponse = [
        { id: 1, name: 'Book 1', author: 'Author 1', price: 20 },
        { id: 2, name: 'Book 2', author: 'Author 2', price: 15 }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      })

      const provider = apiBookProvider()
      const books = await provider.getBooks()

      expect(books).toEqual([
        { id: 1, name: 'Book 1', author: 'Author 1', price: 20 },
        { id: 2, name: 'Book 2', author: 'Author 2', price: 15 }
      ])
    })

    it('should handle empty array response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

      const provider = apiBookProvider()
      const books = await provider.getBooks()

      expect(books).toEqual([])
    })
  })

  describe('error handling', () => {
    it('should throw error on HTTP 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const provider = apiBookProvider()

      await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books: HTTP error! status: 404')
    })

    it('should throw error on HTTP 500', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const provider = apiBookProvider()

      await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books: HTTP error! status: 500')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const provider = apiBookProvider()

      await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books: Network error')
    })

    it('should handle timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

      const provider = apiBookProvider()

      await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books: Request timeout')
    })

    it('should handle JSON parse errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      const provider = apiBookProvider()

      await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books: Invalid JSON')
    })
  })
})