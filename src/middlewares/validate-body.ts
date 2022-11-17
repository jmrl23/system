import type { NextFunction, Request, Response } from 'express'
import type { ClassConstructor } from 'class-transformer'
import type { ValidationError } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { BadRequestError } from 'express-response-errors'

/**
 * It takes a class constructor as an argument, and returns a middleware function that validates the
 * request body against the class constructor
 * @param {ClassConstructor<T>} Cls - ClassConstructor<T> - This is the class that you want to validate.
 * @returns The function is being returned.
 */
export function validateBody<T>(Cls: ClassConstructor<T>) {
  return async function (
    request: Request,
    _response: Response,
    next: NextFunction
  ) {
    if (!request.headers['content-type']?.startsWith('application/json'))
      return next(new BadRequestError('Invalid Content-Type'))
    const instance = plainToInstance<T, unknown>(
      Cls,
      request.body
    ) as typeof Cls
    const errors = (await validate(instance, { whitelist: true })).reduce(
      (errors: string[], item: ValidationError) => {
        for (const key in item.constraints) {
          errors.push(item.constraints[key])
        }
        return errors
      },
      []
    )
    if (!errors.length) {
      request.body = instance
      return next()
    }
    next(new BadRequestError(errors[0]))
  }
}
