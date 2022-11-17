import { Role } from '@prisma/client'
import { NextFunction, Request, Response, Router } from 'express'
import { BadRequestError, InternalServerError } from 'express-response-errors'
import { authorization, validateBody } from '../middlewares'
import { cached, db } from '../services'
import {
  ApiUsersGet,
  ApiDepartmentToggle,
  ApiUserSetRole,
  ApiUserToggle,
  ApiDepartmentCreate
} from '../types'

const controller = Router()

controller

  .post(
    '/users/get',
    authorization([Role.ADMIN, Role.REGISTRY]),
    validateBody(ApiUsersGet),
    async function (request: Request, response: Response, next: NextFunction) {
      const { role, take, skip } = request.body
      const q = JSON.stringify(request.body)
      try {
        const data = await cached(
          `${request.url.toString()} ${q}`,
          async () => {
            return await db.user.findMany({
              where: {
                UserLevel: { role }
              },
              skip,
              take,
              include: {
                StudentInformation: request.body?.role === Role.STUDENT
              }
            })
          },
          180_000
        )
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
        const data = await db.userLevel.upsert({
          where: { email },
          update: { role },
          create: { email, role }
        })
        response.json(data)
      } catch (error) {
        if (error instanceof Error) next(new BadRequestError(error.message))
      }
    }
  )

  .post(
    '/departments/get',
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const data = await cached(
          request.url.toString(),
          async () => {
            return await db.department.findMany({})
          },
          180_000
        )
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
