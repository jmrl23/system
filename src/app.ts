import express from 'express'
import passport from 'passport'
import { join } from 'path'
import { controller, pageNotFound } from './controllers'
import { rateLimiter, session, logger, compressor, publicMinifier, htmlMinifier } from './middlewares'
import { staticConfig } from './configurations'

const app = express()

/** configurations */
app.set('view engine', 'ejs')
app.set('views', join(__dirname, '../views'))
app.set('trust proxy', 1)
app.disable('x-powered-by')

/** middlewares */
app.use(
  rateLimiter(),
  session,
  logger,
  compressor,
  publicMinifier,
  htmlMinifier,
  express.json(),
  express.urlencoded({ extended: false }),
  express.static(join(__dirname, '../public/static'), staticConfig),
  express.static(join(__dirname, '../public/dist'), staticConfig),
  passport.initialize(),
  passport.session(),
)

/** controllers */
app.use(
  controller,
  pageNotFound
)

export { app }