import type { Role } from '@prisma/client'
import type { SessionUser } from '../types'
import type { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from 'express-response-errors'

/**
 * It takes an array of roles and returns a function that takes a request, response, and next function.
 *
 *
 * The returned function checks if the request is unauthenticated or if the user's role is included in
 * the array of roles. If either of those are true, it returns the next function with a new
 * UnauthorizedError. Otherwise, it calls the next function.
 * @param {Role[]} role - Role[] - an array of roles that are allowed to access the route
 * @returns A function that takes a request, response, and next function.
 */
function authorization(role: Role[]) {
  return function (request: Request, _response: Response, next: NextFunction) {
    const user = request.user as SessionUser
    if (request.isUnauthenticated() || role.includes(user.UserRole.role))
      return next(new UnauthorizedError('Access denied'))
    next()
  }
}

export { authorization }