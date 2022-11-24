import type { Request, Response, NextFunction } from 'express'
import * as config from '../configurations'

/**
 * It takes the request, response, and next function as arguments, and then sets the
 * response.locals.user to the request.user, and then sets the response.locals.key to the config.key
 * @param {Request} request - Request - The request object
 * @param {Response} response - Response - The response object
 * @param {NextFunction} next - NextFunction
 */
export function ejsVars(
  request: Request,
  response: Response,
  next: NextFunction
) {
  response.locals.user = request.user
  for (const key in config) {
    response.locals[key] = (config as Record<string, unknown>)[key]
  }
  next()
}
