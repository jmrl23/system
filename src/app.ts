import express from 'express'
import passport from 'passport'
import helmet from 'helmet'
import flash from 'connect-flash'
import { join } from 'path'
import { controller } from './controllers'
import { TRUST_PROXY, staticConfig, helmetConfig } from './configurations'
import { NotFoundError } from 'express-response-errors'
import {
  session,
  logger,
  compressor,
  publicMinifier,
  htmlMinifier,
  responseErrorHandler,
  rateLimiter,
  ejsVars,
  isMaintenance
} from './middlewares'
import type { Request, Response, NextFunction } from 'express'

const app = express()

/** configurations */
app.set('view engine', 'ejs')
app.set('views', join(__dirname, '../views'))
app.set('trust proxy', TRUST_PROXY)

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
  helmet(helmetConfig),
  ejsVars
)

/** static/ public files */
app.use(
  rateLimiter({ max: 200 }),
  express.static(join(__dirname, '../public/static'), staticConfig),
  express.static(join(__dirname, '../public/dist'), staticConfig)
)

/** controllers */
app.use(
  rateLimiter({ max: 15 }),
  flash(),
  isMaintenance,
  controller,
  (_request: Request, _response: Response, next: NextFunction) =>
    next(
      new NotFoundError(
        'The page you are looking for might have been remove or temporary unavailable'
      )
    ),
  responseErrorHandler
)

export { app }
