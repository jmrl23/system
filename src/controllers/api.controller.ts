import type { NextFunction, Response, Request } from 'express'
import type { SessionUser } from '../types'
import { Role } from '@prisma/client'
import { Router } from 'express'
import { InternalServerError, UnauthorizedError } from 'express-response-errors'
import { db } from '../services'

const controller = Router()

function authorization(role: Role[]) {
  return function (request: Request, _response: Response, next: NextFunction) {
    const user = request.user as SessionUser
    if (request.isUnauthenticated() || role.includes(user.UserRole.role))
      return next(new UnauthorizedError('Access denied'))
    next()
  }
}

controller.use('/admin', authorization([Role.ADMIN]))
controller.use('/registry', authorization([Role.REGISTRY]))

controller.get(
  '/student-list',
  authorization([Role.ADMIN, Role.REGISTRY]),
  async function (request: Request, response: Response, next: NextFunction) {
    try {
      let { skip, take } = request.query
      if (typeof skip !== 'string') skip = '0'
      if (typeof take !== 'string') take = '0'
      const users = await db.user.findMany({
        where: {
          UserRole: { role: Role.STUDENT }
        },
        skip: parseInt(skip || '0', 10),
        take: parseInt(take || '0', 10),
        include: { UserRole: true, UserBasicInfo: true }
      })
      response.json(users)
    } catch (error: unknown) {
      if (error instanceof Error) next(new InternalServerError(error.message))
    }
  }
)

export { controller }
