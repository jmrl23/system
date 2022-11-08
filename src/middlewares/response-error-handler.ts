import type { NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-response-errors'

/**
 * If the error is not an instance of HttpError, then if next is defined, call next(error), otherwise
 * do nothing. Otherwise, if the request method is GET, then if the code is 404, render the
 * page-not-found template with the message, otherwise if the code is 429, render the limit-reached
 * template with the message, otherwise if the code is 503, render the maintenance template with the
 * message, otherwise do nothing. Otherwise, set the status code to the error code, and render the json
 * response with the status code, message, and error name.
 * @param {HttpError} error - The error object that was thrown.
 * @param {Request} request - Request - The request object
 * @param {Response} response - The response object
 * @param {NextFunction | undefined} [next] - The next function to be called in the middleware chain.
 * @returns the response object.
 */
export function responseErrorHandler(
  error: HttpError,
  request: Request,
  response: Response,
  next?: NextFunction | undefined
) {
  if (!(error instanceof HttpError) ?? response.headersSent) {
    if (typeof next !== 'undefined') return next(error)
  }
  const { code, message, name } = error
  response.status(code)
  if (request.method === 'GET') {
    if (code === 404) return response.render('page-not-found', { message })
    if (code === 429) return response.render('limit-reached', { message })
    if (code === 503) return response.render('maintenance', { message })
  }
  response.json({
    statusCode: code,
    message: message,
    error: name
      .replace(/([A-Z])/g, ' $1')
      .replace(/Error$/g, '')
      .trim()
  })
}
