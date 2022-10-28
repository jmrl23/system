import morgan from 'morgan'
import { NODE_ENV } from '../configurations'
import type { Request, Response, NextFunction } from 'express'

/**
 * If the environment is production, use the 'common' 
 * format, if the environment is development, use
 * the 'dev' format, otherwise, call the next function
 * @param {Request} req - Request - The request object.
 * @param {Response} res - Response - The response object
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns The return value of the function that is passed to morgan.
 */
function logger(req: Request, res: Response, next: NextFunction): void {
  if (NODE_ENV === 'production') return morgan('common')(req, res, next)
  if (NODE_ENV === 'development') return morgan('dev')(req, res, next)
  next()
}

export { logger }