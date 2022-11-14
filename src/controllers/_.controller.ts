import type { Request, Response, NextFunction } from 'express'
import type { ExpressUser } from '../types'
import { Router } from 'express'
import { InternalServerError } from 'express-response-errors'
import { Role } from '@prisma/client'

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
      if (user?.UserLevel.role === Role.ADMIN) return response.render('admin')
      if (user?.UserLevel.role === Role.REGISTRY)
        return response.render('registry')
      if (user?.UserLevel.role === Role.STUDENT) {
        if (!user?.StudentInformation) return response.render('student-init')
        return response.render('student')
      }
      next(new InternalServerError('An error occurs to server'))
    }
  )

  .get(
    '/profile',
    function (request: Request, response: Response, next: NextFunction) {
      const user = request.user as ExpressUser
      if (request.isUnauthenticated() || user?.UserLevel.role !== Role.STUDENT)
        return next()
      response.render('profile')
    }
  )

export { controller }
