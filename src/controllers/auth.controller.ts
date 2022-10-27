import passport from 'passport'
import { Router } from 'express'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PASSPORT_GOOGLE_CALLBACK_URL } from '../configurations'
import { db } from '../services'
import { User } from '@prisma/client'
import { cache } from '../services'
import { sessionRequired } from '../middlewares'

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
      next(null, user)
    } catch (error: unknown) {
      if (error instanceof Error)
        next(error.message)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user))
})

passport.deserializeUser(async (user, done) => {
  const _user = JSON.parse(user as string) as User
  try {
    const cachedUser = await cache.get(`user-${_user.id}`)
    if (cachedUser) return done(null, cachedUser)
    const result = await db.user.findFirst({
      where: { id: _user.id }
    })
    await cache.put(`user-${result?.id}`, result)
    done(null, result)
  } catch (error: unknown) {
    if (error instanceof Error) done(error.message)
  }
})

const controller = Router()

controller.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}))

controller.get('/google/redirect', passport.authenticate('google'), function (_request, response) {
  response.redirect('/')
})

controller.get('/logout', sessionRequired, function (request, response) {
  if (request.user) {
    const user = request.user as User
    cache.del(`user-${user.id}`)
  }
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