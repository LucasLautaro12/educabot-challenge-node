import { describe, it, expect, vi, beforeEach } from 'vitest'
import metricsHandler from './metrics'
import { Request, Response } from 'express'
import { BooksProvider } from '../providers/books'
import { Book } from '../models/book'

describe('metricsHandler', () => {
  const mockBooks: Book[] = [
    { id: 1, name: 'Book 1', author: 'Author 1', units_sold: 100, price: 20 },
    { id: 2, name: 'Book 2', author: 'Author 2', units_sold: 200, price: 15 },
    { id: 3, name: 'Book 3', author: 'Author 1', units_sold: 300, price: 25 }
  ]

  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let statusMock: any
  let jsonMock: any

  beforeEach(() => {
    jsonMock = vi.fn()
    statusMock = vi.fn().mockReturnThis()
    mockRes = {
      status: statusMock,
      json: jsonMock
    }
    mockReq = {
      query: {}
    }
  })

  describe('successful responses', () => {
    it('should return metrics with 200 status when no author provided', async () => {
      const mockBooksProvider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue(mockBooks)
      }
      const handler = metricsHandler(mockBooksProvider)

      await handler.get(mockReq as any, mockRes as any)

      expect(mockBooksProvider.getBooks).toHaveBeenCalled()
      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 200,
        cheapest_book: mockBooks[1],
        books_written_by_author: []
      })
    })

    it('should return metrics with author filter', async () => {
      const mockBooksProvider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue(mockBooks)
      }
      const handler = metricsHandler(mockBooksProvider)
      mockReq.query = { author: 'Author 1' }

      await handler.get(mockReq as any, mockRes as any)

      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 200,
        cheapest_book: mockBooks[1],
        books_written_by_author: [mockBooks[0], mockBooks[2]]
      })
    })

    it('should handle empty books array', async () => {
      const mockBooksProvider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue([])
      }
      const handler = metricsHandler(mockBooksProvider)

      await handler.get(mockReq as any, mockRes as any)

      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: null,
        cheapest_book: null,
        books_written_by_author: []
      })
    })

    it('should handle books without unitsSold', async () => {
      const booksWithoutSales: Book[] = [
        { id: 1, name: 'Book 1', author: 'Author 1', price: 20 },
        { id: 2, name: 'Book 2', author: 'Author 2', price: 15 }
      ]
      const mockBooksProvider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue(booksWithoutSales)
      }
      const handler = metricsHandler(mockBooksProvider)

      await handler.get(mockReq as any, mockRes as any)

      expect(statusMock).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: null,
        cheapest_book: booksWithoutSales[1],
        books_written_by_author: []
      })
    })
  })

  describe('error handling', () => {
    it('should return 500 when provider throws error', async () => {
      const mockBooksProvider: BooksProvider = {
        getBooks: vi.fn().mockRejectedValue(new Error('Database connection failed'))
      }
      const handler = metricsHandler(mockBooksProvider)

      await handler.get(mockReq as any, mockRes as any)

      expect(statusMock).toHaveBeenCalledWith(500)
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to get metrics',
        message: 'Database connection failed'
      })
    })

    it('should handle network errors', async () => {
      const mockBooksProvider: BooksProvider = {
        getBooks: vi.fn().mockRejectedValue(new Error('Network timeout'))
      }
      const handler = metricsHandler(mockBooksProvider)

      await handler.get(mockReq as any, mockRes as any)

      expect(statusMock).toHaveBeenCalledWith(500)
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to get metrics',
        message: 'Network timeout'
      })
    })

    it('should handle unknown errors', async () => {
      const mockBooksProvider: BooksProvider = {
        getBooks: vi.fn().mockRejectedValue('String error')
      }
      const handler = metricsHandler(mockBooksProvider)

      await handler.get(mockReq as any, mockRes as any)

      expect(statusMock).toHaveBeenCalledWith(500)
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to get metrics',
        message: 'Unknown error occurred'
      })
    })

    it('should log errors to console', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const testError = new Error('Test error')
      const mockBooksProvider: BooksProvider = {
        getBooks: vi.fn().mockRejectedValue(testError)
      }
      const handler = metricsHandler(mockBooksProvider)

      await handler.get(mockReq as any, mockRes as any)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting metrics:', testError)
      consoleErrorSpy.mockRestore()
    })
  })
})