import { Book } from '../models/book'

export interface MetricsResponse {
  mean_units_sold: number | null
  cheapest_book: Book | null
  books_written_by_author: Book[]
}

export interface MetricsQuery {
  author?: string
}

export interface ErrorResponse {
  error: string
  message: string
}