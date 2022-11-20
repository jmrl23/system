import type { NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-response-errors'

/**
 * If the error is not an instance of HttpError, then call next(error) if next is defined, otherwise do
 * nothing.
 *
 * If the error is an instance of HttpError, then if the response headers have not been sent, then set
 * the response status code to the error code, and if the request method is GET and the error code is
 * greater than 399, then if the error code is less than 500, render the 4xx template, otherwise render
 * the 5xx template, otherwise render the error as JSON.
 * @param {HttpError} error - The error object that was thrown.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object
 * @param {NextFunction | undefined} [next] - The next function to be called in the middleware chain.
 * @returns the response.json() method.
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
  if (request.method === 'GET' && code > 399) {
    if (code < 500) return response.render('4xx', { code, message })
    return response.render('5xx', { code, message })
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
