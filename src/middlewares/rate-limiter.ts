import type { Options } from 'express-rate-limit'
import type { NextFunction, Request, Response } from 'express'
import limiter from 'express-rate-limit'
import { TooManyRequestsError } from 'express-response-errors'

function rateLimiter(passedOptions: Partial<Options> = {}) {
  return limiter({
    windowMs: 60000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (
      _request: Request,
      _response: Response,
      next: NextFunction
    ) => {
      next(
        new TooManyRequestsError(
          'Sorry, this link is automatically turned off for now, try again later'
        )
      )
    },
    ...passedOptions
  })
}

export { rateLimiter }
