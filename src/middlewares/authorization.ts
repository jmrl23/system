import type { Role } from '@prisma/client'
import type { ExpressUser } from '../types'
import type { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from 'express-response-errors'
import { API_AUTH_KEY } from '../configurations'

/**
 * If the user is authenticated and has a role that is included in the roles array, then call next()
 * @param {Role[]} roles - Role[] - an array of roles that are allowed to access the route
 * @returns A function that takes a request, response, and next function.
 */
export function authorization(roles: Role[]) {
  return function (request: Request, _response: Response, next: NextFunction) {
    const user = request.user as ExpressUser
    const key = request.query.authorization_key as string | undefined
    if (
      (typeof key === 'string' && key === API_AUTH_KEY) ||
      (request.isAuthenticated() && user && roles.includes(user.UserLevel.role))
    )
      return next()
    next(new UnauthorizedError('Access denied'))
  }
}
