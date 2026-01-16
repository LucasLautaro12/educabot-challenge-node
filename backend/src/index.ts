import express from 'express'
import cors from 'cors'
import apiBookProvider from './repositories/api/apiBookProvider.ts'
import metricsHandler from './handlers/metrics.ts'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

// Usar el provider de API en lugar del mock
const booksProvider = apiBookProvider()
const metricsHandlerInstance = metricsHandler(booksProvider)

app.get('/', metricsHandlerInstance.get)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { app }