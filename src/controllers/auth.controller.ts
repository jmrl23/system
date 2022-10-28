import passport from 'passport'
import { Router } from 'express'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  PASSPORT_GOOGLE_CALLBACK_URL
} from '../configurations'
import { db, cache } from '../services'
import { rateLimiter, sessionRequired } from '../middlewares'

passport.use(
  new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: PASSPORT_GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
  }, async (_accessToken, _refreshToken, profile, next) => {
    const data = profile._json
    if (!data.email?.endsWith('@paterostechnologicalcollege.edu.ph'))
      return next('Cannot sign in, use PTC institutional email')
    try {
      const user = await db.user.upsert({
        where: { email: data.email },
        update: {},
        create: { email: data.email }
      })
      next(null, user.id)
    } catch (error: unknown) {
      if (error instanceof Error)
        next(error.message)
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
    const result = await db.user.findUnique({
      where: { id: userId }
    })
    await cache.put(`user-${result?.id}`, result)
    done(null, result)
  } catch (error: unknown) {
    if (error instanceof Error) done(error.message)
  }
})

const controller = Router()

controller.use(rateLimiter({ max: 50 }))

controller

  .get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  )

  .get('/google/redirect',
    passport.authenticate('google'),
    function (_request, response) {
      response.redirect('/')
    })

  .get('/logout',
    sessionRequired,
    function (request, response) {
      if (request.user) cache.del(`user-${request.user}`)
      request.logOut({ keepSessionInfo: false },
        (error) => {
          if (error) {
            return response.status(400).json({
              statusCode: 400,
              message: error.message,
              error: 'Bad Request'
            })
          }
          response.redirect('/')
        }
      )
    })

export { controller }