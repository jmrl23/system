import type { Request, Response, NextFunction } from 'express'
import * as config from '../configurations'

function ejsVars(request: Request, response: Response, next: NextFunction) {
  response.locals.config = config
  response.locals.user = request.user
  next()
}

export { ejsVars }