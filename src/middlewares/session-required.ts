import type { NextFunction, Request, Response } from 'express'
import { ForbiddenError } from 'express-response-errors'

/**
 * If the request object has a user property that 
 * is an object, then call the next function. Otherwise,
 * call the next function with a ForbiddenError
 * @param {Request} request - The request object.
 * @param {Response} _response - Response - The response object.
 * @param {NextFunction} next - A function to call when the 
 * middleware is complete.
 * @returns A function that takes a request, response, and next function.
 */
function sessionRequired(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  if (typeof request.user === 'object') return next()
  next(new ForbiddenError('Not signed in'))
}

export { sessionRequired }