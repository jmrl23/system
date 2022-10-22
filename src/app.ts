import express from 'express'
import { join } from 'path'
import { NODE_ENV } from './configurations'
import { controller } from './controllers'
import { pageNotFound } from './controllers/404'
import { rateLimiter, session, logger, compressor, publicMinifier, htmlMinifier } from './middlewares'

const app = express()

/** configurations */
app.set('view engine', 'ejs')
app.set('views', join(__dirname, '../views'))
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1)
  app.disable('x-powered-by')
}

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
  express.static(join(__dirname, '../public'), {
    maxAge: process.env.NODE_ENV === 'production' ?
      '31536000' : 'public, max-age=0'
  }),
)

/** controllers */
app.use(
  controller,
  pageNotFound
)

export { app }