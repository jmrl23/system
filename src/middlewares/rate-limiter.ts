import type { Options } from 'express-rate-limit'
import type { NextFunction, Request, Response } from 'express'
import limiter from 'express-rate-limit'
import { TooManyRequestsError } from 'express-response-errors'

/**
 * It returns a function that takes a request, response, and next function, and if the request method
 * is GET, it renders a limit-reached page, otherwise it calls next with a TooManyRequestsError
 * @param passedOptions - Partial<Options> = {}
 * @returns A function that returns a function that returns a function.
 */
function rateLimiter(passedOptions: Partial<Options> = {}) {
  return limiter({
    windowMs: 60000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      if (request.method === 'GET') {
        return response.status(429).render('limit-reached')
      }
      next(new TooManyRequestsError('Rate limit reached'))
    },
    ...passedOptions
  })
}

export { rateLimiter }
