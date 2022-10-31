import limiter from 'express-rate-limit'
import { TooManyRequestsError } from 'express-response-errors'
import type { Options } from 'express-rate-limit'
import type { NextFunction, Request, Response } from 'express'

/**
 * It returns a function that takes a request and a response 
 * and calls the passed function with the request and response
 * @param passedOptions - Partial<Options> = {}
 * @returns A function that takes in a request and response 
 * object and returns a promise.
 */
function rateLimiter(passedOptions: Partial<Options> = {}) {
  return limiter({
    windowMs: 60000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (_request: Request, _response: Response, next: NextFunction) => {
      next(new TooManyRequestsError('Rate limit reached'))
    },
    ...passedOptions
  })
}

export { rateLimiter }