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
import type { Request, Response } from 'express'

const app = express()

/** configurations */
app.set('view engine', 'ejs')
app.set('views', join(__dirname, '../views'))
app.set('trust proxy', 1)

/** middlewares */
app.use(
  helmet({ contentSecurityPolicy: false }),
  session,
  logger,
  compressor,
  publicMinifier,
  htmlMinifier,
  express.json(),
  express.urlencoded({ extended: false }),
  passport.initialize(),
  passport.session(),
)

/** static/ public files */
app.use(
  rateLimiter({ max: 500 }),
  express.static(join(__dirname, '../public/static'), staticConfig),
  express.static(join(__dirname, '../public/dist'), staticConfig),
)

/** controllers */
app.use(
  rateLimiter({ max: 200 }),
  controller,
  responseErrorHandler,
  (request: Request, response: Response) =>
    responseErrorHandler(new NotFoundError(), request, response)
)

export { app }