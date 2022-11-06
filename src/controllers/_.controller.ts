import type { Request, Response, NextFunction } from 'express'
import type { SessionUser } from '../types'
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
      const user = request.user as SessionUser
      if (user.isDisabled) return response.render('disabled')
      if (user.UserRole.role === Role.ADMIN) return response.render('admin')
      if (user.UserRole.role === Role.REGISTRY)
        return response.render('registry')
      if (user.UserRole.role === Role.STUDENT) {
        if (!user.UserBasicInfo) return response.render('student-init')
        return response.render('student')
      }
      next(new InternalServerError('An error occurs to server'))
    }
  )

  .get(
    '/profile',
    function (request: Request, response: Response, next: NextFunction) {
      const user = request.user as SessionUser
      if (request.isUnauthenticated() || user.UserRole.role !== Role.STUDENT)
        return next()
      response.render('profile')
    }
  )

export { controller }
