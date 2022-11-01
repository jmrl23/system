import type { Request, Response, NextFunction } from 'express'
import * as config from '../configurations'

function ejsVars(_request: Request, response: Response, next: NextFunction) {
  response.locals.config = config
  next()
}

export { ejsVars }