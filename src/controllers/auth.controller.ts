import passport from 'passport'
import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { db, cache } from '../services'
import { isAuthenticated, rateLimiter } from '../middlewares'
import { BadRequestError, NotFoundError } from 'express-response-errors'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  PASSPORT_GOOGLE_CALLBACK_URL
} from '../configurations'

passport.use(
  new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: PASSPORT_GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
  }, async (_accessToken, _refreshToken, profile, next) => {
    const data = profile._json
    if (!data.email?.endsWith('@paterostechnologicalcollege.edu.ph'))
      return next(null, undefined)
    try {
      const user = await db.user.findUnique({
        where: { email: data.email }
      })
      if (user) return next(null, user.id)
      const newUser = await db.user.create({
        data: { email: data.email }
      })
      next(null, newUser.id)
    } catch (error: unknown) {
      if (error instanceof Error) next(error.message)
    }
  })
)

passport.serializeUser((userId, done) => {
  done(null, userId)
})

passport.deserializeUser(async (userId: string, done) => {
  try {
    const cachedUser = await cache.get(`user-${userId}`)
    if (cachedUser) return done(null, cachedUser)
    const user = await db.user.findUnique({
      where: { id: userId }
    })
    if (user) {
      await cache.put(`user-${user?.id}`, user)
      return done(null, user)
    }
    throw new NotFoundError('Cannot find user')
  } catch (error: unknown) {
    if (error instanceof Error) done(error.message)
  }
})

const controller = Router()

/**
 * If the request is unauthenticated, then call the next 
 * function. If the request is authenticated, then throw 
 * a NotFoundError
 * @param {Request} request - Request - The request object
 * @param {Response} _response - Response - The response object.
 * @param {NextFunction} next - NextFunction - This 
 * is a function that will be called when the middleware is done.
 * @returns A function that takes a request, response, and next function.
 */
function notAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  if (request.isUnauthenticated()) return next()
  next(new NotFoundError())
}

controller.use(rateLimiter({ max: 50 }))

controller

  .get('/google',
    notAuthenticated,
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  )

  .get('/google/redirect',
    notAuthenticated,
    passport.authenticate('google'),
    function (_request: Request, response: Response) {
      response.redirect('/')
    })

  .get('/logout',
    isAuthenticated,
    function (request: Request, response: Response, next: NextFunction) {
      if (request.user) cache.del(`user-${request.user}`)
      request.logOut({ keepSessionInfo: false },
        (error) => {
          if (error)
            return next(new BadRequestError(error.message))
          response.redirect('/')
        }
      )
    })

export { controller }