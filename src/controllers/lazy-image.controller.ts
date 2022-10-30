import sharp from 'sharp'
import { Router } from 'express'
import { BadRequestError, InternalServerError, NotFoundError } from 'express-response-errors'
import { existsSync } from 'fs'
import { join } from 'path'
import { cache } from '../services'
import type { Request, Response, NextFunction } from 'express'

const controller = Router()

controller
  .get('/', async function (request: Request, response: Response, next: NextFunction) {
    const source = request.query.s as string
    if (!source) return next(new BadRequestError('No source'))
    if (!source.startsWith('/')) return next(new BadRequestError('Invalid source'))
    const sourceLocation = join(__dirname, '../../public/static', source)
    if (!existsSync(sourceLocation))
      return next(new NotFoundError('Source image not found'))
    try {
      const cachedData = await cache.get(`lazy-image-${source}`)
      if (typeof cachedData === 'string')
        return response.end(cachedData)
      const data = await sharp(sourceLocation)
        .resize(1, 1)
        .toBuffer()
      const base64 = `data:image/gif;base64,${data.toString('base64')}`
      await cache.put(`lazy-image-${source}`, base64)
      response.end(base64)
    } catch (error) {
      const message = error instanceof Error ? error.message : void 0
      next(new InternalServerError(message))
    }
  })

export { controller }