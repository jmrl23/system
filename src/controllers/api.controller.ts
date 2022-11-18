/* eslint-disable indent */
import { Role } from '@prisma/client'
import { NextFunction, Request, Response, Router } from 'express'
import { BadRequestError, InternalServerError } from 'express-response-errors'
import { authorization, validateBody } from '../middlewares'
import { cached, db } from '../services'
import {
  ApiUsersGet,
  ApiUserSetRole,
  ApiUserToggle,
  ApiDepartmentToggle,
  ApiDepartmentCreate,
  ApiDepartmentUpdate,
  ApiDepartmentDelete,
  ApiUserGet
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
        const q = JSON.stringify(request.body)
        const data = await cached(
          `${request.url.toString()} ${q}`,
          async () => {
            return await db.user.findMany({
              where: {
                AND: [
                  { UserLevel: { role } },
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
          },
          60000
        )
        response.json(data)
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
        await db.userLevel.delete({ where: { email } })
        const user = await db.user.update({
          where: { email },
          data: { isDisabled: true },
          include: { UserLevel: true }
        })
        response.json(user)
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
        const data = await db.department.findMany({})
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

export { controller }
