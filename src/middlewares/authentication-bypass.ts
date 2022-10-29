import { NODE_ENV, AUTH_BYPASS_MODE } from '../configurations'
import type { Request, Response, NextFunction } from 'express'

const payloads = {
  admin: {
    id: 'development_admin',
    email: 'development_admin@paterostechnologalcollege.edu.ph',
    dateCreated: new Date()
  },
  user: {
    id: 'development_user',
    email: 'development_user@paterostechnologalcollege.edu.ph',
    dateCreated: new Date()
  }
}

function authenticationBypass(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  if (
    NODE_ENV !== 'development' ||
    request.isAuthenticated() ||
    AUTH_BYPASS_MODE === 'none'
  ) return next()
  request.user = payloads[AUTH_BYPASS_MODE]
  next()
}

export { authenticationBypass }