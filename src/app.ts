import express from 'express'
import passport from 'passport'
import helmet from 'helmet'
import { join } from 'path'
import { controller } from './controllers'
import {
  session,
  logger,
  compressor,
  publicMinifier,
  htmlMinifier,
  responseErrorHandler,
  rateLimiter
} from './middlewares'
import { staticConfig } from './configurations'
import { NotFoundError } from 'express-response-errors'
import type { Request, Response, NextFunction } from 'express'

const app = express()

/** configurations */
app.set('view engine', 'ejs')
app.set('views', join(__dirname, '../views'))
app.set('trust proxy', 1)

/** middlewares */
app.use(
  session,
  logger,
  compressor,
  publicMinifier,
  htmlMinifier,
  express.json(),
  express.urlencoded({ extended: false }),
  passport.initialize(),
  passport.session(),
  helmet({ contentSecurityPolicy: false })
)

/** static/ public files */
app.use(
  rateLimiter({ max: 200 }),
  express.static(join(__dirname, '../public/static'), staticConfig),
  express.static(join(__dirname, '../public/dist'), staticConfig),
)

/** controllers */
app.use(
  rateLimiter({ max: 25 }),
  controller,
  (_request: Request, _response: Response, next: NextFunction) =>
    next(new NotFoundError('The page you are looking for might have been remove or temporary unavailable')),
  responseErrorHandler
)

export { app }