import type { NextFunction, Request, Response } from 'express'
import { NotFoundError } from 'express-response-errors'

/**
 * If the request is authenticated, call the next function, 
 * otherwise call the next function with a new
 * NotFoundError
 * @param {Request} request - Request - The request object.
 * @param {Response} _response - Response - The response object.
 * @param {NextFunction} next - NextFunction - This is a function 
 * that you call when you want to pass
 * control to the next middleware function in the chain.
 * @returns The function isAuthenticated is being returned.
 */
function isAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  if (request.isAuthenticated()) return next()
  next(new NotFoundError())
}

export { isAuthenticated }