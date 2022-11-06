import type { Request, Response, NextFunction } from 'express'
import * as config from '../configurations'

/**
 * It takes the request, response, and next objects as parameters, and then sets the config and user
 * variables on the response.locals object
 * @param {Request} request - The request object.
 * @param {Response} response - The response object
 * @param {NextFunction} next - The next function is a function in the Express router which, when
 * invoked, executes the middleware succeeding the current middleware.
 */
function ejsVars(request: Request, response: Response, next: NextFunction) {
  response.locals.config = config
  response.locals.user = request.user
  response.locals.toAttribute = (o: { [key: string]: string }) => {
    return Object.entries(o)
      .map(([key, value]) =>
        typeof value === 'boolean' && !value ? '' : `${key}=${value.toString()}`
      )
      .join(' ')
  }
  next()
}

export { ejsVars }
