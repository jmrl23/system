import type { NextFunction, Request, Response } from 'express'
import type { SessionUser } from '../types'
import { BadRequestError } from 'express-response-errors'

/**
 * If the user is authenticated, check if the user is disabled. If the user is disabled, render the
 * disabled page if the request method is GET, otherwise throw a BadRequestError. If the user is not
 * disabled, continue to the next middleware. If the user is not authenticated, throw a BadRequestError
 * @param {Request} request - Request - The request object
 * @param {Response} response - Response - The response object
 * @param {NextFunction} next - NextFunction - This is a function that will be called when the
 * middleware is done.
 * @returns The function isAuthenticated is being returned.
 */
function isAuthenticated(request: Request, response: Response, next: NextFunction) {
  if (request.isAuthenticated()) {
    const user = request.user as SessionUser
    if (user.isDisabled) {
      if (request.method === 'GET') return response.render('disabled')
      return next(new BadRequestError('Account has been disabled'))
    }
    next()
  }
  next(new BadRequestError('You are not signed in'))
}

export { isAuthenticated }