import type { NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-response-errors'

/**
 * If the error is not an instance of HttpError, and the 
 * response headers have not been sent, then call
 * the next function with the error. Otherwise, send a 
 * response with the error code, error name, and
 * error message
 * @param {HttpError} error - HttpError - The error object that was thrown
 * @param {Request} _request - Request - The request object
 * @param {Response} response - The response object
 * @param {NextFunction | undefined} [next] - The next function to be 
 * called in the middleware chain.
 * @returns The responseErrorHandler function is being returned.
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
  response
    .status(error.code)
    .json({
      statusCode: error.code,
      message: error.message,
      error: error.name
        .replace(/([A-Z])/g, ' $1')
        .replace(/Error$/g, '')
        .trim()
    })
}

export { responseErrorHandler }