import type { Request, Response, NextFunction } from 'express'
import type { ExpressUser } from '../types'
import { Router } from 'express'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { db, cache, cached } from '../services'
import {
  BadRequestError,
  InternalServerError,
  NotFoundError
} from 'express-response-errors'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ORGANIZATION_EMAIL_DOMAIN,
  PASSPORT_GOOGLE_CALLBACK_URL
} from '../configurations'
import passport from 'passport'

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: PASSPORT_GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (_accessToken, _refreshToken, profile, next) => {
      const data: typeof profile._json = profile._json
      if (!data.email?.endsWith(`@${ORGANIZATION_EMAIL_DOMAIN}`))
        return next(null, undefined, { message: 'Invalid email' })
      try {
        const user = await db.user.findUnique({
          where: { email: data.email },
          include: { UserLevel: true }
        })
        if (user && !user.isDisabled && !user?.UserLevel) {
          await db.user.update({
            where: { id: user.id },
            data: {
              userLevelId: await db.userLevel
                .create({ data: { email: data.email } })
                .then(({ id }) => id)
            }
          })
        }
        if (user) return next(null, user.id)
        const userLevel = await db.userLevel.findUnique({
          where: { email: data.email }
        })
        const newUser = await db.user.create({
          data: {
            email: data.email,
            givenName: data.given_name,
            familyName: data.family_name,
            displayName: data.name,
            picture: data.picture,
            userLevelId: userLevel
              ? userLevel.id
              : await db.userLevel
                  // eslint-disable-next-line indent
                  .create({ data: { email: data.email } })
                  // eslint-disable-next-line indent
                  .then(({ id }) => id)
          }
        })
        next(null, newUser.id)
      } catch (error: unknown) {
        if (error instanceof Error) next(new InternalServerError(error.message))
      }
    }
  )
)

passport.serializeUser((userId, done) => {
  done(null, userId)
})

passport.deserializeUser(async (userId: string, done) => {
  try {
    const user = await cached(
      `session-user-${userId}`,
      async () => {
        return db.user.findUnique({
          where: { id: userId },
          include: {
            UserLevel: true,
            StudentInformation: true
          }
        })
      },
      300_000
    )
    if (user) return done(null, user)
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
function isNotAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  if (request.isUnauthenticated()) return next()
  next(new BadRequestError('Already signed in'))
}

controller

  .get(
    '/google',
    isNotAuthenticated,
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  )

  .get(
    '/google/redirect',
    isNotAuthenticated,
    passport.authenticate('google', {
      failureRedirect: '/',
      failureFlash: true,
      successRedirect: '/'
    })
  )

  .post(
    '/logout',
    function (request: Request, _response: Response, next: NextFunction) {
      if (request.isAuthenticated()) return next()
      next(new BadRequestError('You are not signed in'))
    },
    function (request: Request, response: Response, next: NextFunction) {
      const user = request.user as ExpressUser
      if (user) cache.del(`session-user-${user.id}`)
      request.logOut({ keepSessionInfo: false }, (error) => {
        if (error) return next(new BadRequestError(error.message))
        response.status(200).json({ ok: true })
      })
    }
  )

export { controller }
