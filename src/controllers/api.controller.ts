import { Role } from '@prisma/client'
import { Request, Response, Router } from 'express'
import { authorization, validateBody } from '../middlewares'
import { cached, db } from '../services'
import { ApiFetchUsers } from '../types'

const controller = Router()

controller

  .post(
    '/fetch-users',
    authorization([Role.ADMIN, Role.REGISTRY]),
    validateBody(ApiFetchUsers),
    async function (request: Request, response: Response) {
      const q = JSON.stringify(request.body)
      const data = await cached(
        `api-fetch-users ${q}`,
        async () => {
          return await db.user.findMany({
            where: {
              UserLevel: {
                role: request.body?.role
              }
            },
            skip: request.body?.skip,
            take: request.body?.take,
            include: {
              StudentInformation: request.body?.role === Role.STUDENT
            }
          })
        },
        180_000
      )
      response.json(data)
    }
  )

  .post(
    '/fetch-departments',
    async function (_request: Request, response: Response) {
      const data = await cached(
        `api-fetch-departments`,
        async () => {
          return await db.department.findMany({})
        },
        180_000
      )
      response.json(data)
    }
  )

export { controller }
