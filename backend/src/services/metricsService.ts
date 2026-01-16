import { Book } from '../models/book.ts'
import { BooksProvider } from '../providers/books.ts'
import { MetricsResponse } from '../types/metricsTypes.ts'

const metricsService = (booksProvider: BooksProvider) => {
  
  const getMetrics = async (author?: string): Promise<MetricsResponse> => {
    const books = await booksProvider.getBooks()

    return {
      mean_units_sold: calculateMeanUnitsSold(books),
      cheapest_book: findCheapestBook(books),
      books_written_by_author: author ? filterBooksByAuthor(books, author) : []
    }
  }

  const calculateMeanUnitsSold = (books: Book[]): number | null => {
    if (books.length === 0) return null
    
    const booksWithSales = books.filter(book => 
      book.units_sold !== undefined && book.units_sold !== null
    )
    
    if (booksWithSales.length === 0) return null
    
    const totalUnitsSold = booksWithSales.reduce((sum, book) => sum + book.units_sold!, 0)
    return totalUnitsSold / booksWithSales.length
  }

  const findCheapestBook = (books: Book[]): Book | null => {
    if (books.length === 0) return null
    
    const booksWithPrice = books.filter(book => 
      book.price !== undefined && book.price !== null
    )
    
    if (booksWithPrice.length === 0) return null
    
    return booksWithPrice.reduce((cheapest, book) => {
      return book.price < cheapest.price ? book : cheapest
    }, booksWithPrice[0])
  }

  const filterBooksByAuthor = (books: Book[], author: string): Book[] => {
    return books.filter(book => 
      book.author && book.author.toLowerCase() === author.toLowerCase()
    )
  }

  return {
    getMetrics
  }
}

export default metricsService