import morgan from 'morgan'
import { NODE_ENV } from '../configurations'
import type { Request, Response, NextFunction } from 'express'

/**
 * If the environment is production, use the 'common' format, if the environment is development, use
 * the 'dev' format, otherwise, do nothing.
 * @param {Request} request - Request - The incoming request object.
 * @param {Response} response - Response - The response object
 * @param {NextFunction} next - A function to be called to invoke the next middleware function in the
 * stack.
 * @returns The function is being returned.
 */
export function logger(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (NODE_ENV === 'production')
    return morgan('common')(request, response, next)
  if (NODE_ENV === 'development') return morgan('dev')(request, response, next)
  next()
}
