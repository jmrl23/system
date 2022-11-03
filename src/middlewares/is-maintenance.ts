import type { Request, Response, NextFunction } from 'express'
import { ServiceUnavailableError } from 'express-response-errors'
import { IS_MAINTENANCE } from '../configurations'

function isMaintenance(request: Request, response: Response, next: NextFunction) {
  if (IS_MAINTENANCE) {
    if (request.method === 'GET') return response.status(503).render('maintenance')
    return next(new ServiceUnavailableError('Maintenance'))
  }
  next()
}

export { isMaintenance }