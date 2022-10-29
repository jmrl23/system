import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { NotFoundError } from 'express-response-errors'

const controller = Router()

controller

  .get('/',
    function (request: Request, response: Response) {
      if (request.isUnauthenticated())
        return response.redirect('/login')
      response.render('home', {
        title: 'System'
      })
    })

  .get('/login',
    function (
      request: Request,
      response: Response,
      next: NextFunction
    ) {
      if (request.isAuthenticated())
        return next(new NotFoundError())
      response.render('sign-in')
    })

export { controller }