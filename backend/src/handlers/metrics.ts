import { Request, Response } from 'express'
import metricsService from '../services/metricsService.ts'
import { BooksProvider } from '../providers/books.ts'
import { MetricsQuery, MetricsResponse, ErrorResponse } from '../types/metricsTypes.ts'

const metricsHandler = (booksProvider: BooksProvider) => {
  const service = metricsService(booksProvider)

  const get = async (
    req: Request<{}, {}, {}, MetricsQuery>, 
    res: Response<MetricsResponse | ErrorResponse>
  ): Promise<void> => {
    try {
      const { author } = req.query
      
      const metrics = await service.getMetrics(author)
      
      res.status(200).json(metrics)
    } catch (error) {
      console.error('Error getting metrics:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      res.status(500).json({
        error: 'Failed to get metrics',
        message: errorMessage
      })
    }
  }

  return {
    get
  }
}

export default metricsHandler