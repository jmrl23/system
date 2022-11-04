import type { NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-response-errors'

/**
 * If the error is not an instance of HttpError, then if next is defined, call next(error), otherwise
 * do nothing. Otherwise, if the error code is 404, and the request method is GET, then render the
 * page-not-found template with the error message. Otherwise, set the response status code to the error
 * code, and send a JSON response with the error code, message, and name.
 * @param {HttpError} error - The error object that was thrown.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * @param {NextFunction | undefined} [next] - The next function in the middleware chain.
 * @returns the response.render() method.
 */
function responseErrorHandler(
  error: HttpError,
  request: Request,
  response: Response,
  next?: NextFunction | undefined
) {
  if (!(error instanceof HttpError) ?? response.headersSent) {
    if (typeof next !== 'undefined') return next(error)
  }
  if (error.code === 404) {
    if (request.method === 'GET') {
      return response.render('page-not-found', {
        message: error.message
      })
    }
  }
  response.status(error.code).json({
    statusCode: error.code,
    message: error.message,
    error: error.name
      .replace(/([A-Z])/g, ' $1')
      .replace(/Error$/g, '')
      .trim()
  })
}

export { responseErrorHandler }
