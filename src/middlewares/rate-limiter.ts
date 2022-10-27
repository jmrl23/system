import limiter from 'express-rate-limit'
import type { Options } from 'express-rate-limit'
import type { Request, Response } from 'express'

const rateLimiter = (passedOptions: Partial<Options> = {}) => {
  return limiter({
    windowMs: 5 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: async (request: Request, response: Response) => {
      const statusCode = request.statusCode ?? 429
      return response.status(statusCode).json({
        statusCode,
        message: `Cannot ${request.method} ${request.url}`,
        error: 'Too Many Requests'
      })
    },
    ...passedOptions
  })
}

export { rateLimiter }