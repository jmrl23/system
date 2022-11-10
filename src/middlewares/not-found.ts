import type { NextFunction, Request, Response } from 'express'
import { NotFoundError } from 'express-response-errors'

/**
 * It takes in a request, response, and next function as arguments. It then calls the next function
 * with a new NotFoundError object as an argument.
 *
 * The next function is a function that is passed to the middleware function by the Express framework.
 * It is used to pass control to the next middleware function in the chain.
 *
 * The NotFoundError object is a custom error object that we will create in the next section.
 * @param {Request} _request - Request - The incoming request object.
 * @param {Response} _response - Response - The response object
 * @param {NextFunction} next - NextFunction - The next function to be called in the middleware chain.
 */
export function notFound(
  _request: Request,
  _response: Response,
  next: NextFunction
) {
  next(
    new NotFoundError(
      'The page you are looking for might have been removed or temporary unavailable.'
    )
  )
}
