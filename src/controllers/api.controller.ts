import type { NextFunction, Response, Request } from 'express'
import { Role } from '@prisma/client'
import { Router } from 'express'
import { InternalServerError } from 'express-response-errors'
import { cache, db } from '../services'
import { authorization, rateLimiter } from '../middlewares'

const controller = Router()

controller.use(rateLimiter({ max: 50 }))
controller.use('/admin', authorization([Role.ADMIN]))
controller.use('/registry', authorization([Role.REGISTRY]))
controller.use('/student', authorization([Role.ADMIN, Role.REGISTRY]))

controller.get(
  '/student/list',
  async function (request: Request, response: Response, next: NextFunction) {
    try {
      let { skip, take } = request.query
      if (typeof skip !== 'string') skip = '0'
      if (typeof take !== 'string') take = '15'
      const _skip = parseInt(skip, 10)
      const _take = parseInt(take, 10)
      const cached = await cache.get(
        `api/student/list?skip=${skip}&take=${take}`
      )
      if (cached) return response.json(cached)
      const users = await db.user.findMany({
        where: { UserRole: { role: Role.STUDENT } },
        skip: isNaN(_skip) ? 0 : _skip,
        take: isNaN(_take) ? 15 : _take,
        include: { UserRole: true, UserBasicInfo: true }
      })
      await cache.put(
        `api/student/list?skip=${skip}&take=${take}`,
        users,
        60_000
      )
      response.json(users)
    } catch (error: unknown) {
      if (error instanceof Error) next(new InternalServerError(error.message))
    }
  }
)

export { controller }
