import type { Response, Request } from 'express'

/**
 * It takes a request and a response object as parameters, and returns a 404 status code with a JSON
 * object containing the status code, the request method and URL, and the error message
 * @param {Request} request - Request - The request object contains information about the HTTP request
 * that raised the event.
 * @param {Response} response - Response - The response object that will be sent back to the client.
 */
function pageNotFound(request: Request, response: Response) {
  response.status(404).json({
    statusCode: 404,
    message: `Cannot ${request.method} ${request.url}`,
    error: 'Not Found'
  })
}

export { pageNotFound }