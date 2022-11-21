/* eslint-disable indent */
import { Role } from '@prisma/client'
import { NextFunction, Request, Response, Router } from 'express'
import { BadRequestError, InternalServerError } from 'express-response-errors'
import { authorization, validateBody } from '../middlewares'
import { db } from '../services'
import {
  ApiUsersGet,
  ApiUserSetRole,
  ApiUserToggle,
  ApiDepartmentToggle,
  ApiDepartmentCreate,
  ApiDepartmentUpdate,
  ApiDepartmentDelete,
  ApiUserGet,
  ApiRolesGet,
  ExpressUser
} from '../types'

const controller = Router()

controller

  .post(
    '/users/get',
    authorization([Role.ADMIN, Role.REGISTRY]),
    validateBody(ApiUsersGet),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { role, take, skip, keyword } = request.body
        const users = await db.user.findMany({
          where: {
            AND: [
              { UserLevel: { role: { in: role } } },
              {
                OR: [
                  { id: { contains: keyword } },
                  { givenName: { contains: keyword } },
                  { email: { contains: keyword } }
                ]
              }
            ]
          },
          skip,
          take,
          include: {
            StudentInformation: request.body?.role === Role.STUDENT
          }
        })
        response.json(users)
      } catch (error) {
        if (error instanceof Error) next(new InternalServerError(error.message))
      }
    }
  )

  .post(
    '/user/get',
    authorization([Role.ADMIN, Role.REGISTRY, Role.STUDENT]),
    validateBody(ApiUserGet),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const data = await db.user.findUnique({
          where: { id }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error) next(new InternalServerError(error.message))
      }
    }
  )

  .post(
    '/user/toggle',
    authorization([Role.ADMIN]),
    validateBody(ApiUserToggle),
    async function (request: Request, response: Response, next: NextFunction) {
      const { id, state } = request.body
      const user = request.user as ExpressUser
      if (user && user.id === id) return response.json(request.user)
      try {
        const data = await db.user.update({
          where: { id },
          data: { isDisabled: state }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/user/set-role',
    authorization([Role.ADMIN]),
    validateBody(ApiUserSetRole),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { email, role } = request.body
        const userLevel = await db.userLevel.upsert({
          where: { email },
          update: { role },
          create: { email, role }
        })
        const user = await db.user.findUnique({ where: { email } })
        if (user) {
          await db.user.update({
            where: { email },
            data: { isDisabled: false, userLevelId: userLevel.id }
          })
          const sessionUser = request.user as ExpressUser
          if (sessionUser?.id === user.id && sessionUser?.UserLevel?.role) {
            const data = await db.userLevel.update({
              where: { id: userLevel.id },
              data: { role: sessionUser?.UserLevel.role }
            })
            return response.json(data)
          }
        }
        response.json(userLevel)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/user/remove-role',
    authorization([Role.ADMIN]),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { email } = request.body
        const result = await db.userLevel.delete({
          where: { email },
          include: { User: true }
        })
        if (result.User) {
          await db.user.update({
            where: { id: result.User.id },
            data: { isDisabled: true },
            include: { UserLevel: true }
          })
        }
        response.json(result)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/departments/get',
    authorization([Role.ADMIN, Role.REGISTRY, Role.STUDENT]),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const data = await db.department.findMany({
          orderBy: { lastUpdated: 'desc' }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error) next(new InternalServerError(error.message))
      }
    }
  )

  .post(
    '/department/create',
    authorization([Role.ADMIN, Role.REGISTRY]),
    validateBody(ApiDepartmentCreate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const data = await db.department.create({ data: request.body })
        response.json(data)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/department/update',
    authorization([Role.ADMIN, Role.REGISTRY]),
    validateBody(ApiDepartmentUpdate),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id, name, alias, color } = request.body
        const data = await db.department.update({
          where: { id },
          data: { name, alias, color }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/department/delete',
    authorization([Role.ADMIN, Role.REGISTRY]),
    validateBody(ApiDepartmentDelete),
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const { id } = request.body
        const data = await db.department.delete({
          where: { id }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/department/toggle',
    authorization([Role.ADMIN, Role.REGISTRY]),
    validateBody(ApiDepartmentToggle),
    async function (request: Request, response: Response, next: NextFunction) {
      const { id, state } = request.body
      try {
        const data = await db.department.update({
          where: { id },
          data: { isDisabled: state }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/moderators/get',
    authorization([Role.ADMIN]),
    validateBody(ApiRolesGet),
    async function (request: Request, response: Response, next: NextFunction) {
      const { role, skip, take, keyword } = request.body
      try {
        const user = request.user as ExpressUser
        const result = await db.userLevel.findMany({
          where: {
            AND: [{ role: { in: role } }, { email: { contains: keyword } }],
            NOT: [{ email: user?.email }]
          },
          include: { User: true },
          skip,
          take,
          orderBy: { lastUpdated: 'desc' }
        })
        response.json(result)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

export { controller }
