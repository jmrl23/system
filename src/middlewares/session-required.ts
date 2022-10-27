import type { NextFunction, Request, Response } from 'express'

function sessionRequired(request: Request, response: Response, next: NextFunction) {
  if (request.user) return next()
  response.status(403).json({
    statusCode: 403,
    message: 'Not signed in',
    error: 'Forbidden'
  })
}

export { sessionRequired }