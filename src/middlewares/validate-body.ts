import type { NextFunction, Request, Response } from 'express'
import type { ClassConstructor } from 'class-transformer'
import type { ValidationError } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

/**
 * It takes a class constructor as an argument, and returns a middleware function that validates the
 * request body against the class constructor.
 * @param Cls - ClassConstructor<T> - The class that you want to validate the request body against.
 * @returns A function that takes a request, response, and next function.
 */
function validateBody<T extends Record<string, unknown>>(Cls: ClassConstructor<T>) {
  return async function (request: Request, response: Response, next: NextFunction) {
    if (!request.get('Content-Type')?.includes('application/json')) return next()
    const instance = plainToInstance(Cls, request.body)
    const errors = (await validate(instance, { whitelist: true }))
      .reduce((errors: string[], item: ValidationError) => {
        for (const key in item.constraints) {
          errors.push(item.constraints[key])
        }
        return errors
      }, [])
    if (!errors.length) {
      request.body = instance
      return next()
    }
    response.status(400).json({
      statusCode: 400,
      message: errors[0],
      error: 'Bad Request'
    })
  }
}

export { validateBody }