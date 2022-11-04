import type { Request, Response, NextFunction } from 'express'
import { ServiceUnavailableError } from 'express-response-errors'
import { IS_MAINTENANCE } from '../configurations'

/**
 * If the server is in maintenance mode, and the request is a GET request, render the maintenance page,
 * otherwise, if the server is in maintenance mode, throw a ServiceUnavailableError, otherwise,
 * continue to the next middleware
 * @param {Request} request - The request object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param {Response} response - Response - The response object.
 * @param {NextFunction} next - This is a function that you call when you're done with your middleware.
 * @returns The function isMaintenance is being returned.
 */
function isMaintenance(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (IS_MAINTENANCE) {
    if (request.method === 'GET')
      return response.status(503).render('maintenance')
    return next(new ServiceUnavailableError('Maintenance'))
  }
  next()
}

export { isMaintenance }
