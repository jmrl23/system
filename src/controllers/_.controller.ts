import type { Request, Response, NextFunction } from 'express'
import type { ExpressUser } from '../types'
import { Router } from 'express'
import { InternalServerError } from 'express-response-errors'
import { Role } from '@prisma/client'
import { ORGANIZATION_EMAIL_DOMAIN } from '../configurations'
import { authorization } from '../middlewares'

const controller = Router()

controller

  .get(
    '/',
    function (request: Request, response: Response, next: NextFunction) {
      if (request.isUnauthenticated()) {
        return response.render('sign-in', {
          error: request.flash('error')[0]
        })
      }
      const user = request.user as ExpressUser
      if (user?.isDisabled) return response.render('disabled')
      if (user?.UserLevel?.role === Role.ADMIN) return response.render('admin')
      if (user?.UserLevel?.role === Role.REGISTRY)
        return response.render('registry')
      if (user?.UserLevel?.role === Role.STUDENT) {
        if (!user?.StudentInformation) return response.render('student-init')
        return response.render('student')
      }
      next(new InternalServerError('An error occurs to server'))
    }
  )

  .get(
    `/:email(([a-z]+)@${ORGANIZATION_EMAIL_DOMAIN})`,
    authorization([Role.ADMIN, Role.REGISTRY, Role.STUDENT]),
    function (_request: Request, response: Response) {
      // TODO: student profile
      response.render('profile')
    }
  )

export { controller }
