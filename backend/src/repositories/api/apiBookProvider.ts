import { Book } from '../../models/book.ts'
import { BooksProvider } from '../../providers/books.ts'

interface ApiBooksResponse {
  id: string | number
  name: string
  author: string
  units_sold?: string | number
  price: string | number
}

const apiBookProvider = (): BooksProvider => {
  const API_URL = 'https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books'

  const getBooks = async (): Promise<Book[]> => {
    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiBooksResponse[] = await response.json()

      const books: Book[] = data.map(item => {
        const book: Book = {
          id: item.id,
          name: item.name,
          author: item.author,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
        }

        // Solo agregar units_sold si existe en la respuesta
        if (item.units_sold !== undefined && item.units_sold !== null) {
          book.units_sold = typeof item.units_sold === 'string' 
            ? parseInt(item.units_sold) 
            : item.units_sold
        }

        return book
      })

      return books

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching books from API:', error.message)
        throw new Error(`Failed to fetch books: ${error.message}`)
      }
      throw new Error('Failed to fetch books: Unknown error')
    }
  }

  return {
    getBooks
  }
}

export default apiBookProvider