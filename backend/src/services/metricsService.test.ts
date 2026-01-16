import { describe, it, expect, vi } from 'vitest'
import metricsService from './metricsService'
import { BooksProvider } from '../providers/books'
import { Book } from '../models/book'

describe('metricsService', () => {
  const mockBooks: Book[] = [
    { id: '1', name: 'Book 1', author: 'Author 1', units_sold: 100, price: 20 },
    { id: '2', name: 'Book 2', author: 'Author 2', units_sold: 200, price: 15 },
    { id: '3', name: 'Book 3', author: 'Author 1', units_sold: 300, price: 25 }
  ]

  const mockBooksProvider: BooksProvider = {
    getBooks: vi.fn().mockResolvedValue(mockBooks)
  }

  const service = metricsService(mockBooksProvider)

  describe('getMetrics - basic functionality', () => {
    it('should calculate metrics without author filter', async () => {
      const result = await service.getMetrics()

      expect(result.mean_units_sold).toBe(200)
      expect(result.cheapest_book).toEqual(mockBooks[1])
      expect(result.books_written_by_author).toEqual([])
    })

    it('should calculate metrics with author filter', async () => {
      const result = await service.getMetrics('Author 1')

      expect(result.mean_units_sold).toBe(200)
      expect(result.cheapest_book).toEqual(mockBooks[1])
      expect(result.books_written_by_author).toEqual([mockBooks[0], mockBooks[2]])
    })

    it('should filter books by author case-insensitively', async () => {
      const result = await service.getMetrics('AUTHOR 1')

      expect(result.books_written_by_author).toEqual([mockBooks[0], mockBooks[2]])
    })

    it('should return empty array when author not found', async () => {
      const result = await service.getMetrics('Non Existent Author')

      expect(result.books_written_by_author).toEqual([])
    })
  })

  describe('getMetrics - edge cases', () => {
    it('should return null for all metrics when books array is empty', async () => {
      const emptyProvider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue([])
      }
      const emptyService = metricsService(emptyProvider)

      const result = await emptyService.getMetrics()

      expect(result.mean_units_sold).toBeNull()
      expect(result.cheapest_book).toBeNull()
      expect(result.books_written_by_author).toEqual([])
    })

    it('should handle books without unitsSold field', async () => {
      const booksWithoutSales: Book[] = [
        { id: '1', name: 'Book 1', author: 'Author 1', price: 20 },
        { id: '2', name: 'Book 2', author: 'Author 2', price: 15 }
      ]
      
      const provider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue(booksWithoutSales)
      }
      const testService = metricsService(provider)

      const result = await testService.getMetrics()

      expect(result.mean_units_sold).toBeNull()
      expect(result.cheapest_book).toEqual(booksWithoutSales[1])
    })

    it('should calculate mean only for books with unitsSold', async () => {
      const mixedBooks: Book[] = [
        { id: '1', name: 'Book 1', author: 'Author 1', units_sold: 100, price: 20 },
        { id: '2', name: 'Book 2', author: 'Author 2', price: 15 },
        { id: '3', name: 'Book 3', author: 'Author 3', units_sold: 200, price: 25 }
      ]
      
      const provider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue(mixedBooks)
      }
      const testService = metricsService(provider)

      const result = await testService.getMetrics()

      expect(result.mean_units_sold).toBe(150) // (100 + 200) / 2
    })

    it('should find cheapest book among books with valid prices', async () => {
      const books: Book[] = [
        { id: '1', name: 'Book 1', author: 'Author 1', units_sold: 100, price: 20 },
        { id: '2', name: 'Book 2', author: 'Author 2', units_sold: 200, price: 5 },
        { id: '3', name: 'Book 3', author: 'Author 3', units_sold: 300, price: 25 }
      ]
      
      const provider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue(books)
      }
      const testService = metricsService(provider)

      const result = await testService.getMetrics()

      expect(result.cheapest_book).toEqual(books[1])
    })

    it('should handle single book', async () => {
      const singleBook: Book[] = [
        { id: '1', name: 'Only Book', author: 'Solo Author', units_sold: 100, price: 20 }
      ]
      
      const provider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue(singleBook)
      }
      const testService = metricsService(provider)

      const result = await testService.getMetrics()

      expect(result.mean_units_sold).toBe(100)
      expect(result.cheapest_book).toEqual(singleBook[0])
    })

    it('should handle books with zero price', async () => {
      const books: Book[] = [
        { id: '1', name: 'Free Book', author: 'Author 1', units_sold: 100, price: 0 },
        { id: '2', name: 'Paid Book', author: 'Author 2', units_sold: 200, price: 15 }
      ]
      
      const provider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue(books)
      }
      const testService = metricsService(provider)

      const result = await testService.getMetrics()

      expect(result.cheapest_book).toEqual(books[0])
    })

    it('should handle books with zero units_sold', async () => {
      const books: Book[] = [
        { id: '1', name: 'Book 1', author: 'Author 1', units_sold: 0, price: 20 },
        { id: '2', name: 'Book 2', author: 'Author 2', units_sold: 100, price: 15 }
      ]
      
      const provider: BooksProvider = {
        getBooks: vi.fn().mockResolvedValue(books)
      }
      const testService = metricsService(provider)

      const result = await testService.getMetrics()

      expect(result.mean_units_sold).toBe(50) // (0 + 100) / 2
    })
  })

  describe('getMetrics - provider errors', () => {
    it('should propagate errors from provider', async () => {
      const errorProvider: BooksProvider = {
        getBooks: vi.fn().mockRejectedValue(new Error('API Error'))
      }
      const errorService = metricsService(errorProvider)

      await expect(errorService.getMetrics()).rejects.toThrow('API Error')
    })
  })
})